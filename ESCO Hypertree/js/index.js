/*global Request:true, $jit:true*/

(function() {

//Log singleton
var Log = {
  elem: null,
  timer: null,

  getElem: function() {
    if (!this.elem) {
      return (this.elem = $('log-message'));
    }
    return this.elem;
  },

  write: function(text, hide) {
    if (this.timer) {
      this.timer = clearTimeout(this.timer);
    }

    var elem = this.getElem(),
        style = elem.style;

    style.height = '2.1em';
    elem.textContent = text;
    style.visibility = 'visible';

    if (hide) {
      this.timer = setTimeout(function() {
        style.visibility = 'hidden';
        style.height = 0;
        elem.textContent = '';
      }, 5000);
    }
  }
};

function setBackgroundForTaxonomy(){
  $(document.body).style.background = "linear-gradient(-45deg, #ffa04d, #ee8652, #ffa04d)";
}

// Style background if displayed secondary level nodes are concepts.
function setBackgroundForConcept(){
  $(document.body).style.background = "linear-gradient(-45deg, #ffb06b, #fcb18b, #ffb06b)";
}

function setBackgroundForOccupation(){
  $(document.body).style.background = "linear-gradient(-45deg, #ffbf87, #ffc4a6, #ffbf87)";
}

function setBackgroundForSkill(){
  $(document.body).style.background = "linear-gradient(-45deg, #ffd9b8, #ffd5bf, #ffd9b8)";
}

// It checks the available lower level array of input JSON, refresh the background color, relation name and returns elements inside that array as secondary level nodes.
function chooseAvailRelationSecLvl(json){
  if (json.className=='Taxonomy'){
    currentRelation = 'Top Concepts';
    setBackgroundForConcept();
    if (json._links.hasTopConcept.length < 50){
      return json._links.hasTopConcept;
    }
    else{
      Log.write('Nodes exceeds max number of display', true);
      console.log('This taxonomy contains '+json._links.hasTopConcept.length+' top concepts. \n Too many to display.');
      alert("Nodes exceeds max number of display. \nPlease try other taxonomies.");
      return [];
    }
  }
  else if (json.className=='Concept'){
    if (json._links.narrowerConcept !== undefined){
      currentRelation = 'Lower Level Concepts';
      setBackgroundForConcept();
      return json._links.narrowerConcept;
    }
    else if (json._links.narrowerOccupation !== undefined){
      currentRelation = 'Lower Level Occupations';
      setBackgroundForOccupation();
      return json._links.narrowerOccupation;
    }
    else{
      console.log('This Concept '+json.title+' does not have lower level relations.');
      return [];
    }
  }
  else if (json.className=='Occupation'){
    if (json._links.narrowerConcept !== undefined){
      currentRelation = 'Lower Level Concepts';
      setBackgroundForConcept();
      return json._links.narrowerConcept;
    }
    else if (json._links.narrowerOccupation !== undefined){
      currentRelation = 'Lower Level Occupations';
      setBackgroundForOccupation();
      return json._links.narrowerOccupation;
    }
    else if (json._links.hasEssentialSkill !== undefined){
      currentRelation = 'Essential Skills';
      setBackgroundForSkill();
      return json._links.hasEssentialSkill;
    }
    else{
      console.log('This Occupation '+json.title+' does not have lower level relations.');
      return [];
    }
  }
  else if (json.className=='Skill'){
    if (json._links.narrowerConcept !== undefined){
      currentRelation = 'Lower Level Concepts';
      setBackgroundForConcept();
      return json._links.narrowerConcept;
    }
    else if (json._links.narrowerSkill !== undefined){
      currentRelation = 'Lower Level Skills';
      setBackgroundForSkill();
      return json._links.narrowerSkill;
    }
    else if (json._links.hasEssentialSkill !== undefined){
      currentRelation = 'Essential Skills';
      setBackgroundForSkill();
      return json._links.hasEssentialSkill;
    }
    else if (json._links.hasOptionalSkill !== undefined){
      currentRelation = 'Optional Skills';
      setBackgroundForSkill();
      return json._links.hasOptionalSkill;
    }    
    else if (json._links.isEssentialForOccupation !== undefined){
      currentRelation = 'Occupations Requiring this Skill';
      setBackgroundForOccupation();
      return json._links.isEssentialForOccupation;
    }
    else{
      console.log('This Skill '+json.title+' does not have lower level relations.');
      return [];
    }
  }
  else{
    console.log('No such data type from ESCO database.');
    Log.write('Cannot find available object to display.', true);
    return [];
  }
}

// It checks the available lower level array of input JSON and returns elements inside that array as thrid level nodes.
function chooseAvailRelationThirdLvl(json){
  if (json.className=='Taxonomy'){
    if (json._links.hasTopConcept.length < 50){
      return json._links.hasTopConcept;
    }
    else{
      Log.write('Nodes exceeds max number of display', true);
      console.log('This taxonomy contains '+json._links.hasTopConcept.length+' top concepts. ');
      return [];
    }
  }
  else if (json.className=='Concept'){
    if (json._links.narrowerConcept !== undefined){
      return json._links.narrowerConcept;
    }
    else if (json._links.narrowerOccupation !== undefined){
      return json._links.narrowerOccupation;
    }
    else{
      console.log('This Concept '+json.title+' does not have lower level relations.');
      return [];
    }
  }
  else if (json.className=='Occupation'){
    if (json._links.narrowerConcept !== undefined){
      return json._links.narrowerConcept;
    }
    else if (json._links.narrowerOccupation !== undefined){
      return json._links.narrowerOccupation;
    }
    else if (json._links.hasEssentialSkill !== undefined){
      return json._links.hasEssentialSkill;
    }
    else{
      console.log('This Occupation '+json.title+' does not have lower level relations.');
      return [];
    }
  }
  else if (json.className=='Skill'){
    if (json._links.narrowerConcept !== undefined){
      return json._links.narrowerConcept;
    }
    else if (json._links.narrowerSkill !== undefined){
      return json._links.narrowerSkill;
    }
    else if (json._links.hasEssentialSkill !== undefined){
      return json._links.hasEssentialSkill;
    }
    else if (json._links.hasOptionalSkill !== undefined){
      return json._links.hasOptionalSkill;
    }    
    else if (json._links.isEssentialForOccupation !== undefined){
      return json._links.isEssentialForOccupation;
    }
    else{
      console.log('This Skill '+json.title+' does not have lower level relations.');
      return [];
    }
  }
  else{
    console.log('No such data type from ESCO database.');
    Log.write('Cannot find available object to display.', true);
    return [];
  }
}

// Draw HTML DOM buttons that displays secondary level nodes in different relationships with centre node.
var isInSchemeBtn = "<button type=\"button\" id=\"isInSchemeBtn\" class=\"btn btn-outline-primary btn-sm\">Show Upper Level Schemes</button>";
var broaderConceptBtn = "<button type=\"button\" id=\"broaderConceptBtn\" class=\"btn btn-outline-primary btn-sm\">Show Upper Level Concepts</button>";
var broaderSkillGroupBtn = "<button type=\"button\" id=\"broaderSkillGroupBtn\" class=\"btn btn-outline-primary btn-sm\">Show Broader Related Skill Group</button>";
var broaderOccupationBtn = "<button type=\"button\" id=\"broaderOccupationBtn\" class=\"btn btn-outline-primary btn-sm\">Show Upper Level Occupations</button>";
var broaderSkillBtn = "<button type=\"button\" id=\"broaderSkillBtn\" class=\"btn btn-outline-primary btn-sm\">Show Upper Level Skills</button>";
var narrowerConceptBtn = "<button type=\"button\" id=\"narrowerConceptBtn\" class=\"btn btn-outline-success btn-sm\">Show Lower Level Concepts</button>";
var narrowerOccupationBtn = "<button type=\"button\" id=\"narrowerOccupationBtn\" class=\"btn btn-outline-success btn-sm\">Show Lower Level Occupations</button>";
var narrowerSkillBtn = "<button type=\"button\" id=\"narrowerSkillBtn\" class=\"btn btn-outline-success btn-sm\">Show Lower Level Skills</button>";
var hasEssentialSkillBtn = "<button type=\"button\" id=\"hasEssentialSkillBtn\" class=\"btn btn-outline-info btn-sm\">Show Essential Skills</button>";
var hasOptionalSkillBtn = "<button type=\"button\" id=\"hasOptionalSkillBtn\" class=\"btn btn-outline-info btn-sm\">Show Optional Skills</button>";

function addIsInSchemeBtn (ht, json){
  document.getElementById('broaderOption').insertAdjacentHTML('beforeend',isInSchemeBtn);
  document.getElementById("isInSchemeBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.isInScheme, renderTree);
    displayCurrentRelation('Upper Level Schemes');
    setBackgroundForTaxonomy();
  });
}

function addBroaderConceptBtn (ht, json){
  document.getElementById('broaderOption').insertAdjacentHTML('beforeend',broaderConceptBtn);
  document.getElementById("broaderConceptBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.broaderConcept, renderTree);
    displayCurrentRelation('Upper Level Concepts');
    setBackgroundForConcept();
  });
}

