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

// It checks the available object name of input JSON and returns elements inside that array.
function chkAvlObjName(json){
  if (json.className=='Taxonomy'){
    return json._links.hasTopConcept;
  }
  else if (json.className=='Concept'){
    if (json._links.narrowerConcept !== undefined){
      return json._links.narrowerConcept;
    }
    else if (json._links.narrowerOccupation !== undefined){
      return json._links.narrowerOccupation;
    }
  }
  else if (json.className=='Occupation'){
    if (json._links.narrowerOccupation !== undefined){
      return json._links.narrowerOccupation;
    }
    else if (json._links.hasEssentialSkill !== undefined){
      return json._links.hasEssentialSkill;
    }
  }
  else if (json.className=='Skill'){
    if (json._links.narrowerSkill !== undefined){
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
  }
  else{
    console.log('No such data type from ESCO database.');
    Log.write('Cannot find available object to display.', true);
  }
}

// Draw HTML DOM buttons that displays secondary level nodes in different relationships with centre node.
var isInSchemeBtn = "<button type=\"button\" id=\"isInSchemeBtn\" class=\"btn btn-outline-primary btn-sm\">Show Upper Level Schemes</button>";
var broaderConceptBtn = "<button type=\"button\" id=\"broaderConceptBtn\" class=\"btn btn-outline-primary btn-sm\">Show Upper Level Concepts</button>";
var broaderSkillGroupBtn = "<button type=\"button\" id=\"broaderSkillGroupBtn\" class=\"btn btn-outline-primary btn-sm\">Show broader related skill group</button>";
var broaderOccupationBtn = "<button type=\"button\" id=\"broaderOccupationBtn\" class=\"btn btn-outline-primary btn-sm\">Show Upper Level Occupations</button>";
var broaderSkillBtn = "<button type=\"button\" id=\"broaderSkillBtn\" class=\"btn btn-outline-primary btn-sm\">Show Higher Level Skills</button>";
var narrowerConceptBtn = "<button type=\"button\" id=\"narrowerConceptBtn\" class=\"btn btn-outline-success btn-sm\">Show Lower Level Concepts</button>";
var narrowerOccupationBtn = "<button type=\"button\" id=\"narrowerOccupationBtn\" class=\"btn btn-outline-success btn-sm\">Show Lower Level Occupations</button>";
var narrowerSkillBtn = "<button type=\"button\" id=\"narrowerSkillBtn\" class=\"btn btn-outline-success btn-sm\">Show Lower Level Skills</button>";
var hasEssentialSkillBtn = "<button type=\"button\" id=\"hasEssentialSkillBtn\" class=\"btn btn-outline-success btn-sm\">Show Essential Skills</button>";
var hasOptionalSkillBtn = "<button type=\"button\" id=\"hasOptionalSkillBtn\" class=\"btn btn-outline-success btn-sm\">Show Optional Skills</button>";

function addIsInSchemeBtn (ht, json){
  document.getElementById('broaderOption').insertAdjacentHTML('beforeend',isInSchemeBtn);
  document.getElementById("isInSchemeBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.isInScheme, renderTree);
  });
}

function addBroaderConceptBtn (ht, json){
  document.getElementById('broaderOption').insertAdjacentHTML('beforeend',broaderConceptBtn);
  document.getElementById("broaderConceptBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.broaderConcept, renderTree);
  });
}

function addBroaderOccupationBtn (ht, json){
  document.getElementById('broaderOption').insertAdjacentHTML('beforeend',broaderOccupationBtn);
  document.getElementById("broaderConceptBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.broaderOccupation, renderTree);
  });
}

function addNarrowerConceptBtn (ht, json){
  document.getElementById('narrowerOption').insertAdjacentHTML('beforeend',narrowerConceptBtn);
  document.getElementById("narrowerConceptBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.narrowerConcept, renderTree);
  });
}

function addNarrowerOccupationBtn (ht, json){
  document.getElementById('narrowerOption').insertAdjacentHTML('beforeend',narrowerOccupationBtn);
  document.getElementById("narrowerOccupationBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.narrowerOccupation, renderTree);
  });
}

