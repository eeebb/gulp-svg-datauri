var through = require('through2');
var gutil = require('gulp-util');
var path = require('path');
var fs = require('fs');
var mime = require('mime');
var SVGO = require('svgo');
var svgo = new SVGO();

module.exports = function (options) {
    function embedSvg (file, enc, callback) {
        var wrapper = options.wrapper || 'inline';
        var encoding = options.encoding || 'utf8';
        var imageSource;

        if (!options.imageSource) {
            imageSource = 'assets';
        } else {
            imageSource = options.imageSource;
            if (path.resolve(options.imageSource) === path.normalize(options.imageSource)) {
                imageSource = options.imageSource;
            }
        }

        // Do nothing if no contents
        if (file.isNull()) {
            this.push(file);
            return callback();
        }

        if (file.isStream()) {
            // accepting streams is optional
            this.emit('error', new gutil.PluginError('gulp-svg-datauri', 'Stream content is not supported'));
            return callback();
        }

        function inline (inlineExpr, quotedPath) {
            var imagePath = quotedPath.replace(/['"]/g, '');
            var fallbackImagePath = imagePath.replace(/.svg/g, '.png');
            try {
                var fileData = fs.readFileSync(path.join(imageSource, imagePath));
            }
            catch (e) {
                gutil.log(gutil.colors.yellow('gulp-svg-datauri'), 'Referenced file not found: ' + path.join(imageSource, imagePath));
                gutil.log(gutil.colors.yellow('gulp-svg-datauri'), 'Leaving it as is.');
                return inlineExpr;
            }

            var svg;
            var encType='charset=utf8';
            svgo.optimize(fileData.toString('utf8'), function (result) {
                svg = new Buffer(result.data);
            });

            if ( encoding == 'base64' ) {
              svg = svg.toString('base64');
              encType = 'base64';
            }

            var fileMime = mime.lookup(imagePath) + ';';

            var output = "url('" + fallbackImagePath + "');";
                output += "background: url('data:" + fileMime + encType + ',' + encodeURIComponent(svg) + "')";
                output += ', linear-gradient(transparent, transparent);';

            return output;
        }

        // check if file.contents is a `Buffer`
        if (file.isBuffer()) {

            var re = new RegExp(wrapper + "\\(([^\\)]+)\\)","g");
            var svgDataUri = String(file.contents).replace(re, inline);

            file.contents = new Buffer(svgDataUri);

            this.push(file);
        }

        return callback();
    }

    return through.obj(embedSvg);
};
