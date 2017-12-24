import Velocity from 'velocity-animate'
import {getPosition} from './Coords'

function getTopLeft(pos) {
  var p = getPosition(pos[0], pos[1])
  return {left: p[0], top: p[1]}
}

export function animateSwap(pieceA, pieceB) {
  // As peças já possuem sua .position correta (row,col).
  // Só precisamos animar o top/left de cada uma.
  Velocity(pieceA.$el, getTopLeft(pieceA.position), {easing: [400,30]})
  Velocity(pieceB.$el, getTopLeft(pieceB.position), {easing: [400,30]})
}

export function animateRemove(pieces) {
  var $els = _.map(pieces, '$img')
  Velocity($els, {scale: 0})
}