function addHasEssentialSkillBtn (ht, json){
  document.getElementById('narrowerOption').insertAdjacentHTML('beforeend',hasEssentialSkillBtn);
  document.getElementById("hasEssentialSkillBtn").addEventListener("click", function(){
    loadTreeByClickingBtn(ht, json, json._links.hasEssentialSkill, renderTree);
  });
}

// It checks the available object name of input JSON and returns elements inside that array.
function addBtnForObjArray(ht, json){

  // Refresh previous loaded buttons.
  document.getElementById('broaderOption').innerHTML = "";
  document.getElementById('narrowerOption').innerHTML = "";

  if (json.className=='Taxonomy'){
    return json._links.hasTopConcept;
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
      document.getElementById('narrowerOption').insertAdjacentHTML('beforeend',hasOptionalSkillBtn);
    }
  }
  else if (json.className=='Skill'){
    if (json._links.isInScheme !== undefined){
      document.getElementById('broaderOption').insertAdjacentHTML('beforeend',isInSchemeBtn);
    }
    if (json._links.broaderSkillGroup !== undefined){
      document.getElementById('broaderOption').insertAdjacentHTML('beforeend',broaderSkillGroupBtn);
    }
    if (json._links.broaderConcept !== undefined){
      document.getElementById('broaderOption').insertAdjacentHTML('beforeend',broaderConceptBtn);
    }
    if (json._links.broaderSkill !== undefined){
      document.getElementById('broaderOption').insertAdjacentHTML('beforeend',broaderSkillBtn);
    }
    if (json._links.narrowerConcept !== undefined){
      document.getElementById('narrowerOption').insertAdjacentHTML('beforeend',narrowerConceptBtn);
    }    
    if (json._links.narrowerSkill !== undefined){
      document.getElementById('narrowerOption').insertAdjacentHTML('beforeend',narrowerSkillBtn);
    }
    if (json._links.hasEssentialSkill !== undefined){
      document.getElementById('narrowerOption').insertAdjacentHTML('beforeend',hasEssentialSkillBtn);
    }
    if (json._links.hasOptionalSkill !== undefined){
      document.getElementById('narrowerOption').insertAdjacentHTML('beforeend',hasOptionalSkillBtn);
    }
  }
  else{
    console.log('No such data type from ESCO database.');
    Log.write('Cannot find available object to display.', true);
  }
}



