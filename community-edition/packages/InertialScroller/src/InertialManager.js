/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import isMobile from '../../../common/isMobile';
import clamp from '../../../common/clamp';
import containsNode from '../../../common/containsNode';
import matchesSelector from '../../../common/matchesSelector';

function ypos(e) {
  // touch event
  if (e.targetTouches && e.targetTouches.length >= 1) {
    return e.targetTouches[0].clientY;
  }

  // mouse event
  return e.clientY;
}

class InertialManager {
  constructor({
    node,
    viewNode,
    arrowSelector,
    threshold = 5,
    timeConstant = 360,
    initialAmplitude = 0.8,
    enableMouseDrag = true,
    enableTouchDrag = true,
    setScrollPosition = () => {},
  }) {
    this.node = node;
    this.viewNode = viewNode;
    if (!arrowSelector) {
      throw 'Please provide an arrowselector';
    }
    this.arrowSelector = arrowSelector;

    this.tap = this.tap.bind(this);
    this.drag = this.drag.bind(this);
    this.release = this.release.bind(this);
    this.track = this.track.bind(this);
    this.autoScroll = this.autoScroll.bind(this);

    this.min = 0;
    this.max = null;
    this.pressed = null;
    this.reference = null;
    this.offset = 0;

    this.threshold = threshold;
    this.timeConstant = timeConstant;
    this.enableTouchDrag = enableTouchDrag;
    this.enableMouseDrag = enableMouseDrag;
    this.setScrollPosition = setScrollPosition;
    this.initialAmplitude = initialAmplitude;

    this.updateMaxScroll();
    this.addEventListeners();
  }

  addEventListeners() {
    if (!this.node || !this.node.addEventListener) {
      return;
    }
    if (isMobile && this.enableTouchDrag) {
      this.node.addEventListener('touchstart', this.tap, { passive: false });
      this.node.addEventListener('touchend', this.release, { passive: false });
      this.node.addEventListener('touchmove', this.drag, { passive: false });
    }
    if (!isMobile && this.enableMouseDrag) {
      this.node.addEventListener('mousedown', this.tap, { passive: false });
      this.node.addEventListener('mouseup', this.release, { passive: false });
      this.node.addEventListener('mousemove', this.drag, { passive: false });
    }
  }

  removeEventListeners() {
    if (this.node && this.node.removeEventListener) {
      this.node.removeEventListener('touchstart', this.tap, { passive: false });
      this.node.removeEventListener('touchend', this.release, {
        passive: false,
      });
      this.node.removeEventListener('touchmove', this.drag, { passive: false });
      this.node.removeEventListener('mousedown', this.tap, { passive: false });
      this.node.removeEventListener('mouseup', this.release, {
        passive: false,
      });
      this.node.removeEventListener('mousemove', this.drag, { passive: false });
    }
  }

  getEventListneres() {
    let events;
    if (isMobile && this.enableTouchDrag) {
      events = {
        onTouchStart: this.tap,
        onTouchEnd: this.release,
        onTouchMove: this.drag,
      };
    }

    if (!isMobile && this.enableMouseDrag) {
      events = {
        onMouseDown: this.tap,
        onMouseUp: this.release,
        onMouseMove: this.drag,
      };
    }

    return events;
  }

  isArrowTarget(target) {
    if (matchesSelector(target, this.arrowSelector)) {
      return true;
    }

    const arrows = this.arrowSelector
      ? this.arrows || [...this.node.querySelectorAll(this.arrowSelector)]
      : [];

    if (arrows.length) {
      this.arrows = arrows;
    }

    if (
      arrows.length &&
      arrows.map(arrow => containsNode(arrow, target)).filter(x => x)[0]
    ) {
      return true;
    }

    return false;
  }

  tap(event) {
    if (!this.hasScroll()) {
      return;
    }

    if (this.isArrowTarget(event.target)) {
      event.preventDefault();
    }

    this.pressed = true;
    this.reference = ypos(event);

    this.timeStamp = Date.now();
    this.frame = this.offset;
    this.velocity = 0;
    this.amplitude = 0;

    clearInterval(this.ticker);
    this.ticker = setInterval(this.track, 16);
  }

  drag(event) {
    if (this.pressed) {
      if (!this.hasScroll()) {
        return;
      }

      event.preventDefault();
      const y = ypos(event);
      let delta = this.reference - y;
      if (delta > this.threshold || delta < -this.threshold) {
        this.reference = y;
        this.scrollTo(this.offset + delta);
      }
    }
  }

  release(event) {
    if (!this.hasScroll() || !this.pressed) {
      return;
    }

    this.pressed = false;
    this.updateMaxScroll();
    if (this.isArrowTarget(event.target)) {
      event.preventDefault();
    }

    clearInterval(this.ticker);
    if (this.velocity > 10 || this.velocity < -10) {
      this.amplitude = this.initialAmplitude * this.velocity;
      this.target = Math.round(this.offset + this.amplitude);
      this.timestamp = Date.now();
      requestAnimationFrame(this.autoScroll);
    }
  }

  scrollTo(offset) {
    if (!this.viewNode) {
      return null;
    }

    this.offset = clamp(offset, 0, this.max);
    this.setScrollPosition(this.offset);
  }

  autoScroll() {
    let elapsed, delta;
    const timeConstant = this.timeConstant; // ms

    if (this.amplitude) {
      elapsed = Date.now() - this.timestamp;
      delta = -this.amplitude * Math.exp(-elapsed / timeConstant);
      if (delta > 0.1 || delta < -0.1) {
        this.scrollTo(this.target + delta);
        requestAnimationFrame(this.autoScroll);
      } else {
        this.scrollTo(this.target);
      }
    }
  }

  updateMaxScroll() {
    this.max =
      this.viewNode && this.viewNode.offsetHeight - this.node.offsetHeight;
  }

  hasScroll() {
    if (
      (this.viewNode && this.viewNode.offsetHeight) !== undefined &&
      (this.node && this.node.offsetHeight) !== undefined
    ) {
      return this.viewNode.offsetHeight > this.node.offsetHeight;
    } else {
      return false;
    }
  }

  track() {
    let now, elapsed, delta, v;

    now = Date.now();
    elapsed = now - this.timeStamp;
    this.timeStamp = now;
    delta = this.offset - this.frame;
    this.frame = this.offset;

    v = (1000 * delta) / (1 + elapsed);
    this.velocity = 0.8 * v + 0.2 * this.velocity;
  }
}

export default InertialManager;