function addBroaderSkillGroupBtn (ht, json){
  document.getElementById('broaderOption').insertAdjacentHTML('beforeend',broaderSkillGroupBtn);
  document.getElementById("broaderSkillGroupBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.broaderSkillGroup, renderTree);
    displayCurrentRelation('Broader Related Skill Group');
    setBackgroundForSkill();
  });
}

function addBroaderOccupationBtn (ht, json){
  document.getElementById('broaderOption').insertAdjacentHTML('beforeend',broaderOccupationBtn);
  document.getElementById("broaderOccupationBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.broaderOccupation, renderTree);
    displayCurrentRelation('Upper Level Occupations');
    setBackgroundForOccupation();
  });
}

function addBroaderSkillBtn (ht, json){
  document.getElementById('broaderOption').insertAdjacentHTML('beforeend',broaderSkillBtn);
  document.getElementById("broaderSkillBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.broaderSkill, renderTree);
    displayCurrentRelation('Upper Level Skills');
    setBackgroundForSkill();
  });
}
function addNarrowerConceptBtn (ht, json){
  document.getElementById('narrowerOption').insertAdjacentHTML('beforeend',narrowerConceptBtn);
  document.getElementById("narrowerConceptBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.narrowerConcept, renderTree);
    displayCurrentRelation('Lower Level Concepts');
    setBackgroundForConcept();
  });
}

