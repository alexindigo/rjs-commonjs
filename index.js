// allow server-side global define
var path = require('path');
require('global-define')({basePath: path.join(__dirname, 'lib')});

var commonjs = require('./lib/commonJs.js');
var transform = require('./lib/transform.js');

// make it as one step procedure for the common use case
module.exports = function(moduleName, content)
{
  // not really being used, except for error log
  var filename = moduleName
      // @jrburke: iirc used to track which modules already have names,
      // used in final concat, but should not matter if doing single modules
      // https://twitter.com/jrburke/status/635457662876958721
    , onFound  = function(info){ /* do nothing */ }
      // only used option is `useSourceUrl`, doesn't make sense in single file mode
    , options  = {}
      // no namespace in single file mode
    , namespace = undefined
    ;

  content = commonjs.convert(filename, content);
  content = transform.toTransport(namespace, moduleName, filename, content, onFound, options);

  return content;
}

// expose internals for greater flexibility
module.exports.commonjs  = commonjs;
module.exports.transform = transform;
