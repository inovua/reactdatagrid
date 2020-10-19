/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import { createRef } from 'react';
import { render, unmountComponentAtNode } from 'react-dom';

const renderInDOM = (comp, domTarget = document.body) => {
  const target = document.createElement('div');
  domTarget.appendChild(target);

  const Cmp = comp;
  const cmpRef = createRef();

  const wrapper = render(<Cmp ref={cmpRef} />, target);

  return {
    wrapper,
    wrapperNode: cmpRef.current,
    target,
    unmount: () => {
      unmountComponentAtNode(target);
      document.body.removeChild(target);
    },
  };
};

export default renderInDOM;