function addNarrowerOccupationBtn (ht, json){
  document.getElementById('narrowerOption').insertAdjacentHTML('beforeend',narrowerOccupationBtn);
  document.getElementById("narrowerOccupationBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.narrowerOccupation, renderTree);
    displayCurrentRelation('Lower Level Occupations');
    setBackgroundForOccupation();
  });
}

function addNarrowerSkillBtn (ht, json){
  document.getElementById('narrowerOption').insertAdjacentHTML('beforeend',narrowerSkillBtn);
  document.getElementById("narrowerSkillBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.narrowerSkill, renderTree);
    displayCurrentRelation('Lower Level Skills');
    setBackgroundForSkill();
  });
}

function addHasEssentialSkillBtn (ht, json){
  document.getElementById('narrowerOption').insertAdjacentHTML('beforeend',hasEssentialSkillBtn);
  document.getElementById("hasEssentialSkillBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.hasEssentialSkill, renderTree);
    displayCurrentRelation('Essential Skills');
    setBackgroundForSkill();
  });
}

function addHasOptionalSkillBtn (ht, json){
  document.getElementById('narrowerOption').insertAdjacentHTML('beforeend',hasOptionalSkillBtn);
  document.getElementById("hasOptionalSkillBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.hasOptionalSkill, renderTree);
    displayCurrentRelation('Optional Skills');
    setBackgroundForSkill();
  });
}

// It checks the available object name of input JSON and returns elements inside that array.
function addBtnForObjArray(ht, json){

  // Refresh previous loaded buttons.
  document.getElementById('broaderOption').innerHTML = "";
  document.getElementById('narrowerOption').innerHTML = "";

  if (json.className=='Taxonomy'){
    
  }
  // Available buttons are listed based on ESCOn API Documentation.
  else if (json.className=='Concept'){
    if (json._links.isInScheme !== undefined){
      addIsInSchemeBtn (ht, json);
    }
    if (json._links.broaderConcept !== undefined){
      addBroaderConceptBtn (ht, json);
    }
    if (json._links.narrowerConcept !== undefined){
      addNarrowerConceptBtn (ht, json);
    }
    if (json._links.narrowerOccupation !== undefined){
      addNarrowerOccupationBtn (ht, json);
    }
  }
  else if (json.className=='Occupation'){
    if (json._links.isInScheme !== undefined){
      addIsInSchemeBtn (ht, json);
    }
    if (json._links.broaderConcept !== undefined){
      addBroaderConceptBtn (ht, json);
    }
    if (json._links.broaderOccupation !== undefined){
      addBroaderOccupationBtn (ht, json);
    }
    if (json._links.narrowerConcept !== undefined){
      addNarrowerConceptBtn (ht, json);
    }
    if (json._links.narrowerOccupation !== undefined){
      addNarrowerOccupationBtn (ht, json);
    }
    if (json._links.hasEssentialSkill !== undefined){
      addHasEssentialSkillBtn (ht, json);
    }
    if (json._links.hasOptionalSkill !== undefined){
      addHasOptionalSkillBtn (ht, json);
    }
  }
  else if (json.className=='Skill'){
    if (json._links.isInScheme !== undefined){
      addIsInSchemeBtn (ht, json);
    }
    if (json._links.broaderSkillGroup !== undefined){
      addBroaderSkillGroupBtn (ht, json);
    }
    if (json._links.broaderConcept !== undefined){
      addBroaderConceptBtn (ht, json);
    }
    if (json._links.broaderSkill !== undefined){
      addBroaderSkillBtn (ht, json);
    }
    if (json._links.narrowerConcept !== undefined){
      addNarrowerConceptBtn (ht, json);
    }    
    if (json._links.narrowerSkill !== undefined){
      addNarrowerSkillBtn (ht, json);
    }
    if (json._links.hasEssentialSkill !== undefined){
      addHasEssentialSkillBtn (ht, json);
    }
    if (json._links.hasOptionalSkill !== undefined){
      addHasOptionalSkillBtn (ht, json);
    }
  }
  else{
    Log.write('Cannot find available relations to display.', true);
  }
}

