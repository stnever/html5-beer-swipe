import Sprite from './Sprite'
import {getPosition, getTileSize} from './Coords'

export default class Piece extends Sprite {
  constructor(opts) {
    opts.size = [getTileSize(), getTileSize()]
    opts.cssClass = 'piece piece_' + opts.type

    // Traduz de [row,col] para [x,y]
    opts.position = getPosition(opts.position[0], opts.position[1])

    super(opts)
  }

  setPosition(pos) {
    this.position = getPosition(pos[0], pos[1])
    this._redraw()
  }
}
