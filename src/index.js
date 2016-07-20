import $ from 'jquery'
const easing = require('jquery-easing')
window.$ = $

console.log(easing)

require('./assets/css/style.css')
require('./something')

console.log('hello world!!!')

$(document.body).append('<div style="position: absolute">hey</div>')

$('div').animate({ top: '+=100px' }, 2000, 'easeOutBounce', function() {
  console.log('done')
})