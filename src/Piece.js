import Sprite from './Sprite'
import {getPosition, getTileSize} from './Coords'

export default class Piece extends Sprite {
  constructor(opts) {
    var tsize = getTileSize()

    opts.size = [tsize, tsize]
    opts.cssClass = 'piece piece_' + opts.type

    // Traduz de [row,col] para [x,y] (do top/left)
    opts.position = getPosition(opts.position[0], opts.position[1])

    super(opts)

    // Adiciona uma img para a peça, e uma img para o highlight.
    this.$img = this.$el.appendChild(document.createElement('img'))
    // this.$highlight = this.$el.appendChild(document.createElement('img'))

    this.$img.src = './assets/piece_' + opts.type + '.png'
    this.$img.height = tsize * .9

    // Posiciona a imagem 5% para a direita/abaixo, para que fique centralizada.
    this.$img.style.position = 'absolute'
    this.$img.style.top = tsize * .05 + 'px'
    this.$img.style.left = tsize * .05 + 'px'
  }

  destroy() {
    // Remove o <div>. Acredito que isto já remove as duas imgs dentro.
    // Se tivéssemos listeners ou outras referências teríamos que liberá-las
    // aqui.
    this.$el.remove()
  }

}
