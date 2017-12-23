import _ from 'lodash'

function split(s) { return s.split(/\s+/g) }

export default class Sprite {
  constructor(opts={}) {
    // console.log('sprite opts', opts)

    var parentEl = opts.parent || document.body
    if ( parentEl.$el ) parentEl = parentEl.$el

    _.assign(this, opts)

    // Cria um <div> para esta sprite
    this.$el = document.createElement('div')
    this.$el.classList.add('sprite')
    if ( this.cssClass )
      split(this.cssClass).forEach(c => this.$el.classList.add(c))

    if ( this.id )
      this.$el.id = this.id

    // Insere no pai (document.body se não existir)
    parentEl.appendChild(this.$el)

    // Props comuns
    this.$el.style.position = 'absolute'

    // Redesenha (atualiza props do div)
    this._redraw()
  }

  _redraw() {
    if ( _.isFunction(this.contents) ) {
      this.$el.innerHTML = this.contents()
    } else if ( _.isString(this.contents) ) {
      this.$el.innerHTML = this.contents
    }

    if ( this.size ) {
      this.$el.style.width  = this.size[0] + 'px'
      this.$el.style.height = this.size[1] + 'px'
    }

    if ( this.position ) {
      this.$el.style.left = this.position[0] + 'px'
      this.$el.style.top  = this.position[1] + 'px'
    }
  }

}