// Display current displayed relation type.
function displayCurrentRelation(input) {
  document.getElementById('currentRelation').innerHTML = "<h5> Displaying " + input + "</h5>";
}

// Convert the retrieved JSON object to displayable JSON
function getSecLvlNodes(json) {

  // Assign the title as the key name for the new JSON object.
  var name = json.title;
  var output = {};
  output[json.title] = {};
  var lowerLevel = [];

  var x = chooseAvailRelationSecLvl(json);
  if (x == []){
    secondaryNodeName = [];
    output[json.title] = [];
  }
  else if (x !== undefined){
    loadedRelationTree = x;

    // Read title of each node.
    secondaryNodeName = loadedRelationTree.map(function(el){
      console.log('Use map to get all concept names: ' + el.title);
      return el.title;
    }); 

    // Add the name of each occupation into "name".
    for(var i = 0; i < secondaryNodeName.length; i++){
      // console.log(secondaryNodeName[i]);
      output[json.title][secondaryNodeName[i]] = [];
    }
  }

  return output;
}

// Display second level nodes based on button clicked by user.
function getSecLvlNodesByClickingBtn(json, clickedArray) {

  // Assign the title as the key name for the new JSON object.
  var name = json.title;
  var output = {};
  output[json.title] = {};
  var lowerLevel = [];
 
  // Add arrays of nodes around it.
  // Read title of each node.
  secondaryNodeName = clickedArray.map(function(el){
    console.log('Use map to get all concept names: ' + el.title);
    return el.title;
  }); 

  // Add the name of each occupation into "name".
  for(var i = 0; i < secondaryNodeName.length; i++){
    // console.log(secondaryNodeName[i]);
    output[json.title][secondaryNodeName[i]] = [];
  }
  return output;
}

// Build the hypertree based on the JSON object
function buildTreeJSON(convertedJson, json, thirdLevelArray) {
  var keys = {},
      tree, root, children, key, name, lowerLevel;
  var i = 0;
  // Each key in that JSON object has a tree
  for (key in convertedJson) {
    console.log("Debugging for buildTreeJSON... each first level node is: " + key);
    tree = {
      id: key,
      name: key,
      children: []
    };
    // All the secondary nodes of this main node.
    children = convertedJson[key];
    // console.log("After children = json[key], children becomes: " + JSON.stringify(children));

    // For each secondary level node (key is the name of that node).
    for (key in children) {
      // console.log("Debugging for buildTreeJSON... each secondary level node is: " + key);
      name = key;
      if (!keys.hasOwnProperty(key)) {
        keys[key] = 1;
      } else {
        key = key + keys[key]++;
      }

      if (thirdLevelArray[i] != undefined) {
        // construct the third level nodes for each secondary node.
        children[name] = thirdLevelArray[i];
      }
      else
        // If they are not retrieved, we will leave it blank.
        children[name] = [];
      i++;

      // Construct the hypertree by adding each branch.
      tree.children.push({
        id: key,
        name: name,
        // map function returns an array with the square root of all the values in the original array.
        children: children[name].map(function(key) {
          var name = key;
          // check if "keys" object does not have "key" property
          if (!keys.hasOwnProperty(key)) {
            // assign the value 1 to the var key of this "keys" object
            keys[key] = 1;
          } else {
            key = key + keys[key]++;
          }
          return {
            id: key,
            name: name
          };
        })
      });
    }
  }
  return tree;
}

// It stores the JSON response as a global variable.
var JSONResponse;
// Stores JSON response for all secondary node.
// var loadedJSONofSecondaryLevelNodes;
// It stores all secondary level nodes in an array.
var secondaryNodeName;
// It stores the JSON of currently loaded relation tree.
var loadedRelationTree;
// It stores the href that returns JSON for building new hypertree.
var hrefToVisualize; 
// Store the href user is currently viewing.
var currentHref;
// Store current displayed node relation.
var currentRelation;

