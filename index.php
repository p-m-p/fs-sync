<!doctype html>
<html manifest="sync.appcache">
  <head>
    <title>Offline files with HTML5</title>
    <link rel="stylesheet" href="css/style.css">
  </head>
  <body>

    <ol id="dir-tree">

      <?php include 'file-list.php'; ?>

    </ol>

  </body>
  <script src="js/sync.js"></script>
  <script>

    window.requestFileSystem || (
      window.requestFileSystem = window.webkitRequestFileSystem
    );
    window.webkitStorageInfo.requestQuota(PERSISTENT, 5*1024*1024, function(gb) {
      window.requestFileSystem(
          window.PERSISTENT
        , gb
        , fileSync.init
        , fileSync.err
      );
    }, fileSync.err);

  </script>
</html>
