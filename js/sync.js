window.fileSync = (function (w) {

  var api = {}
    , root;

  api.init = function (fs) {
    
    var dir = document.getElementById('dir-tree');
    dir.addEventListener('click', api.fileAction, false);

    root = fs.root;

  };


  api.fileAction = function (ev) {

    ev.preventDefault();
    var t = ev.target;
    console.log(ev);

    if (t.className.indexOf('pull') !== -1) {
      api.pull(t.href);
    }

    ev.preventDefault();

  };


  api.pull = function (path) {

    var xhr = new XMLHttpRequest;

    xhr.open('get', path, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {


    }

    xhr.send();

  };

  api.err = function (ev) {
    console.log(ev);
  };

  return api;

})(window);
