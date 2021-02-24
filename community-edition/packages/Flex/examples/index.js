/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';
import { Flex, Item } from '../';

import '../style/index.scss';

const App = () => {
  return (
    <Flex flex={2} style={{ width: '100vw', height: '100vh' }}>
      <Item flex={1}>one</Item>
      <Item flex={2}>two</Item>
    </Flex>
  );
};

render(<App />, document.getElementById('content'));
