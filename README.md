# gulp-extract-media-query
Gulp plugin, which extracts media queries into  separate files.


HOW TO USE
-------
```js
var gulp = require('gulp');
var extractMediaQuery = require('gulp-extract-media-query');

gulp.task('css', function() {
  gulp.src('src/style.css')
    .pipe(extractMediaQuery({
      match: '(min-width: 768px)',
      postfix: '-768'
    }))
    .pipe(gulp.dest('build'));
});
```

Source CSS sample
-------
```css
h1 {
  font-size: 30px;
}

@media (min-width: 768px) {
  h1 {
    font-size: 20px;
  }
}
```
Result CSS files
-------
<table>
  <tr>
    <th>style.css</th>
    <th>style-768.css</th>
  </tr>
  <tr>
    <td><pre>h1 {
  font-size: 30px;
}</pre></td>
<td><pre>h1 {
  font-size: 20px;
}</pre></td>
  </tr>
</table>

You can include them in your html:
```html
<link rel="stylesheet" type="text/css" href="style.css" />
<link rel="stylesheet" type="text/css" href="style-768.css" media="(min-width: 768px)" />
```
