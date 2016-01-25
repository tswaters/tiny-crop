
import * as Util from './util'
import Element from './element'

export default class Image extends Element {

  constructor ({
    image: image,
    tinycrop: tinycrop
  }) {
    super(image)
    this.tinycrop = tinycrop
    this.element.classList.add('crop-target')
  }

  /**
   * @summary Resets state to initial
   * @description Used after the crop has finished, allows for starting a new crop region
   */
  startSize () {
    this.events.mouseDown = Util.attach(this.element, 'mousedown', (e) => {
      this.tinycrop.startSize({x: e.clientX, y: e.clientY}, e)
    })
  }

  destroy () {
    super.destroy(false)
    this.element.classList.remove('crop-target')
  }

}
