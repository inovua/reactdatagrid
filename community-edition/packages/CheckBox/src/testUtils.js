/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ReactDOM from 'react-dom';

const render = cmp => {
  const targetNode = document.createElement('div');

  targetNode.style.height = '600px';
  targetNode.style.width = '1000px';
  document.body.appendChild(targetNode);

  const instance = ReactDOM.render(cmp, targetNode);

  instance.rerender = cmp => {
    return ReactDOM.render(cmp, targetNode);
  };

  instance.unmount = () => {
    ReactDOM.unmountComponentAtNode(targetNode);
    document.body.removeChild(targetNode);
  };

  return instance;
};

export default render;
export { render };
