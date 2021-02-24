/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ReactDOM from 'react-dom';

import { cloneElement } from 'react';

import {
  findBodyCells,
  findCells,
  findHeaderCells,
  findRowAt,
  findRows,
  getSortIcons,
  wait,
} from './__test__/utils';

const render = cmp => {
  const targetNode = document.createElement('div');

  targetNode.style.height = '600px';
  targetNode.style.width = '1000px';
  document.body.appendChild(targetNode);

  const instance = ReactDOM.render(cmp, targetNode);

  instance.rerender = cmp => {
    return ReactDOM.render(cmp, targetNode);
  };

  instance.setProps = newProps => {
    return ReactDOM.render(cloneElement(cmp, newProps), targetNode);
  };

  instance.unmount = () => {
    ReactDOM.unmountComponentAtNode(targetNode);
    document.body.removeChild(targetNode);
  };

  return instance;
};

export default render;

function simulateMouseEvent(eventType, target) {
  var evt = new MouseEvent(eventType, {
    bubbles: true,
    cancelable: true,
    view: global,
  });
  target.dispatchEvent(evt);
}

function simulateKeyboardEvent(eventType, target, key) {
  const evt = new KeyboardEvent(eventType, {
    bubbles: true,
    cancelable: true,
    view: window,
    key: key,
  });
  target.dispatchEvent(evt);
}

export {
  render,
  simulateMouseEvent,
  simulateKeyboardEvent,
  findBodyCells,
  findCells,
  findHeaderCells,
  findRowAt,
  findRows,
  getSortIcons,
  wait,
};
