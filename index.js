var PluginError = require('gulp-util').PluginError;
var Transform = require('stream').Transform;
var Path = require('path');

var gutil = require('gulp-util');
var postcss = require('postcss');

module.exports = function(opts) {
  opts = opts || {};

  function parsePath(path) {
    var extname = Path.extname(path);
    return {
      dirname: Path.dirname(path),
      basename: Path.basename(path, extname),
      extname: extname
    };
  }

  var stream = new Transform({objectMode: true});

  stream._transform = function(file, encoding, cb) {
    if (file.isNull()) {
      return cb(null, file);
    }
    if (file.isStream()) {
      var error = 'Streaming not supported';
      return cb(new PluginError(PLUGIN_NAME, error));
    } else if (file.isBuffer()) {
      var css = postcss.parse(String(file.contents));
      var parsedFile = parsePath(file.relative);
      var matchCount = 0;
      var newCss = postcss.parse('@charset "UTF-8"');

      // let's loop through all rules and extract all @media print
      css.walkAtRules(function(rule) {
        if (rule.name.match(/^media/) && rule.params.match(opts.match)) {
          // add the rule to the new css
          var newRule = rule.clone();
          newRule.walkRules(function(r) {
            newCss.append(r);
          });
          rule.remove();
          matchCount++;
        }
      });

      // push old file
      file.contents = new Buffer(css.toString());
      this.push(file);

      if (matchCount) {
        //push new file
        this.push(new gutil.File({
          cwd: '',
          base: '',
          path: parsedFile.basename + opts.postfix + parsedFile.extname,
          contents: new Buffer(newCss.toString())
        }));
      }
      cb();
    }
  }
  return stream;
}
