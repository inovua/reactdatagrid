/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import eventManager from '../eventManager';

describe('eventManager delays', () => {
  const clickEvent = new CustomEvent('click', { bubbles: true });
  const mouseenterEvent = new CustomEvent('mouseenter', { bubbles: true });
  const mouseleaveEvent = new CustomEvent('mouseleave', { bubbles: true });

  // inject the HTML fixture for the tests
  beforeEach(() => {
    const fixture = `<div id="fixture1">
        <div id="target1" class="tooltip">
          target 1
        </div>
        <div id="target2" class="tooltip"> target 2 </div>
        <div id="target3"> target 3 </div>
        <div id="tooltip">
          Hello world from tooltip
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', fixture);
  });

  // remove the html fixture from the DOM
  afterEach(() => {
    document.body.removeChild(document.getElementById('fixture1'));
  });

  it('onShow is called after showDelay ms', done => {
    const onShow = jest.fn();
    const targetNode = document.getElementById('target1');
    const manager = eventManager({
      onShow,
      showEvent: ['mouseenter'],
      target: '.tooltip',
      getShowDelay: () => 300,
    });

    targetNode.dispatchEvent(mouseenterEvent);

    setTimeout(() => {
      expect(onShow).toHaveBeenCalledTimes(0);
      setTimeout(() => {
        expect(onShow).toHaveBeenCalled();
        done();
      }, 350);
    }, 100);

    manager.unregister();
  });

  it('onHide is called after hideDelay ms', done => {
    const onHide = jest.fn();
    const targetNode = document.getElementById('target1');
    const manager = eventManager({
      onHide,
      hideEvent: ['mouseenter'],
      target: '.tooltip',
      getHideDelay: () => 300,
    });

    targetNode.dispatchEvent(mouseenterEvent);
    setTimeout(() => {
      expect(onHide).toHaveBeenCalledTimes(0);

      setTimeout(() => {
        expect(onHide).toHaveBeenCalledTimes(1);
        done();
        manager.unregister();
      }, 350);
    }, 100);
  });

  describe('showDelay and hideDelay interaction', () => {
    // case 1
    xit("onShow dom event doesn't scheduled another onShow", done => {
      const overlayNode = document.getElementById('tooltip');
      const targetNode = document.getElementById('target1');

      const onShow = jest.fn();
      const manager = eventManager({
        getOverlayNode: () => overlayNode,
        getActiveTargetNode: () => targetNode,
        onShow,
        showEvent: ['mouseenter'],
        target: '.tooltip',
        getShowDelay: () => 300,
      });

      targetNode.dispatchEvent(mouseenterEvent);

      setTimeout(() => {
        targetNode.dispatchEvent(mouseenterEvent);
        expect(onShow).toHaveBeenCalledTimes(0);
        setTimeout(() => {
          expect(onShow).toHaveBeenCalled();
          targetNode.dispatchEvent(mouseenterEvent);
          setTimeout(() => {
            expect(onShow).toHaveBeenCalledTimes(2);
            done();
          }, 900);
        }, 400);
        manager.unregister();
      }, 200);
    });

    // case 2
    it('onShow domEvent from another target cancels previous one and schedules the other', done => {
      const overlayNode = document.getElementById('tooltip');
      const targetNode = document.getElementById('target1');
      const target2 = document.getElementById('target2');

      const onShow = jest.fn();
      const manager = eventManager({
        onShow,
        getOverlayNode: () => overlayNode,
        getActiveTargetNode: () => targetNode,
        showEvent: ['mouseenter'],
        target: '.tooltip',
        getShowDelay: () => 300,
      });

      // trigger mouseenter from targetNode
      targetNode.dispatchEvent(mouseenterEvent);

      setTimeout(() => {
        const newTargetMouseEnterEvent = new CustomEvent('mouseenter', {
          bubbles: true,
        });
        target2.dispatchEvent(newTargetMouseEnterEvent);

        setTimeout(() => {
          expect(onShow).toHaveBeenCalled();
          expect(onShow.mock.calls[0][0].target).toEqual(target2);
          done();
        }, 600);
        manager.unregister();
      }, 100);
    });

    // case 3
    it('domHide event cancels a scheduled onShow event', done => {
      const targetNode = document.getElementById('target1');

      const onShow = jest.fn();
      const onHide = jest.fn();
      const manager = eventManager({
        onShow,
        onHide,

        showEvent: ['mouseenter'],
        hideEvent: ['mouseleave'],
        target: '.tooltip',
        getShowDelay: () => 300,
        getHideDelay: () => 300,
      });

      targetNode.dispatchEvent(mouseenterEvent);

      setTimeout(() => {
        targetNode.dispatchEvent(mouseleaveEvent);

        setTimeout(() => {
          expect(onShow).toHaveBeenCalledTimes(0);
          done();
        }, 400);
        manager.unregister();
      }, 100);
    });

    // case 4 - is shold not do anything

    // case 5
    it('onHide domEvent will not schedule another onHide when there is already one ongoing from same target', done => {
      const targetNode = document.getElementById('target1');

      const onShow = jest.fn();
      const onHide = jest.fn();
      const manager = eventManager({
        onShow,
        onHide,
        showEvent: ['mouseenter'],
        hideEvent: ['mouseleave'],
        target: '.tooltip',
        getShowDelay: () => 300,
        getHideDelay: () => 300,
      });

      targetNode.dispatchEvent(mouseleaveEvent);

      setTimeout(() => {
        targetNode.dispatchEvent(mouseleaveEvent);
        setTimeout(() => {
          expect(onHide).toHaveBeenCalled();
          setTimeout(() => {
            expect(onHide).toHaveBeenCalled();
            done();
          }, 400);
        }, 200);
      }, 100);

      manager.unregister();
    });

    // case 6 - noting to do

    // case 7
    xit('onShow domEvent will cancel a scheduled onHide', done => {
      const targetNode = document.getElementById('target1');
      const target2 = document.getElementById('target2');

      const onShow = jest.fn();
      const onHide = jest.fn();
      const manager = eventManager({
        onShow,
        onHide,
        showEvent: ['mouseenter'],
        hideEvent: ['mouseleave'],
        target: '.tooltip',
        getShowDelay: () => 300,
        getHideDelay: () => 300,
      });

      targetNode.dispatchEvent(mouseleaveEvent);
      setTimeout(() => {
        target2.dispatchEvent(mouseenterEvent);
        setTimeout(() => {
          expect(onHide).toHaveBeenCalledTimes(0);
          done();
        }, 400);
      }, 100);

      manager.unregister();
    });
  });
});
