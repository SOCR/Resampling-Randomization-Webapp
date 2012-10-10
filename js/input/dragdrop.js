var addEvent = (function () {
  if (document.addEventListener) {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.addEventListener(type, fn, false);
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  } else {
    return function (el, type, fn) {
      if (el && el.nodeName || el === window) {
        el.attachEvent('on' + type, function () { return fn.call(el, window.event); });
      } else if (el && el.length) {
        for (var i = 0; i < el.length; i++) {
          addEvent(el[i], type, fn);
        }
      }
    };
  }
})();

function cancel(e) {
  if (e.preventDefault) e.preventDefault(); // required by FF + Safari
  e.dataTransfer.dropEffect = 'copy'; // tells the browser what drop effect is allowed here
  return false; // required by IE
}

function entities(s) {
  var e = {
    '"' : '"',
    '&' : '&',
    '<' : '<',
    '>' : '>'
  };
  return s.replace(/["&<>]/g, function (m) {
    return e[m];
  });
}

//var getDataType = document.querySelector('#text');
var drop = document.querySelector('#drop');

// Tells the browser that we *can* drop on this target
addEvent(drop, 'dragover', cancel);
addEvent(drop, 'dragenter', function(e){
 $(drop).addClass('active');
});

addEvent(drop, 'drop', function (e) {

  if (e.preventDefault) e.preventDefault(); // stops the browser from redirecting off to the text.  
  drop.innerHTML = e.dataTransfer.getData('Text') ;

  
  $('#dropmatrix').inputtable({

         rows: 15,
        cols: 4,
        minSpareCols : 1,
        minSpareRows : 1,
        fillHandle : true

  });
  table.init({
    parent : '#status'
  });
  var a = e.dataTransfer.getData('Text');
  table.loadURL(a);
  
  /*

  var fetchHTML = (function (){
    console.log('Fetching URL started' + e.dataTransfer.getData('Text'));
    $.get(e.dataTransfer.getData('Text'),function(d){
      console.log(d );
    })
  })();

  */


  /** THIS IS THE MAGIC: we read from getData based on the content type - so it grabs the item matching that format **/
  /*
  if (getDataType.checked == false && e.dataTransfer.types) {
    li.innerHTML = '<ul>';
    [].forEach.call(e.dataTransfer.types, function (type) {
      li.innerHTML += '<li>' + entities(e.dataTransfer.getData(type) + ' (content-type: ' + type + ')') + '</li>';
    });
    li.innerHTML += '</ul>';
    
  } else {
    // ... however, if we're IE, we don't have the .types property, so we'll just get the Text value
   
   // li.innerHTML = e.dataTransfer.getData('Text');
  } */
  
  /*var ul = drop.querySelector('ul');

  if (ul.firstChild) {
    ul.insertBefore(li, ul.firstChild);
  } else {
    ul.appendChild(li);
  }
  */
  return false;
});