// It initializes the hypertree with top concepts after loading the page.
function InitializeTree(ht, callback) {
  
  console.log('**************InitializeTree Stage**************');
  var iscoHref = 'https://ec.europa.eu/esco/api/resource/taxonomy?uri=http://data.europa.eu/esco/concept-scheme/isco&language=en';
  // Request json format data through ESCO API.
  new Request.JSON({
    url: iscoHref,
    // If the GET request is successful, build the hyper tree with the JSON object inside the file.
    onSuccess: function(json) {
      // Initialize all pre loaded JSON.
      // loadedJSONofSecondaryLevelNodes = [];
      currentRelation = '';
      JSONResponse = json;
      currentHref = iscoHref;

      // Convert the original JSON get from ESCO to new JSON format that is displayable.
      output = getSecLvlNodes(json);

      // Display relation of nodes.
      displayCurrentRelation(currentRelation);

      loadedRelationTree = json._links.hasTopConcept;

      // Use promise to make sure all responses from API requests are retrieved before the hypertree construction.
      var promises = loadedRelationTree.map(({href}) => new Promise((resolve, reject) => {
        new Request.JSON({
          url: href,
          // If the GET request is successful, build the hyper tree with the JSON object inside the file.
          onSuccess: function(json) {
            // Store this secondary node JSON to use globally.
            // loadedJSONofSecondaryLevelNodes.push(json);
            // lowerlevel stores all the sub-categories for this node.
            var lowerLevel = json._links.narrowerConcept.map(function(el){
              return el.title;
            });
            console.log('Third level nodes are: ' + lowerLevel);
            resolve(lowerLevel);
          },
          onFailure: function(error) {
            reject(error);
          }
        }).get();
      }));
      
      // Wait for responses from all the API requests. 
      const result = Promise.all(promises);

      // Parse down the titles for each response.
      result.then(res=>{
        // console.log('All JSON responses are: '+ JSON.stringify(res));
        displayDescription(json);
        json = buildTreeJSON(output,json,res);
        callback(ht, json);
        Log.write('Done.', true);
      }).catch(error=>{
        console.log('Failed for the tree construction and rendering.' + error);
      });
    },
    onFailure: function(e) {
      Log.write('Cannot get response from ESCO API.', true);
    }
  }).get();
}

// It loads the new hypertree after user clicking one node.
function loadTree(ht, clickedNode, callback) {
  console.log('**************We are in loadTree Stage :D**************');
  // Check if the clickedNode is a skill title or an http address.
  if (clickedNode.indexOf('https://') > -1){
    hrefToVisualize = clickedNode;
    console.log('Input is an URL.');
  }
  // If that is a node name, look for its href through JSON retrieved last time.
  else if (secondaryNodeName.includes(clickedNode)){
    for (var i=0 ; i < secondaryNodeName.length ; i++){
      // If href is found through the JSON.
      if (loadedRelationTree[i].title == clickedNode) {
        hrefToVisualize = loadedRelationTree[i].href;
        console.log('After clicking node ' + clickedNode + ', new href will be requested: \n' + hrefToVisualize);
      }
      else{
        Log.write('Looking for the node...', true);
      }
    }
  }
  // If that is a third level node:
  else {
    // Search through the JSON response containing all third level nodes.

  }

  // If user clicks the centre node.
  if (currentHref == hrefToVisualize && currentHref !== undefined){
    console.log('The clicked node is already centered.');
    Log.write('This node is already centered.', true);
    return;
  }
  
  // Request json format data through ESCO API.
  new Request.JSON({
    // url should be the href for clicked node.
    url: hrefToVisualize,
    // If the GET request is successful, build the hyper tree with the JSON object inside the file.
    onSuccess: function(json) {

      // Initialize all pre loaded JSON.
      // loadedJSONofSecondaryLevelNodes = [];
      currentRelation = '';
      JSONResponse = json;
      currentHref = hrefToVisualize;

      // Add buttons based on its available object arrays.
      addBtnForObjArray(ht, json);

      // Convert the original JSON get from ESCO to new JSON format that is displayable.
      output = getSecLvlNodes(json);

      // Display the name of current viewed relation tree.
      displayCurrentRelation(currentRelation);
      console.log('Checking the className of retrieved JSON...');
      // Use promise to make sure all responses from API requests are retrieved before the hypertree construction and visualization.
      var promises = chooseAvailRelationSecLvl(json).map(({href}) => new Promise((resolve, reject) => {
        new Request.JSON({
          url: href,
          // If the GET request is successful, build the hyper tree with the JSON object inside the file.
          onSuccess: function(json) {
            // Store this secondary node JSON to use globally.
            // loadedJSONofSecondaryLevelNodes.push(json);
            // lowerlevel stores all the sub-categories for this node.
            var lowerLevel = chooseAvailRelationThirdLvl(json).map(function(el){
              return el.title;
            });
            // console.log('Third level nodes are: ' + lowerLevel);
            resolve(lowerLevel);
          },
          onFailure: function(error) {
            reject(error);
          }
        }).get();
      }));
      
      // Wait for responses from all the API requests. 
      const result = Promise.all(promises);

      // Parse down the titles for each response.
      result.then(res=>{
        console.log('All JSON responses are: '+ JSON.stringify(res));
        displayDescription(json);

        json = buildTreeJSON(output,json,res);
        callback(ht, json);
        Log.write('Done.', true);
      }).catch(error=>{
        console.log('Failed for the tree construction and rendering.' + '\n' + error);
      });
    },
    onFailure: function(e) {
      Log.write('There\'s no entry in the database for ' + clickedNode + '. Please try again later.', true);
    }
  }).get();
}

