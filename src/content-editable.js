// import $ from 'jquery'
// import * as THREE from 'three'
// // const easing = require('jquery-easing')
// window.$ = $

// let scene = new THREE.Scene()
// let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

// let renderer = new THREE.WebGLRenderer()
// renderer.setSize(window.innerWidth, window.innerHeight)
// document.body.appendChild(renderer.domElement)


// let geometry = new THREE.BoxGeometry( 1, 1, 1 );
// let material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// let cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// camera.position.z = 5;

// function render() {
//   requestAnimationFrame( render );
//   cube.rotation.x += 0.1;
//   cube.rotation.y += 0.1;
//   renderer.render( scene, camera );
// }
// render();

(function() {
  $('[contenteditable]').each(function() {
    // 干掉IE http之类地址自动加链接
    try {
      document.execCommand("AutoUrlDetect", false, false);
    } catch (e) {}

    $(this).on('paste', function(e) {
      e.preventDefault();
      var text = null;

      if (window.clipboardData && clipboardData.setData) {
        // IE
        text = window.clipboardData.getData('text');
      } else {
        text = (e.originalEvent || e).clipboardData.getData('text/plain') || prompt('在这里输入文本');
      }
      if (document.body.createTextRange) {
        if (document.selection) {
          textRange = document.selection.createRange();
        } else if (window.getSelection) {
          sel = window.getSelection();
          var range = sel.getRangeAt(0);

          // 创建临时元素，使得TextRange可以移动到正确的位置
          var tempEl = document.createElement("span");
          tempEl.innerHTML = "&#FEFF;";
          range.deleteContents();
          range.insertNode(tempEl);
          textRange = document.body.createTextRange();
          textRange.moveToElementText(tempEl);
          tempEl.parentNode.removeChild(tempEl);
        }
        textRange.text = text;
        textRange.collapse(false);
        textRange.select();
      } else {
        // Chrome之类浏览器
        document.execCommand("insertText", false, text);
      }
    });
    // 去除Crtl+b/Ctrl+i/Ctrl+u等快捷键
    $(this).on('keydown', function(e) {
      // e.metaKey for mac
      if (e.ctrlKey || e.metaKey) {
        switch (e.keyCode) {
          case 66: //ctrl+B or ctrl+b
          case 98:
          case 73: //ctrl+I or ctrl+i
          case 105:
          case 85: //ctrl+U or ctrl+u
          case 117:
            {
              e.preventDefault();
              break;
            }

        }
      }
      if (e.keyCode === 13) { // forbid enter key
        e.preventDefault()
      }
    });
  });


  let editorDiv = document.getElementById('editor')

  let selection = window.getSelection()
  let range

  $(editorDiv).on('keyup click focus', function() {
    if (selection.rangeCount === 0) {
      return
    }
    range = selection.getRangeAt(0)
  })

  $(editorDiv).on('mouseup', function() {
    range = selection.getRangeAt(0)
    console.log(range.getBoundingClientRect())
  })

  $('#button').on('click', function() {
    let node = $('<span>啊啊</span>')[0]
    range.insertNode(node)
    console.log($(node).position())
    $(node).remove()
  })

  $('#button2').on('click', function() {
    console.log(editorDiv.textContent)
  })

  $('#button3').on('click', function() {
    let text = document.createTextNode("&")
    range.insertNode(text)
  })
})()