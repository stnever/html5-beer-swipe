import _ from 'lodash'

import Sprite from './Sprite'
import Piece from './Piece'
import Tile from './Tile'
import {getBoardSize} from './Coords'

var seed = 1
function random() {
  var x = Math.sin(seed++) * 10000
  return x - Math.floor(x)
}

export default class Board extends Sprite {
  constructor(opts={}) {
    super(opts)

    var stage = opts.stage

    this.tilesLayer = new Sprite({
      stage,
      id: 'tiles-layer',
      parent: this, size: getBoardSize(), zIndex: 200
    })

    this.piecesLayer = new Sprite({
      stage,
      id: 'pieces-layer',
      parent: this, size: getBoardSize(), zIndex: 300
    })

    this.cells = _.times(stage.maxRows, row => {
      return _.times(stage.maxCols, col => {
        var position = [row, col]

        return {
          position,
          tile: new Tile ({stage, position, parent: this.tilesLayer})
        }
      })
    })
  }

  cellAt(row, col) {
    if ( _.isArray(row) ) {
      col = row[1]
      row = row[0]
    }

    if ( row < 0 || col < 0 ) return null
    if ( row >= this.stage.maxRows || col >= this.stage.maxCols ) return null
    return this.cells[row][col]
  }

  pieceTypeAt(row, col) {
    var cell = this.cellAt(row, col)
    if ( cell && cell.piece ) return cell.piece.type
    return null
  }

  walk(fn) {
    _.forEach(this.cells, (row, i) => {
      _.forEach(row, (cell, j) => fn(cell, i, j))
    })
  }

  randomFill() {
    this.walk(cell => {
      var r = cell.position[0], c = cell.position[1]

      // Alias para ficar mais fácil de ler abaixo
      var typeAt = (row,col) => this.pieceTypeAt(row, col)

      // Re-gera se este item fosse fazer um match. Não precisa
      // ser executado nas células 0,0-1,1
      while ( true ) {
        var type = Math.floor(random() * 4)

        if ( r < 2 && c < 2 ) break

        var makesMatch = (
          (typeAt(r-1, c) == type && typeAt(r-2, c) == type) ||
          (typeAt(r, c-1) == type && typeAt(r, c-2) == type) )

        if ( !makesMatch ) break

        console.log('regenerating')
      }

      // console.log('cell %s %s type %s', r, c, type)

      cell.piece = new Piece({
        stage: this.stage,
        parent: this.piecesLayer,
        position: [r,c], type
      })
    })
  }

}
