import _ from 'lodash'
import Sprite from './Sprite.js'
import Board from './Board'
import TouchLayer from './TouchLayer'
import {getBoardSize} from './Coords'
import * as Animator from './Animator'

function isSamePos(posA, posB) {
  return posA[0] == posB[0] && posA[1] == posB[1]
}

export default class Stage {
  constructor({maxRows, maxCols}={}) {
    _.assign(this, {maxRows, maxCols})

    // O tamanho do background é setado via CSS
    this.bg = new Sprite({cssClass: 'background', zIndex: 0})
    this.board = new Board({stage: this})
    this.board.randomFill()

    // this.detectPossibleSwaps()

    this.touchLayer = new TouchLayer({stage: this})
  }

  trySwap(from, to) {
    // var isValid = _.find(this.possibleSwaps, swap => {
    //   return ( ( isSamePos(swap.posA, from) && isSamePos(swap.posB, to) ) ||
    //            ( isSamePos(swap.posB, from) && isSamePos(swap.posA, to) ) )
    // }) != null
    //
    // if ( !isValid ) {
    //   console.log('invalid swap')
    //   return
    // }

    // NB: agora que podemos fazer movimentos sem necessariamente
    // fazer matches, sempre fazemos o swap.
    this.performSwap(from[0], from[1], to[0], to[1])

    // As peças agora estão nas cells corretas, mas sua propriedade
    // .position está errada. Basta avisá-las que elas estão na
    // mesma position das suas cells.
    var pieceA = this.board.cellAt(from).piece,
        pieceB = this.board.cellAt(to).piece

    pieceA.position = from
    pieceB.position = to

    // Dispara a animação do swap.
    Animator.animateSwap(pieceA, pieceB, () => {
      // Roda isto apenas quando a animação do swap termina.
      this.removeMatches()
    })

    // TODO: Desligar input até que as animações terminem

    // Detecta novamente os possíveis swaps.
    // this.detectPossibleSwaps()
  }

  hasMatchAt(row, col) {
    var cell = this.board.cellAt(row, col)
    if ( !cell ) return false

    var type = cell.piece.type,
        horzLen = 1,
        vertLen = 1,
        maxCols = this.maxCols,
        maxRows = this.maxRows,
        typeAt = (r, c) => this.board.pieceTypeAt(r, c)

    // Verifica o máximo que consegue andar à esquerda e à direita
    // com o mesmo type
    for ( var i = col-1 ; i >= 0 && typeAt(row, i) == type ; i--, horzLen++) ;
    for ( var i = col+1 ; i < maxCols && typeAt(row, i) == type ; i++, horzLen++) ;

    // console.log('hasMatchAt %s, %s: horzLen %s', row, col, horzLen)
    // if ( horzLen >= 3 ) return true

    // Idem acima, para cima e para baixo
    for ( var i = row-1 ; i >= 0 && typeAt(i, col) == type ; i--, vertLen++) ;
    for ( var i = row+1 ; i < maxRows && typeAt(i, col) == type ; i++, vertLen++) ;

    // console.log('hasMatchAt %s, %s: horzLen %s, vertLen %s', row, col, horzLen, vertLen)
    return horzLen >= 3 || vertLen >= 3
  }

  performSwap(rowA, colA, rowB, colB) {
    var cellA = this.board.cellAt(rowA, colA),
        pieceA = cellA.piece,
        cellB = this.board.cellAt(rowB, colB),
        pieceB = cellB.piece

    cellA.piece = pieceB
    cellB.piece = pieceA

    // console.log('swapped %s,%s (piece %s) with %s,%s (piece %s)', rowA, colA, pieceA.type,
    //   rowB, colB, pieceB.type)
  }

