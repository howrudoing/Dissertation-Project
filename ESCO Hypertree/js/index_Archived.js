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

// It loades JSON of one concept/occupation/skill and stores its lower level items in array
function loadJsonForSecondaryNode(href, callback) {
  new Request.JSON({
    url: href,
    // If the GET request is successful, build the hyper tree with the JSON object inside the file.
    onSuccess: function(json) {
      var lowerLevelArray = json._links.narrowerConcept.map(function(el){
        return el.title;
      });
      console.log('lowerLevelArray of this concept is: ' + lowerLevelArray);
      callback(lowerLevelArray);
    },
    onFailure: function(e) {
      Log.write('Cannot get response from ESCO API.', true);
    }
  }).get();
}

// Define the callback function
function returnLowerLevelArray(input){
  return input;
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
  var conceptName = json._links.hasTopConcept.map(function(el){
    console.log('Use map to get all concept names: '+el.title);
    return el.title;
  }); 

  // Add the name of each occupation into "name".
  for(var i = 0; i < conceptName.length; i++){
    // console.log(conceptName[i]);
    output[json.title][conceptName[i]] = [];
  
  }

  console.log(JSON.stringify(output));
  return output;
}

// Get JSON of each secondary node and store its "narrowerconcept".
function getLowerLevelRef(json) {
  var lowerLevelRef = json._links.hasTopConcept.map(function(element){
    console.log('The href for each element is: ' + element.href);
    return element.href;
  });

  // This must be executed after retrieving all json data for secondary nodes. 
  console.log('lowerLevelArray of all concepts are: ' + lowerLevelRef);
  return lowerLevelRef;
}

// Build the hypertree based on the JSON object
function buildTreeJSON(convertedJson, json, lowerLevelArray) {
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
    console.log("After children = json[key], children becomes: " + children);

    for (key in children) {
      console.log("Debugging for buildTreeJSON... each secondary level node is: " + key);
      name = key;
      if (!keys.hasOwnProperty(key)) {
        keys[key] = 1;
      } else {
        key = key + keys[key]++;
      }

      if (lowerLevelArray[i] != undefined) {
        // construct the sub-nodes for each secondary node.
        children[name] = lowerLevelArray[i];
      }
      else
        children[name] = [];

      i++;

      console.log("Debugging for buildTreeJSON... sub-nodes for this secondary node are: " + children[name]);
      // ???
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

// It initializes the hypertree with top concepts after loading the page.
function InitializeTree(ht, callback) {
  console.log('InitializeTree Stage...');
  // Request json format data through ESCO API.
  new Request.JSON({
    url: 'https://ec.europa.eu/esco/api/resource/taxonomy?uri=http://data.europa.eu/esco/concept-scheme/isco&language=en',
    // If the GET request is successful, build the hyper tree with the JSON object inside the file.
    onSuccess: function(json) {

      // Convert the original JSON get from ESCO to new JSON format that is displayable.
      output = convertJSONFormat(json);
      lowerLevelRef = getLowerLevelRef(json);
      lowerLevelArray = getLowerLevelArray(json);
      json = buildTreeJSON(output,json,lowerLevelArray);

      // Once the above functions are finished, run the callback function.
      callback(ht, json);
      Log.write('Done Drawing the Hyper Tree.', true);
    },
    onFailure: function(e) {
      Log.write('Cannot get response from ESCO API.', true);
    }
  }).get();
}

// It loads the new hypertree after clicking one node.
function loadTree(ht, bandName, callback) {
  console.log('loadTree Stage...');
  // Request json format data through ESCO API.
  new Request.JSON({
    // url: 'data/bands/' + bandName + '.txt',
    url: 'https://ec.europa.eu/esco/api/resource/taxonomy?uri=http://data.europa.eu/esco/concept-scheme/isco&language=en',
    // If the GET request is successful, build the hyper tree with the JSON object inside the file.
    onSuccess: function(json) {
      // Convert the original JSON get from ESCO to new JSON format that is displayable.
      output = convertJSONFormat(json);
      lowerLevelArray = getLowerLevelArray(json);
      json = buildTreeJSON(output,json,lowerLevelArray);
      
      callback(ht, json);
      Log.write('Done.', true);
    },
    onFailure: function(e) {
      Log.write('There\'s no entry in the database for ' + bandName + '. Sorry.', true);
    }
  }).get();
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
    duration: 2000,
    hideLabels: true,
    transition: $jit.Trans.Quint.easeInOut
  });
}

function buildGraph() {
  var ht = new $jit.Hypertree({
        injectInto: 'tree',
        offset: 0.1,

        Navigation: {
          enable: true,
          panning: true,
          zooming: 10
        },

        Node: {
          overridable: true,
          color: 'red',
          dim: 9,
          CanvasStyles: {
            shadowBlur: 3,
            shadowColor: '#111'
          }
        },

        Edge: {
          overridable: true,
          color: '#23A4FF',
          lineWidth:1.8
        },

        onCreateLabel: function(domElement, node){
          domElement.innerHTML = node.name;
          domElement.onclick = function(){
            if (!$(domElement).hasClass('depth0')) {
              return;
            }
            loadTree(ht, node.name, function(ht, json) {
              json.id = node.id;
              window.location = '#' + encodeURIComponent(node.name);
              ht.onClick(node.id, {
                hideLabels: true,
                onComplete: function() {
                  ht.op.morph(json, {
                    type: 'fade',
                    id: node.id,
                    duration: 2000,
                    hideLabels: true
                  });
                }
              });
            });
          };
        },

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

window.addEvent('domready', function(e) {
  var body = $(document.body),
      header = body.getElement('header'),
      links = body.getElements('nav > ul > li > a'),
      input = $('input-names'),
      select = $('other-select'),
      datalist = $('artist-names'),
      ht = buildGraph(),
      firstBand = decodeURIComponent(window.location.hash.slice(1)) || 'Metallica',
      list;
      console.log("the firstBand name is: "+firstBand);

  $('toggle').addEvent('click', function(e) {
    e.stop();
    header.toggleClass('hidden');
    this.textContent = 'Click here to ' + (header.hasClass('hidden') ? 'show' : 'hide');
  });

  // Load new treemap based on links clicked by user.
  links.addEvent('click', function(e) {
    e.stop();
    var name = this.textContent,
        index = list.indexOf(name);

    select.selectedIndex = index;
    input.value = name;
    window.location = '#' + encodeURIComponent(name);

    loadTree(ht, this.textContent, renderTree);
  });

  // Load new treemap based on band name selected by user from selection menu.
  select.addEvent('change', function(e) {
    var name = this.value;
    input.value = name;
    window.location = '#' + encodeURIComponent(name);

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

  new Request({
    url: 'data/list.txt',
    method: 'get',
    onSuccess: function(text) {
      // get each band name by splitting the texts in txt file with \n
      list = text.split('\n');
      // Display the band names in an option list.
      select.innerHTML = '<option>' + list.join('</option><option>') + '</option>';
      datalist.innerHTML = select.innerHTML;
      input.value = firstBand;
      input.fireEvent('change');
    },
    onFailure: function() {
      Log.write('There was an error while requesting the list of bands.', true);
    }
  }).send();

  window.addEvent('resize', function(e) {
    ht.canvas.resize(window.innerWidth,
                         window.innerHeight);
  });

  InitializeTree(ht, renderTree);
});

})();
