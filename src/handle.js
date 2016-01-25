
import * as Util from './util'
import Element from './element'

export default class Handle extends Element {

  /**
   * @param {string} handle key identifying what handle it is.
   * @param {DomNode} parent dom node the handle is attached to.
   */
  constructor ({
    handle: handle,
    parent: parent,
    tinycrop: tinycrop
  }) {
    super(document.createElement('div'))
    this.tinycrop = tinycrop
    this.north = handle.toLowerCase().indexOf('north') > -1,
    this.south = handle.toLowerCase().indexOf('south') > -1,
    this.east = handle.toLowerCase().indexOf('east') > -1,
    this.west = handle.toLowerCase().indexOf('west') > -1
    this.element.dataset[handle] = true
    this.element.classList.add('handle')
    parent.appendChild(this.element)
  }

  startResize (cropperRect) {
    this.events.mouseDown = Util.attach(this.element, 'mousedown', (e) => {
      this.tinycrop.startResize({
        x:
          this.west ? cropperRect.left + cropperRect.width :
          this.east ? cropperRect.left :
          null,
        y:
          this.north ? cropperRect.top + cropperRect.height :
          this.south ? cropperRect.top :
          null
      }, e)
    })
  }

}
