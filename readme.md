# Inline svg images

This gulp plugin embed svg images as encoded data URIs.
Select the images to embed by wrapping relative url with the inline function.

eg. ```inline('path/to/image.svg')``` becomes ```url('data:image/svg+xml,%3Csvg...svg%3E')```

Forked from [goschevski/gulp-base64-inline](https://github.com/goschevski/gulp-base64-inline) to implement utf8 with uri encoding for svg images. Uses [svgo](https://github.com/svg/svgo).

Usage with default options:

```javascript
var gulp = require('gulp');
var svgdatauri = require('gulp-svg-datauri');

gulp.task('svginline', function () {
    return gulp.src('assets/styles/**/*')
        .pipe(svgdatauri({
            wrapper: 'inline',
            encoding: 'utf8',
            imageSource: 'assets' // path containing the image directory
          }))
        .pipe(gulp.dest('dist/styles/'));
});
```

Source:

```css
.star_crescent {
    background-image: inline('images/Star_and_Crescent.svg');
}
```

Result:

```css
.star_crescent {
  background-image: url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22272%22%20height%3D%22256%22%20viewBox%3D%227%2014%20272%20256%22%3E%3Cg%20fill%3D%22%23007f00%22%3E%3Cpath%20d%3D%22M125.135%2036.188C67.608%2037.282%2021.26%2084.308%2021.26%20142.094c0%2058.472%2047.465%20105.938%20105.937%20105.938%2027.338%200%2052.265-10.384%2071.063-27.407-13.253%207.618-28.627%2011.97-45%2011.97-49.93%200-90.438-40.51-90.438-90.44%200-49.928%2040.508-90.436%2090.438-90.436%2016.504%200%2031.988%204.424%2045.312%2012.155-18.833-17.19-43.885-27.687-71.375-27.687-.685%200-1.38-.013-2.062%200z%22%2F%3E%3Cpath%20d%3D%22M266.13%20142.156l-91.155%2029.618%2056.337-77.54v95.845l-56.337-77.542z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E')
}
```

## Usage with css minification

To avoid issue with clean-css set these options:
```
rebase: false,
compatibility: '+properties.urlQuotes'
```

## Todo

- [ ] IE8 fallback

