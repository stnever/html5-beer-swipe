// import Sprite from './Sprite.js'
// import _ from 'lodash'
// // import {getPos} from './Coords'
// import Board from './Board'
// import TouchLayer from './TouchLayer'
//
// var bg = new Sprite({
//   contents: 'Hello World',
//   cssClass: 'background',
//   size: [400, 400],
//   zIndex: 100
// })
//
// var board = new Board()
// board.randomFill()
//
// var touchLayer = new TouchLayer()
var maxRows = 12,
    maxCols = 6

import {init} from './Coords'
init({windowHeight: window.innerHeight, maxRows, maxCols})

import Stage from './Stage'
new Stage({maxRows, maxCols})
