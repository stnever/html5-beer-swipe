import Sprite from './Sprite'
import {getPosition, getTileSize} from './Coords'

export default class Tile extends Sprite {
  constructor(opts) {
    opts.size = [getTileSize(),getTileSize()]
    opts.cssClass = 'tile'

    // Traduz de [row,col] para [x,y]
    opts.position = getPosition(opts.position[0], opts.position[1])

    super(opts)
  }
}
