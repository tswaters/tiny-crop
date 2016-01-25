
import * as Util from './util'
import Element from './element'

export default class Cropper extends Element {

  constructor ({
    tinycrop: tinycrop
  }) {
    super(document.createElement('div'))
    this.tinycrop = tinycrop
    this.element.classList.add('crop-area')
    document.body.appendChild(this.element)
  }

  /**
   * @summary attaches drag functionality to the cropper
   * @description called after a crop region has been created, allows user to move it.
   */
  startDrag () {
    this.events.mouseDown = Util.attach(this.element, 'mousedown', (e) => {
      let anchor = {
        x: Util.isUndefined(e.offsetX) ? e.layerX : e.offsetX,
        y: Util.isUndefined(e.offsetY) ? e.layerY : e.offsetY
      }
      this.tinycrop.startDrag(anchor, e)
    })
  }

  update (dimensions) {
    this.element.style.top = dimensions.top ? dimensions.top + 'px' : ''
    this.element.style.right = dimensions.right ? dimensions.right + 'px' : ''
    this.element.style.bottom = dimensions.bottom ? dimensions.bottom + 'px' : ''
    this.element.style.left = dimensions.left ? dimensions.left + 'px' : ''
    this.element.style.width = dimensions.width + 'px'
    this.element.style.height = dimensions.height + 'px'
  }

}