// Load the new hyper tree after user clicking the buttons for alternative relationships.
function loadTreeByClickingBtn(ht, json, clickedArray, callback){
  // Initialize all pre loaded JSON.
  // loadedJSONofSecondaryLevelNodes = [];
  JSONResponse = json;
  currentHref = json._links.self.href;
  loadedRelationTree = clickedArray;
  // Convert the original JSON get from ESCO to new JSON format that is displayable.
  output = getSecLvlNodesByClickingBtn(json, clickedArray);
  console.log('Checking the className of retrieved JSON...');
  // Use promise to make sure all responses from API requests are retrieved before the hypertree construction and visualization.
  var promises = clickedArray.map(({href}) => new Promise((resolve, reject) => {
    new Request.JSON({
      url: href,
      // If the GET request is successful, build the hyper tree with the JSON object inside the file.
      onSuccess: function(json) {
        // Store this secondary node JSON to use globally.
        // loadedJSONofSecondaryLevelNodes.push(json);
        // console.log('Checking the searchRange for href: ' + href + '\n' + searchRange);
        // lowerlevel stores all the sub-categories for this node.
        var lowerLevel;
        var x = chooseAvailRelationThirdLvl(json);
        if (x == "")
          lowerLevel = [];
        else{
          lowerLevel = chooseAvailRelationThirdLvl(json).map(function(el){
            return el.title;
          });
        }
        console.log('Third level nodes are: ' + lowerLevel);
        resolve(lowerLevel);
      },
      onFailure: function(error) {
        reject(error);
      }
    }).get();
  }));
  
  // Wait for responses from all the API requests. 
  const result = Promise.all(promises);

  // Parse down the titles for each response.
  result.then(res=>{
    console.log('All JSON responses are: '+ JSON.stringify(res));
    displayDescription(json);

    json = buildTreeJSON(output,json,res);
    callback(ht, json);
    Log.write('Done.', true);
  }).catch(error=>{
    console.log('Failed for the tree construction and rendering.' + '\n' + error);
  });
}

// Display the basic information for clicked node. Assign the className, title, description to the sidebar.
function displayDescription(json){
  var description = "N/A";
  try{
    description = json.description.en.literal;
  }
  catch{
    console.log("No description for this node.");
  }

  description = "<h5> Current " + json.className + " Name: </h5>"
  + json.title + "<hr class=\"style14\"></br><h5> Description: </h5>" + description;

  body.getElementById("descriptionInnerBox").innerHTML = description;
}

function renderTree(ht, json) {
  console.log('renderTree stage...');
  //load JSON data
  ht.loadJSON(json);
  ht.graph.eachNode(function(n) {
    var pos = n.getPos();
    pos.setc(0, 0);
  });
  ht.compute('end');
  ht.fx.animate({
    modes:['polar'],
    duration: 1000,
    hideLabels: true,
    transition: $jit.Trans.Quint.easeInOut
  });
}

// Print out the object with circular reference
const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

// Draw the tree graph.
function buildGraph() {
  var ht = new $jit.Hypertree({

        //id of the visualization container 
        injectInto: 'tree',
        offset: 0.1,

        Navigation: {
          enable: true,
          panning: true,
          zooming: 100
        },

        Node: {
          overridable: true,
          color: 'red',
          dim: 9,
          CanvasStyles: {
            shadowBlur: 6,
            shadowColor: '#633901'
          }
        },

        Edge: {
          overridable: true,
          color: '#662403',
          lineWidth:1.8
        },
        // Attach event handlers and add text to the labels. This method is only triggered on label creation 
        onCreateLabel: function(domElement, node){
          domElement.innerHTML = node.name;

          // The label will be highlighted when hovering on it.
          domElement.addEventListener("mouseover", function() {
            if ($(domElement).hasClass('depth0')){
              domElement.style.zIndex = '101';
              domElement.style.fontSize = '0.9em';
            }
            else if ($(domElement).hasClass('depth2')){
              domElement.style.zIndex = '101';
              domElement.style.fontSize = '0.8em';
              domElement.style.backgroundColor = '#fff';
              domElement.style.padding = '2px 4px';
              domElement.style.borderRadius = '0.6em';
              domElement.style.boxShadow = '0.6em';
            }
          });
          domElement.addEventListener("mouseout", function() {
            if ($(domElement).hasClass('depth0')){
              domElement.style.zIndex = '100';
              domElement.style.fontSize = '0.8em';
            }
            else if ($(domElement).hasClass('depth2')){
              domElement.style.zIndex = '0';
              domElement.style.fontSize = '0.75em';
              domElement.style.backgroundColor = '';
              domElement.style.padding = '';
              domElement.style.borderRadius = '';
              domElement.style.boxShadow = '';
            }
          });

          // Set the events on clicking the labels.
          domElement.onclick = function(){
            console.log('***********You clicked one label!***********\n' + node.name);

            // console.log('Full information about clicked node: \n' + JSON.stringify(node, getCircularReplacer()));
            if (!$(domElement).hasClass('depth0')) {
              console.log('The clicked label is NOT in depth0 .\n');
              return;
            }

            // // Check available relations of clicked node 
            // for (var i = 0; i < loadedJSONofSecondaryLevelNodes.length; i++){
            //   if (node.name == loadedJSONofSecondaryLevelNodes[i].title){

            //   }
            // }

            // // Get available relation options:
            // var relationList = "Test List";

            // // Get label's current position.
            // console.log(domElement);
            // let clickedLabel = document.getElementById(node.id);
            // let compStyles = window.getComputedStyle(clickedLabel);
            // console.log("Pre loaded JSON for all SecLvlNodes are: "+ JSON.stringify(loadedJSONofSecondaryLevelNodes, getCircularReplacer()));

            // // Show available relation options below the clicked label.
            // $('relationOptionList').insertAdjacentHTML('beforeend',relationList);
            // $('relationOptionList').style.top = compStyles.getPropertyValue('top');
            // $('relationOptionList').style.left = compStyles.getPropertyValue('left');
            // $('relationOptionList').style.visibility = 'visible';

            loadTree(ht, node.name, function(ht, json) {
              console.log(node.id);
              json.id = node.id;
              window.location = '#' + encodeURIComponent(node.name);
              ht.onClick(node.id, {
                hideLabels: true,
                onComplete: function() {
                  // Transform into new tree.
                  ht.op.morph(json, {
                    type: 'fade',
                    id: node.id,
                    duration: 1000,
                    hideLabels: true
                  });
                }
              });
            });
          };
        },

        //Change node styles when labels are placed or moved.  
        onPlaceLabel: function(domElement, node){
          var style = domElement.style;
          style.display = '';

          if (node._depth <= 1) {
            domElement.className = 'node depth0';
          } else if(node._depth == 2){
            domElement.className = 'node depth2';
          } else {
            style.display = 'none';
          }

          var left = parseInt(style.left, 10);
          var w = domElement.offsetWidth;
          style.left = (left - w / 2) + 'px';
        }
      });

  return ht;
}


