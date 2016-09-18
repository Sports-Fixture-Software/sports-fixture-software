var path = require('path');
var os = require('os');

module.exports = function (logger, basePath) {
    var log = logger.create('preprocessor.karama.electron');
    var modulesRootPath = path.join(basePath, 'node_modules');
    //normalize root path on Windows
    if (process.platform === 'win32') {
        modulesRootPath = modulesRootPath.replace(/\\/g, '/');
    }

    log.debug('Configured root path for modules "%s".', modulesRootPath);

    return function (content, file, done) {

        log.debug('Processing "%s".', file.originalPath);

        if (path.extname(file.originalPath) === '.json') {
            return done('window.__cjs_module__["' + file.path + '"] = ' + content + ';' + os.EOL);
        }

        var output =
            'window.__cjs_modules_root__ = "' + modulesRootPath + '";' +
            'window.__cjs_module__ = window.__cjs_module__ || {};' +
            'window.__cjs_module__["' + file.path + '"] = function(require, module, exports, __dirname, __filename) {' +
            content + os.EOL +
            '}';
        done(output);
    };
};
module.exports.$inject = ['logger', 'config.basePath'];
