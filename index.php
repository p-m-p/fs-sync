<!doctype html>
<html>
  <head>
    <title>Offline files with HTML5</title>
  </head>
  <body>

    <ol id="dir-tree">

    <?php foreach (glob('fs/*.*') as $f) : ?>

      <li>
        <a class="pull" href="<?php echo $f; ?>">
          <?php echo str_replace('fs/', '', $f); ?>
        </a>
      </li>

    <?php endforeach; ?>

    </ol>

  </body>
  <script src="js/sync.js"></script>
  <script>
    window.requestFileSystem || (
      window.requestFileSystem = window.webkitRequestFileSystem
    );
    window.webkitStorageInfo.requestQuota(PERSISTENT, 1024*1024, function(gb) {
      window.requestFileSystem(
          window.PERSISTENT
        , gb
        , fileSync.init
        , fileSync.err
      );
    }, function(e) {
      console.log('Error', e);
    });
    
  </script>
</html>