// It builds up the searching results that are occupations.
function buildOccupationResultList(ht, input) {
  var href = 'https://ec.europa.eu/esco/api/search?text=' + input + '&language=en&type=occupation&facet=isInScheme&limit=10&offset=2';
  getSearchResult(ht, href);
  Log.write('Here are the matching occupations.', true);
}

// It builds up the searching results that are occupations.
function buildSkillResultList(ht, input) {
  var href = 'https://ec.europa.eu/esco/api/search?text=' + input + '&language=en&type=skill&facet=isInScheme&limit=10&offset=2';
  getSearchResult(ht, href);
  Log.write('Here are the matching skills.', true);
}

// It builds up the searching results that are occupations.
function buildConceptResultList(ht, input) {
  var href = 'https://ec.europa.eu/esco/api/search?text=' + input + '&language=en&type=concept&facet=isInScheme&limit=10&offset=2';
  getSearchResult(ht, href);
  Log.write('Here are the matching concepts.', true);
}

function getSearchResult(ht, href){
  var myRequest = new XMLHttpRequest();
  // open the request and pass the HTTP method name and the resource as parameters
  myRequest.open('GET', href);
  // 3. write a function that runs anytime the state of the AJAX request changes
  myRequest.onreadystatechange = function () { 
    // If server responds successfully
    if (myRequest.readyState === 4 && myRequest.status === 200) {
      // Switch the class of description tag to expanded with new style.
      $('search-range').style.visibility = 'visible';
      var resJSON = JSON.parse(myRequest.responseText);
      // Build the list of searching result.
      buildResultList(ht, resJSON, addListenerToResultLink);
    }
  };
  myRequest.send();
}

// Display searching result in a list.
function buildResultList(ht, resJSON, callback){
  var result = resJSON._embedded.results;
  // If no results found
  if (result.length == 0) {
    console.log("No results found.");
    $('search-result').innerHTML = "No results found.";
  }
  else {
    // Initialize the result list.
    $('search-result').innerHTML = "";
    result.forEach(function(each) {
      console.log(each);
      // Construct the clickable occupation names into a list.
      var listItem = "<li class=\"search-result-link\"><a class=\"list-group-item list-group-item-action\" href=\"" 
      + each._links.self.href + "\" >" + each._links.self.title + "</a></li>";

      $('search-result').insertAdjacentHTML('beforeend',listItem);
    });
    // attach listener.
    callback(ht);
  }
}

// send GET request for text searching via AJAX
function sendTheAJAX(ht, input) {
  // Initialize the result list.
  $('search-result').innerHTML = "";

  if (input == ""){
    console.log('No text to search for.');
    $('search-result').innerHTML = "";
    // hide the result option buttons as well
    $('search-range').style.visibility = 'hidden';
  }
  else {
    buildOccupationResultList(ht, input);
    addListenerToSearchOptionBtn(ht, input);
  }
}

