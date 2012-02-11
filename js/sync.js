window.fileSync = (function (w) {

  var api = {}
    , dir
    , root;

  // set up event handlers and file system
  api.init = function (fs) {

    dir = document.getElementById('dir-tree');
    dir.addEventListener('click', api.fileAction, false);

    root = fs.root;

    // offline detection
    w.addEventListener("offline", api.toggleOnlineState, false);
    w.addEventListener("online", api.refreshFiles, false);

    if (w.navigator.onLine) {

      api.refreshFiles();
      return;

    }

    api.toggleOnlineState();
    api.syncStatus();

  };


  api.refreshFiles = function () {

    var xhr = new XMLHttpRequest;

    xhr.open('get', 'file-list.php', true);
    xhr.onerror = api.err;
    xhr.onload = function () {

      dir.innerHTML = this.response;
      api.syncStatus();

    }

    xhr.send();

  };


  api.syncStatus = function () {

    var dr = root.createReader();
    dr.readEntries(api.updateStatus, api.err);
    api.toggleOnlineState();

  };


  api.toggleOnlineState = function () {

    var i = 0
      , d = 'none'
      , sy = dir.querySelectorAll(".sync");

    if (w.navigator.onLine) {
      d = 'inline-block';
    }

    for (i = 0; i < sy.length; ++i) {
      sy.item(i).style.display = d;
    }

  };


  api.updateStatus = function (listing) {

    var i = 0, entry;

    for (; i < listing.length; ++i) {

      entry = listing.item(i);
      api.flagSynced(entry);

    }

  };


  //event handler for tree node actions
  api.fileAction = function (ev) {

    var t = ev.target, name;

    if (t.nodeName.toLowerCase() === 'a') {

      name = t.href.match(/[^/]+$/)[0];

      if (t.className.indexOf('sync') !== -1) {

        t.parentNode.parentNode.className = 'file-entry syncing';
        api.pull(t.href, name);

      }

      else if (t.className.indexOf('open') !== -1) {
        api.open(name);
      }

      ev.preventDefault();

    }

  };


  // pull file down into local
  api.pull = function (url, name) {

    var xhr = new XMLHttpRequest;

    xhr.open('get', url, true);
    xhr.responseType = 'arraybuffer';
    xhr.onload = function () {

      var res = this.response;

      root.getFile(name, {create: true}, function (fe) {

        fe.createWriter(function(writer) {

          var bb = new w.WebKitBlobBuilder;

          writer.onwriteend = function () {
            api.flagSynced(fe)
          }
          writer.onerror = api.err;

          bb.append(res);
          writer.write(bb.getBlob());

        });

      }, api.err);

    }

    xhr.send();

  };


  api.open = function (name) {

    root.getFile(name, {}, function (fe) {

      w.location = fe.toURL();

    }, api.err);

  };


  // find the node and mark it as synced
  api.flagSynced = function (entry) {

    var nl = dir.querySelectorAll('.file-entry')
      , i = 0
      , node;

    for (; i < nl.length; ++i) {

      node = nl.item(i);

      if (node.dataset.fe === entry.name) {

        node.className = 'file-entry synced';
        break;

      }

    }

  };


  // default error handler - that doesn't do anything useful
  api.err = function (ev) {
    console.log(ev);
  };

  return api;

})(window);
