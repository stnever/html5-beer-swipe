import Sprite from './Sprite'
import {xyToBoard, getBoardSize} from './Coords'

export default class TouchLayer extends Sprite {
  constructor(opts={}) {
    opts.id = 'touch-layer'
    opts.zIndex = 500
    opts.size = getBoardSize()
    super(opts)

    this.$el.addEventListener('mousedown', evt => this.onStart(evt))
    this.$el.addEventListener('mousemove', evt => this.onMove(evt))
  }

  onStart(evt) {
    var x = evt.clientX, y = evt.clientY, pos = xyToBoard(x, y)

    // Ignora touch/click que comece fora da board
    if ( this.stage.board.cellAt(pos) == null ) {
      console.log('drag started on null cell, ignoring')
      return
    }

    this.startPos = pos
    console.log('drag started on x,y %s %s (pos %s)', x, y, pos.join())
  }

  onMove(evt) {
    if ( this.startPos == null ) return
    var x = evt.clientX, y = evt.clientY, pos = xyToBoard(x, y)

    // Se mudou de cell, valida e dispara o swap.
    if ( pos[0] != this.startPos[0] || pos[1] != this.startPos[1]) {
      console.log('swiped from %s to %s', this.startPos.join(), pos.join())

      // Ignora swaps que saiam da board
      if ( this.stage.board.cellAt(pos) == null ) {
        console.log('drag ended on null cell, ignoring')
        this.startPos = null
      } else {
        this.stage.trySwap(this.startPos, pos)
        this.startPos = null
      }
    }
  }
}
