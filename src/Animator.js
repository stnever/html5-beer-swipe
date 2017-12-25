import _ from 'lodash'
import Velocity from 'velocity-animate'
import {getPosition} from './Coords'

function getTopLeft(pos) {
  var p = getPosition(pos[0], pos[1])
  return {left: p[0], top: p[1]}
}

function noop() {}

export function animateSwap(pieceA, pieceB, onComplete=noop) {
  // As peças já possuem sua .position correta (row,col). Só precisamos
  // animar o top/left de cada uma. Observe que, como a duração das duas
  // animações é a mesma, podemos disparar a callback só na segunda.
  Velocity(pieceA.$el, getTopLeft(pieceA.position), {easing: 'easeOut', duration: 200})
  Velocity(pieceB.$el, getTopLeft(pieceB.position), {easing: 'easeOut', duration: 200, complete: onComplete})
}

export function animateRemove(pieces, onComplete=noop) {
  console.log('Animating remove of %s pieces', pieces.length)

  var $els = _.map(pieces, '$img')
  Velocity($els, {scale: 0}, {
    complete: function() {
      // Destrói as peças. Isto remove o seu <div> e filhos.
      pieces.forEach(p => p.destroy())

      // Dispara a callback.
      onComplete()
    }
  })
}
