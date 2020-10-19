/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { createRef } from 'react';
import ReactDOM from 'react-dom';

import VirtualList from '../index';
import RowHeightManager from '../RowHeightManager';
import '../../style/index.scss';

const scrollTo = (scrollTop, { instance }) => {
  instance.applyScrollStyle({ scrollTop }, instance.getScrollerNode());
};

const render = cmp => {
  const node = document.createElement('div');
  document.body.appendChild(node);

  let cmpInstance = createRef();

  ReactDOM.render(
    React.cloneElement(cmp, {
      ref: cmpInstance,
    }),
    node
  );

  return {
    get instance() {
      return cmpInstance.current;
    },
    get node() {
      return cmpInstance.current;
    },
    rerender: cmp => {
      ReactDOM.render(cmp, node);
    },
    destroy: () => {
      ReactDOM.unmountComponentAtNode(node);
      cmpInstance.current = null;
    },
  };
};

test('onResize called', () => {
  const onResize = jest.fn();
  const renderRow = jest.fn();
  const { instance, destroy } = render(
    <VirtualList
      rowHeight={30}
      renderRow={renderRow}
      rowHeightManager={new RowHeightManager(30, {})}
      count={3}
      onResize={onResize}
      measureSize={() => {
        return {
          width: 300,
          height: 300,
        };
      }}
    />
  );

  instance.onResize();
  expect(onResize).toHaveBeenCalledTimes(1);
  destroy();
});

describe('VirtualList renderRow', () => {
  test('called count times when just a few rows', done => {
    expect.assertions(1);
    const renderRow = jest.fn();
    const { instance, destroy } = render(
      <VirtualList
        rowHeight={30}
        renderRow={renderRow}
        rowHeightManager={new RowHeightManager(30, {})}
        count={3}
        measureSize={() => {
          return {
            width: 300,
            height: 300,
          };
        }}
      />
    );

    instance.onResize();
    setTimeout(() => {
      expect(renderRow).toHaveBeenCalledTimes(3);
      destroy();
      done();
    });
  });

  test('called less times when there are many rows', done => {
    expect.assertions(3);

    const indexes = [];
    const renderRow = jest.fn(({ index }) => {
      indexes.push(index);
      return <div>{index}</div>;
    });

    const { instance, destroy } = render(
      <VirtualList
        renderRow={renderRow}
        rowHeight={50}
        rowHeightManager={new RowHeightManager(50, {})}
        count={30}
        measureSize={() => {
          return {
            width: 300,
            height: 300,
          };
        }}
      />
    );

    expect(renderRow).toHaveBeenCalledTimes(0);
    instance.onResize();
    setTimeout(() => {
      expect(renderRow).toHaveBeenCalledTimes(7);
      expect(indexes).toEqual([0, 1, 2, 3, 4, 5, 6]);
      destroy();
      done();
    }, 20);
  });

  test('on scroll, renderRow should be called', () => {
    const renderRow = jest.fn(({ index }) => {
      return <div>:{index}:</div>;
    });

    const rowHeight = 50;
    const height = 300;
    const { node, instance, destroy } = render(
      <VirtualList
        renderRow={renderRow}
        rowHeight={rowHeight}
        count={30}
        rowHeightManager={new RowHeightManager(rowHeight, {})}
        measureSize={() => {
          return {
            width: 300,
            height,
          };
        }}
      />
    );

    expect(renderRow).toHaveBeenCalledTimes(0);
    instance.onResize();

    const initialRenderTimes = height / rowHeight + 1; // 7
    expect(renderRow).toHaveBeenCalledTimes(initialRenderTimes);
    expect(node.textContent).toEqual(':0::1::2::3::4::5::6:');

    scrollTo(2 * rowHeight, { instance });
    expect(renderRow).toHaveBeenCalledTimes(initialRenderTimes + 2);
    expect(node.textContent).toEqual(':8::7::2::3::4::5::6:');

    scrollTo(0, { instance });
    expect(renderRow).toHaveBeenCalledTimes(initialRenderTimes + 2 + 2);
    expect(node.textContent).toEqual(':0::1::2::3::4::5::6:');

    destroy();
  });

  test('onResize when less size is available after resize', () => {
    const renderRow = jest.fn(({ index }) => {
      return <div>:{index}:</div>;
    });

    const rowHeight = 50;
    const height = 300;

    const { node, rerender, instance, destroy } = render(
      <VirtualList
        renderRow={renderRow}
        rowHeight={rowHeight}
        rowHeightManager={new RowHeightManager(rowHeight, {})}
        count={30}
        measureSize={() => {
          return {
            width: 300,
            height,
          };
        }}
      />
    );

    expect(renderRow).toHaveBeenCalledTimes(0);
    instance.onResize();

    const initialRenderTimes = height / rowHeight + 1; // 7
    expect(renderRow).toHaveBeenCalledTimes(initialRenderTimes);
    expect(node.textContent).toEqual(':0::1::2::3::4::5::6:');

    const newHeight = 200;
    rerender(
      <VirtualList
        renderRow={renderRow}
        rowHeight={rowHeight}
        rowHeightManager={new RowHeightManager(rowHeight, {})}
        count={30}
        measureSize={() => {
          return {
            width: 300,
            height: newHeight,
          };
        }}
      />
    );

    instance.onResize();

    expect(renderRow).toHaveBeenCalledTimes(
      initialRenderTimes + initialRenderTimes + (newHeight / rowHeight + 1)
    );

    expect(node.textContent).toEqual(':0::1::2::3::4:');

    destroy();
  });
});