function addListenerToSearchOptionBtn(ht, input){
  // Attach listener to result option buttons:
  $('search-result-skill').addEvent('click', function(e) {
    e.stop();
    buildSkillResultList(ht, input);
    Log.write('Here are the matching skills.', true);
  });
  $('search-result-occupation').addEvent('click', function(e) {
    e.stop();
    buildOccupationResultList(ht, input);
    Log.write('Here are the matching occupations.', true);
  });
  $('search-result-concept').addEvent('click', function(e) {
    e.stop();
    buildConceptResultList(ht, input);
    Log.write('Here are the matching concepts.', true);
  });
}

function removeListenerFromSearchOptionBtn(){
  $('search-result-skill').removeEventListener("click", buildSkillResultList);
  $('search-result-occupation').removeEventListener("click", buildOccupationResultList);
  $('search-result-concept').removeEventListener("click", buildConceptResultList);
}

function addListenerToResultLink(ht){
  var resultLinks = document.getElementsByClassName("search-result-link");
  console.log('There are ' + resultLinks.length + ' elements selected.');
  // Add action listener to all the searching result links.
  try{
    for (var i=0; i<resultLinks.length; i++){
      resultLinks[i].addEventListener("click", function(event) {
        // Prevent the link from redirecting when clicking on it.
        event.preventDefault();
        loadTree(ht, event.target.href, renderTree);
      });
    };
    console.log('Listener attached to result tags!');
  }
  catch{
    console.log('No result tag available.');
  }
}

// Contains the window Event 'domready', which executes when the DOM is loaded.
// To ensure that DOM elements exist when the code attempts to access them is executed, they need to be placed within the 'domready' event.
window.addEvent('domready', function(e) {
  var body = $(document.body),
      header = body.getElement('header'),
      links = body.getElements('nav > ul > li > a'),
      input = $('input-names'),
      select = $('other-select'),
      datalist = $('artist-names'),
      ht = buildGraph(),
      firstNode = decodeURIComponent(window.location.hash.slice(1)) || 'ISCO 2008',
      list;

  // Add event handler to "hide" button.
  $('toggle').addEvent('click', function(e) {
    e.stop();
    if (!header.hasClass('hidden')){
      header.toggleClass('hidden');
      // Move the sidebar upwards to hide it.
      var compStyles = window.getComputedStyle(header);
      // Just leave 50px height when it's hidden.
      var headerHeight = parseFloat(compStyles.getPropertyValue('height'))-80;
      header.style.top = "-" + headerHeight + "px";
      // Change the text of link after clicking
      this.textContent = 'Click here to ' + (header.hasClass('hidden') ? 'show' : 'hide');
    }
    else{
      // If header is hidden currently.
      header.style.top = "";
      header.toggleClass('hidden');
      // Change the text of link after clicking
      this.textContent = 'Click here to ' + (header.hasClass('hidden') ? 'show' : 'hide');
    }
    
  });

  // Add event handler to "hide" button.
  $('switch1').addEvent('click', function(e) {
    e.stop();
    // Switch the class of description tag to expanded with new style.
    body.getElementById("description").toggleClass('expanded');
    // Change the text of link after clicking
    $('switch1').textContent = body.getElementById("description").hasClass('expanded') ? 'Collapse' : 'Expand';
  });

  // // Add event handler to "rotate" button.
  // $('rotateBtn').addEvent('click', function(e) {
  //   e.stop();
  //   // Switch the class of description tag to expanded with new style.
  //   body.getElementById("tree-canvaswidget").toggleClass('rotated');
  
  // });

  // Allow user to go back to the original hyper tree by clicking on the topic.
  $('goTopLevel').addEvent('click', function(e) {
    e.stop();
    // Refresh previous loaded buttons.
    document.getElementById('broaderOption').innerHTML = "";
    document.getElementById('narrowerOption').innerHTML = "";
    InitializeTree(ht, renderTree);
  });

  // Load new treemap based on links clicked by user.
  links.addEvent('click', function(e) {
    e.stop();
    var name = this.textContent;
    var href = this.getAttribute("href");
    console.log('The href of the clicked name is: ' + href);

    // Assign the name to input field.
    input.value = name;

    // refresh the http address of current page
    window.location = '#' + encodeURIComponent(name);

    loadTree(ht, href, renderTree);
  });

  // Load new treemap based on band name input by user in textfield.
  input.addEventListener('change', function(e) {
    sendTheAJAX(ht, this.value);
  });

  // Search the text by typing enter button.
  input.addEvent('keyup', function(e) {
    if (e.key == 'enter') {
      input.fireEvent('change', e);
    }
  });


  // Resize canvas based on resizing of window
  window.addEvent('resize', function(e) {
    ht.canvas.resize(window.innerWidth,
                         window.innerHeight);
  });

  // Display the highest level of concepts at the beginning.
  InitializeTree(ht, renderTree);

});

})();

