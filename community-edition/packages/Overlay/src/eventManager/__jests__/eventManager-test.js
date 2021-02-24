/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import eventManager from '../eventManager';

describe('eventManager', () => {
  const clickEvent = new CustomEvent('click', { bubbles: true });
  const mouseenterEvent = new CustomEvent('mouseenter', { bubbles: true });
  const mouseleaveEvent = new CustomEvent('mouseleave', { bubbles: true });

  // inject the HTML fixture for the tests
  beforeEach(() => {
    const fixture = `<div id="fixture">
        <div id="target1" class="tooltip">
          target 1
          <div id="target-1-1">
            Hello from target 1 1
          </div>
        </div>
        <div id="target2" class="tooltip"> target 2 </div>
        <div id="target3"> target 3 </div>

        <div id="overlay">
          hello world
          <div id="tooltipChild">hello from tooltip child</div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', fixture);
  });

  // remove the html fixture from the DOM
  afterEach(() => {
    document.body.removeChild(document.getElementById('fixture'));
  });

  it('registeres showEvent on document and calls onShow only on if matches target', () => {
    const onShow = jest.fn();
    const manager = eventManager({
      onShow,
      target: '.tooltip',
      showEvent: ['click', 'mouseenter'],
    });

    const target1 = document.getElementById('target1');
    const target2 = document.getElementById('target2');
    const target3 = document.getElementById('target3');

    target1.dispatchEvent(clickEvent);
    expect(onShow).toHaveBeenCalled();

    target2.dispatchEvent(mouseenterEvent);
    expect(onShow).toHaveBeenCalled();

    // not called on unmatched element
    target3.dispatchEvent(clickEvent);
    target3.dispatchEvent(mouseenterEvent);
    expect(onShow).toHaveBeenCalled();

    manager.unregister();
  });

  it('registeres onHide on document and calls onHide only on if matches target', () => {
    const onHide = jest.fn();
    const manager = eventManager({
      onHide,
      target: '.tooltip',
      hideEvent: ['click', 'mouseenter'],
    });

    const target1 = document.getElementById('target1');
    const target2 = document.getElementById('target2');
    const target3 = document.getElementById('target3');

    target1.dispatchEvent(clickEvent);
    expect(onHide).toHaveBeenCalledTimes(1);

    target2.dispatchEvent(mouseenterEvent);
    expect(onHide).toHaveBeenCalledTimes(2);

    // not called on unmatched element
    target3.dispatchEvent(clickEvent);
    target3.dispatchEvent(mouseenterEvent);
    expect(onHide).toHaveBeenCalledTimes(2);

    manager.unregister();
  });

  it('removes events registered on document', () => {
    const onShow = jest.fn();
    const onHide = jest.fn();
    const target1 = document.getElementById('target1');
    const target2 = document.getElementById('target2');

    const manager = eventManager({
      onShow,
      onHide,
      target: '.tooltip',
      hideEvent: ['click', 'mouseenter'],
      showEvent: ['mouseleave', 'mouseenter'],
    });

    manager.unregister();

    target1.dispatchEvent(clickEvent);
    expect(onShow.mock.calls.length).toBe(0);
    expect(onHide.mock.calls.length).toBe(0);

    target2.dispatchEvent(mouseenterEvent);
    expect(onShow.mock.calls.length).toBe(0);
    expect(onHide.mock.calls.length).toBe(0);
  });

  it('if showEvent and hideEvent have an event in common it toggles between onShow and onHide', () => {
    const onShow = jest.fn();
    const onHide = jest.fn();
    const target1 = document.getElementById('target1');
    let visible = false;

    const manager = eventManager({
      onShow,
      onHide,
      getVisible: () => visible,
      getActiveTargetNode: () => target1,
      target: '.tooltip',
      hideEvent: ['click', 'mouseenter'],
      showEvent: ['click', 'mouseenter'],
    });

    target1.dispatchEvent(clickEvent);
    expect(onShow.mock.calls.length).toBe(1);
    expect(onHide.mock.calls.length).toBe(0);
    visible = true;

    target1.dispatchEvent(clickEvent);
    expect(onShow.mock.calls.length).toBe(1);
    expect(onHide.mock.calls.length).toBe(1);
    visible = false;

    target1.dispatchEvent(mouseenterEvent);
    expect(onShow.mock.calls.length).toBe(2);
    expect(onHide.mock.calls.length).toBe(1);
    visible = true;

    target1.dispatchEvent(mouseenterEvent);
    expect(onShow.mock.calls.length).toBe(2);
    expect(onHide.mock.calls.length).toBe(2);

    manager.unregister();
  });

  describe('hideOnClickOutside', () => {
    it('calls onHide when a click is registered outside of active target or tooltip', () => {
      const onHide = jest.fn();
      const overlayNode = document.getElementById('overlay');
      const targetNode = document.getElementById('target1');

      const targetNodeChild = document.getElementById('target-1-1');
      const tooltipChild = document.getElementById('tooltipChild');

      const getOverlayNode = jest.fn(() => overlayNode);
      const getActiveTargetNode = jest.fn(() => targetNode);

      const manager = eventManager({
        onHide,
        target: '.tooltip',
        hideOnClickOutside: true,
        getOverlayNode,
        getActiveTargetNode,
      });

      // click on different item
      expect(onHide.mock.calls.length).toBe(0);
      const target2 = document.getElementById('target2');
      target2.dispatchEvent(clickEvent);
      expect(onHide.mock.calls.length).toBe(1);

      // not called when is tooltip or target
      targetNode.dispatchEvent(clickEvent);
      overlayNode.dispatchEvent(clickEvent);
      expect(onHide.mock.calls.length).toBe(1);

      // not called from a child of tooltip or target
      targetNodeChild.dispatchEvent(clickEvent);
      tooltipChild.dispatchEvent(clickEvent);
      expect(onHide.mock.calls.length).toBe(1);

      // called when document is clicked
      document.dispatchEvent(clickEvent);
      expect(onHide.mock.calls.length).toBe(2);

      manager.unregister();

      // also check it unregisteres
      document.dispatchEvent(clickEvent);
      expect(onHide.mock.calls.length).toBe(2);

      // getters
      expect(getOverlayNode.mock.calls.length).not.toBe(0);
      expect(getActiveTargetNode.mock.calls.length).not.toBe(0);
    });
  });

  describe('hideOnScroll', () => {
    it('calls onHide onscroll', () => {
      const onHide = jest.fn();
      const manager = eventManager({
        onHide,
        target: '.tooltip',
        hideOnScroll: true,
        getVisible: () => true,
      });

      const scrollEvent = new CustomEvent('scroll', { bubbles: true });
      document.dispatchEvent(scrollEvent);
      expect(onHide).toHaveBeenCalledTimes(1);

      manager.unregister();

      document.dispatchEvent(scrollEvent);
      expect(onHide).toHaveBeenCalledTimes(1);
    });
    it('it doesnt call onHide when false on scroll', () => {
      const onHide = jest.fn();
      const manager = eventManager({
        onHide,
        target: '.tooltip',
        hideOnScroll: false,
        getVisible: () => true,
      });

      const scrollEvent = new CustomEvent('scroll', { bubbles: true });
      document.dispatchEvent(scrollEvent);
      expect(onHide).not.toHaveBeenCalled;

      manager.unregister();
    });
  });

  describe('target as node', () => [
    it('registers onShow and onHide when target is a dom element', () => {
      const onHide = jest.fn();
      const onShow = jest.fn();
      const target1 = document.getElementById('target1');

      const manager = eventManager({
        onHide,
        onShow,
        showEvent: ['mouseenter'],
        hideEvent: ['mouseleave'],
        target: target1,
      });

      target1.dispatchEvent(mouseenterEvent);
      expect(onShow).toHaveBeenCalled();
      target1.dispatchEvent(mouseleaveEvent);
      expect(onHide).toHaveBeenCalled();

      manager.unregister();
    }),
  ]);

  describe('popover domNode show|hide events', () => {
    it('should trigger onShow on overlay onMouseenter if hideEvents has mouseleave', () => {
      const onShow = jest.fn();
      const overlay = document.getElementById('overlay');
      const target1 = document.getElementById('target1');

      overlay.test = true;
      const manager = eventManager({
        onShow,
        showEvent: ['mouseenter'],
        hideEvent: ['mouseleave'],
        target: '.tooltip',
        getOverlayNode: () => overlay,
        getActiveTargetNode: () => target1,
      });

      overlay.dispatchEvent(mouseenterEvent);
      expect(onShow).toHaveBeenCalled();

      manager.unregister();
    });
    it('should trigger onHide on overlay onMouseleave if hideEvents has mouseleave', () => {
      const onHide = jest.fn();
      const onShow = jest.fn();
      const overlay = document.getElementById('overlay');
      const target1 = document.getElementById('target1');

      const manager = eventManager({
        onHide,
        showEvent: ['mouseenter'],
        hideEvent: ['mouseleave'],
        target: '.tooltip',
        getOverlayNode: () => overlay,
        getActiveTargetNode: () => target1,
      });

      overlay.dispatchEvent(mouseleaveEvent);
      expect(onHide).toHaveBeenCalled();

      manager.unregister();
    });
  });
});
