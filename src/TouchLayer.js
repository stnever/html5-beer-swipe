import Sprite from './Sprite'
import {xyToBoard, getBoardSize} from './Coords'

export default class TouchLayer extends Sprite {
  constructor(opts={}) {
    opts.id = 'touch-layer'
    opts.zIndex = 500
    opts.size = getBoardSize()
    super(opts)

    this.$el.addEventListener('mousedown', evt => this.onSwipeStart(evt))
    this.$el.addEventListener('mousemove', evt => this.onSwipeMove(evt))
  }

  onSwipeStart(evt) {
    var x = evt.clientX, y = evt.clientY, pos = xyToBoard(x, y)
    this.startPos = pos
    console.log('drag started on x,y %s %s (pos %s)', x, y, pos.join())
  }

  onSwipeMove(evt) {
    if ( this.startPos == null ) return
    var x = evt.clientX, y = evt.clientY, pos = xyToBoard(x, y)

    if ( pos[0] != this.startPos[0] || pos[1] != this.startPos[1]) {
      console.log('swiped from %s to %s', this.startPos.join(), pos.join())
      this.stage.trySwap(this.startPos, pos)
      this.startPos = null
    }
  }
}