  detectPossibleSwaps() {
    this.possibleSwaps = []
    this.board.walk((cell, row, col) => {

      // Para detectar swap horizontal, podemos pular a última coluna
      if ( col < this.maxCols -1 ) {
        this.performSwap(row, col, row, col+1)
        if ( this.hasMatchAt(row, col) || this.hasMatchAt(row, col+1) )
          this.possibleSwaps.push({posA: [row,col], posB: [row, col+1]})
        this.performSwap(row, col, row, col+1)
      }

      // Para detectar swap vertical, podemos pular a última linha
      if ( row <= this.maxRows -1 ) {
        this.performSwap(row, col, row+1, col)
        if ( this.hasMatchAt(row, col) || this.hasMatchAt(row+1, col) )
          this.possibleSwaps.push({posA: [row,col], posB: [row+1, col]})
        this.performSwap(row, col, row+1, col)
      }

    })

    _.forEach(this.possibleSwaps, s => console.log('possible swap: %s => %s', s.posA.join(), s.posB.join()))
  }

  detectHorizontalMatches() {
    var typeAt = (r,c) => this.board.pieceTypeAt(r,c)

    var matches = []
    // NB: não usamos walk() porque aqui queremos modificar a ordem de iteração
    for ( var row = 0; row < this.maxRows; row++ ) {
      for ( var col = 0; col < this.maxCols -2 ; ) { // NB: não tem col++
        var type = typeAt(row, col)

        // Se por alguma razão o type está null, pula esta célula.
        if ( type == null ) {
          col++
          continue
        }

        // console.log('detectHorizontalMatches %s,%s %s', row, col, type)

        // Se as duas próximas peças forem do mesmo tipo, teremos uma chain.
        if ( typeAt(row, col+1) == type && typeAt(row, col+2) == type ) {

          // Pega todas as células (incluindo as duas acima) que são do mesmo
          // tipo (podem haver mais de três na chain)
          var chain = {cells: [], dir: 'horizontal'}

          while ( typeAt(row, col) == type ) {
            chain.cells.push(this.board.cellAt(row, col))
            col++ // NB: este é o contador do for()  interno
          }

          matches.push(chain)
        } else {
          col++ // NB: incrementa o for interno caso não haja match
        }
      }
    }

    console.log('%s horizontal matches:', matches.length)
    matches.forEach(m => console.log('%s', m.cells.map(c => c.position.join() + ' ').join(' ')))
    return matches
  }

  detectVerticalMatches() {
    var typeAt = (r,c) => this.board.pieceTypeAt(r,c)

    var matches = []
    // NB: não usamos walk() porque aqui queremos modificar a ordem de iteração
    for ( var col = 0; col < this.maxCols; col++ ) {
      for ( var row = 0; row < this.maxRows -2 ; ) { // NB: não tem row++
        var type = typeAt(row, col)

        // Se por alguma razão o type está null, pula esta célula.
        if ( type == null ) {
          row++
          continue
        }

        // console.log('detectVerticalMatches %s,%s %s', row, col, type)

        // Se as duas próximas peças forem do mesmo tipo, teremos uma chain.
        if ( typeAt(row+1, col) == type && typeAt(row+2, col) == type ) {

          // Pega todas as células (incluindo as duas acima) que são do mesmo
          // tipo (podem haver mais de três na chain)
          var chain = {cells: [], dir: 'vertical'}

          while ( typeAt(row, col) == type ) {
            chain.cells.push(this.board.cellAt(row, col))
            row++ // NB: este é o contador do for()  interno
          }

          matches.push(chain)
        } else {
          row++
        }
      }
    }

    console.log('%s vertical matches:', matches.length)
    matches.forEach(m => console.log('%s', m.cells.map(c => c.position.join() + ' ').join(' ')))
    return matches
  }

  removeMatches() {
    // Junta as cells de todos os matches em um array só.
    var allCells = _.flattenDeep([
      _.map(this.detectHorizontalMatches(), 'cells'),
      _.map(this.detectVerticalMatches(), 'cells')
    ])

    allCells = _.uniq(allCells)

    console.log('Matches', allCells)

    // Guarda uma referência para as peças, para que possamos animá-las
    var allPieces = _.map(allCells, 'piece')

    // Zera a peça em cada cell.
    allCells.forEach(cell => cell.piece = null)

    // Some com as peças.
    Animator.animateRemove(allPieces)

  }

}