// Convert the retrieved JSON object to displayable JSON
function convertJSONFormat(json) {

  // Assign the title as the key name for the new JSON object.
  var name = json.title;
  var output = {};
  output[json.title] = {};
  var lowerLevel = [];
 
  // Add arrays of nodes around it.
  // Read title of each node.
  secondaryNodeName = chkAvlObjName(json).map(function(el){
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

// Convert the retrieved JSON object to displayable JSON
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
// It stores all secondary level nodes in an array.
var secondaryNodeName;
// It stores the href that returns JSON for building new hypertree.
var hrefToVisualize; 

// It initializes the hypertree with top concepts after loading the page.
function InitializeTree(ht, callback) {
  
  console.log('**************InitializeTree Stage**************');
  // Request json format data through ESCO API.
  new Request.JSON({
    url: 'https://ec.europa.eu/esco/api/resource/taxonomy?uri=http://data.europa.eu/esco/concept-scheme/isco&language=en',
    // If the GET request is successful, build the hyper tree with the JSON object inside the file.
    onSuccess: function(json) {
      JSONResponse = json;

      // Convert the original JSON get from ESCO to new JSON format that is displayable.
      output = convertJSONFormat(json);

      // Use promise to make sure all responses from API requests are retrieved before the hypertree construction.
      var promises = json._links.hasTopConcept.map(({href}) => new Promise((resolve, reject) => {
        new Request.JSON({
          url: href,
          // If the GET request is successful, build the hyper tree with the JSON object inside the file.
          onSuccess: function(json) {
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
        console.log('All JSON responses are: '+ JSON.stringify(res));
        json = buildTreeJSON(output,json,res);
        callback(ht, json);
        Log.write('Done.', true);
      }).catch(error=>{
        console.log('Failed for the tree construction and rendering.'+error);
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
  else{
    for (var i=0 ; i < secondaryNodeName.length ; i++){
      // If href is found through the JSON.
      if (chkAvlObjName(JSONResponse)[i].title == clickedNode) {
        hrefToVisualize = chkAvlObjName(JSONResponse)[i].href;
        console.log('After clicking node ' + clickedNode + ', new href will be requested: \n' + hrefToVisualize);
      }
      else{
        Log.write('Looking for the node...', true);
      }
    }
  }
  
  // Request json format data through ESCO API.
  new Request.JSON({
    // url should be the href for clicked node.
    url: hrefToVisualize,
    // If the GET request is successful, build the hyper tree with the JSON object inside the file.
    onSuccess: function(json) {
      JSONResponse = json;
      // Add buttons based on its available object arrays.
      addBtnForObjArray(ht, json);

      // Convert the original JSON get from ESCO to new JSON format that is displayable.
      output = convertJSONFormat(json);
      console.log('Checking the className of retrieved JSON...');
      // Use promise to make sure all responses from API requests are retrieved before the hypertree construction and visualization.
      var promises = chkAvlObjName(json).map(({href}) => new Promise((resolve, reject) => {
        new Request.JSON({
          url: href,
          // If the GET request is successful, build the hyper tree with the JSON object inside the file.
          onSuccess: function(json) {
            // console.log('Checking the searchRange for href: ' + href + '\n' + searchRange);
            // lowerlevel stores all the sub-categories for this node.
            var lowerLevel = chkAvlObjName(json).map(function(el){
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
        console.log('All JSON responses are: '+ JSON.stringify(res));
        displayDiscription(json);
        // Event listener for the checkbox
        var checkbox = document.querySelector("input[id=switch1]");

        checkbox.addEventListener('change', function() {
            if(this.checked) {
                // Checkbox is checked. Set the sidebar to view height and view width.
                console.log('Checkbox is checked!');
                body.getElementById("description").style.maxWidth = "900px";
                body.getElementById("description").style.maxHeight = "1200px";
                displayDiscription(json);

            } else {
                // Checkbox is not checked..
                console.log('Checkbox is unchecked!');
                body.getElementById("description").style.maxWidth = "300px";
                body.getElementById("description").style.maxHeight = "600px";
                displayDiscription(json);
            }
        });

        json = buildTreeJSON(output,json,res);
        callback(ht, json);
        Log.write('Done.', true);
      }).catch(error=>{
        console.log('Failed for the tree construction and rendering.' + '\n' + error);
      });
    },
    onFailure: function(e) {
      Log.write('There\'s no entry in the database for ' + clickedNode + '. Sorry.', true);
    }
  }).get();
}

// Load the new hyper tree after user clicking the buttons for alternative relationships.
function loadTreeByClickingBtn(ht, json, clickedArray, callback){
      JSONResponse = json;
      // Add buttons based on its available object arrays.
      addBtnForObjArray(ht, json);
      // Convert the original JSON get from ESCO to new JSON format that is displayable.
      output = getSecLvlNodesByClickingBtn(json, clickedArray);
      console.log('Checking the className of retrieved JSON...');
      // Use promise to make sure all responses from API requests are retrieved before the hypertree construction and visualization.
      var promises = chkAvlObjName(json).map(({href}) => new Promise((resolve, reject) => {
        new Request.JSON({
          url: href,
          // If the GET request is successful, build the hyper tree with the JSON object inside the file.
          onSuccess: function(json) {
            // console.log('Checking the searchRange for href: ' + href + '\n' + searchRange);
            // lowerlevel stores all the sub-categories for this node.
            var lowerLevel = chkAvlObjName(json).map(function(el){
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
        console.log('All JSON responses are: '+ JSON.stringify(res));
        displayDiscription(json);
        // Event listener for the checkbox
        var checkbox = document.querySelector("input[id=switch1]");

        checkbox.addEventListener('change', function() {
            if(this.checked) {
                // Checkbox is checked. Set the sidebar to view height and view width.
                console.log('Checkbox is checked!');
                body.getElementById("description").style.maxWidth = "900px";
                body.getElementById("description").style.maxHeight = "1200px";
                displayDiscription(json);

            } else {
                // Checkbox is not checked..
                console.log('Checkbox is unchecked!');
                body.getElementById("description").style.maxWidth = "300px";
                body.getElementById("description").style.maxHeight = "600px";
                displayDiscription(json);
            }
        });

        json = buildTreeJSON(output,json,res);
        callback(ht, json);
        Log.write('Done.', true);
      }).catch(error=>{
        console.log('Failed for the tree construction and rendering.' + '\n' + error);
      });
}

// Display the basic information for clicked node. Assign the className, title, description to the sidebar.
function displayDiscription(json){
  body.getElementById("description").innerHTML = 
  "<div class=\"custom-control custom-switch\">"
  + "<input type=\"checkbox\" class=\"custom-control-input\" id=\"switch1\" >"
  + "<label class=\"custom-control-label\" for=\"switch1\">Expand</label></div>"
  + "<h5> Current " + json.className + " Name: </h5>"
  + json.title + "<hr class=\"style14\"></br><h5> Description: </h5>" + json.description.en.literal;
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

//  Draw the tree graph.
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
          domElement.onclick = function(){
            console.log('***********You clicked one label!***********\n' + node.name);
            // console.log('Full information about clicked node: \n' + JSON.stringify(node, getCircularReplacer()));
            if (!$(domElement).hasClass('depth0')) {
              console.log('The clicked label is of depth0 .\n');
              return;
            }

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
      console.log("the firstConcept/Occupation/Skill name is: " + firstNode);

  // Add event handler to "hide" button.
  $('toggle').addEvent('click', function(e) {
    e.stop();
    // Switch the class of head tag to hidden to hide it with new style.
    header.toggleClass('hidden');
    // Change the text of link after clicking
    this.textContent = 'Click here to ' + (header.hasClass('hidden') ? 'show' : 'hide');
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

  // Load new treemap based on band name selected by user from selection menu.
  select.addEvent('change', function(e) {
    var name = this.value;
    input.value = name;
    window.location = '#' + encodeURIComponent(name);
    console.log('The selected name is: ' + name);

    loadTree(ht, this.value, renderTree);
  });

  // Load new treemap based on band name input by user in textfield.
  input.addEvent('change', function(e) {
    var name = this.value,
        index = list.indexOf(name);

    select.selectedIndex = index;
    window.location = '#' + encodeURIComponent(name);

    // Load a new hypertree after clicking the node.
    // Band name should be replaced by the href of that skill/occupation/concept.
    loadTree(ht, this.value, renderTree);
  });

  input.addEvent('keyup', function(e) {
    if (e.key == 'enter') {
      input.fireEvent('change', e);
    }
  });

  // Get band list from url and display them as a option list on interaction frame.
  new Request({
    url: 'data/list.txt',
    method: 'get',
    onSuccess: function(text) {
      // get each band name by splitting the texts in txt file with \n
      list = text.split('\n');
      // Display the band names in an option list.
      select.innerHTML = '<option>' + list.join('</option><option>') + '</option>';
      datalist.innerHTML = select.innerHTML;
      input.value = firstNode;
      input.fireEvent('change');
    },
    onFailure: function() {
      Log.write('There was an error while requesting the list of bands.', true);
    }
  }).send();

  // Allow the tree to resize.
  window.addEvent('resize', function(e) {
    ht.canvas.resize(window.innerWidth,
                         window.innerHeight);
  });

  // Display the highest level of concepts at the beginning.
  InitializeTree(ht, renderTree);
});

})();

