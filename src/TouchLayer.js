import Sprite from './Sprite'
import {xyToBoard, getBoardSize} from './Coords'

function getPos(evt) {
  var isTouch = evt.touches != null,
      x = isTouch ? evt.touches[0].clientX : evt.clientX,
      y = isTouch ? evt.touches[0].clientY : evt.clientY,
      pos = xyToBoard(x, y)

  // console.log('%s on x,y %s %s (pos: %s)', (isTouch ? 'touch' : 'click'),
  //   x, y, pos.join())

  return pos
}

export default class TouchLayer extends Sprite {
  constructor(opts={}) {
    opts.id = 'touch-layer'
    opts.zIndex = 500
    opts.size = getBoardSize()
    super(opts)

    this.$el.addEventListener('mousedown'  , evt => this.onStart(evt))
    this.$el.addEventListener('mousemove'  , evt => this.onMove(evt))
    this.$el.addEventListener('mouseup'    , evt => this.onEnd(evt))

    this.$el.addEventListener('touchstart' , evt => this.onStart(evt))
    this.$el.addEventListener('touchmove'  , evt => this.onMove(evt))
    this.$el.addEventListener('touchend'   , evt => this.onEnd(evt))
    this.$el.addEventListener('touchcancel', evt => this.onEnd(evt))
  }

  onStart(evt) {
    var pos = getPos(evt)

    // Ignora touch/click que comece fora da board
    if ( this.stage.board.cellAt(pos) == null ) {
      console.log('drag started on null cell, ignoring')
      return
    }

    this.startPos = pos
    console.log('started on pos %s', pos.join())
  }

  onMove(evt) {
    if ( this.startPos == null ) return
    var pos = getPos(evt)

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

  onEnd(evt) {
    this.startPos = null
  }
}
