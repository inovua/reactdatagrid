/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { useState } from 'react';
import { render } from 'react-dom';
import ScrollContainer from '../src';
import '../style/index.scss';

const App = () => {
  const [rtl, setRtl] = useState(true);
  return (
    <div>
      <button
        onClick={() => {
          setRtl(rtl => !rtl);
        }}
      >
        Toggle RTL - {`${rtl}`}
      </button>

      <ScrollContainer
        rtl={rtl}
        key={`${rtl}`}
        ref={g => {
          global.g = g;
        }}
        onContainerScrollHorizontalMax={scrollLeft => {
          console.warn('max', scrollLeft);
        }}
        onContainerScrollVerticalMax={scrollTop => {
          console.warn('max vertical', scrollTop);
        }}
        onContainerScrollHorizontal={scrollLeft => {
          console.warn('scroll', scrollLeft);
        }}
        style={{
          margin: 'auto',
          height: '30vh',
          width: '50vw',
          border: '2px solid black',
          direction: 'rtl',
          textAlign: 'start',
        }}
        applyCSSContainOnScroll={false}
        autoHide={false}
      >
        <div
          style={{
            background: 'magenta',
            minWidth: 1000,
            width: '100%',
            height: 2000,
            border: '2px solid yellow',
            color: 'white',
          }}
        >
          Content here Voluptate nulla Lorem excepteur ullamco Lorem eu culpa
          labore et officia irure pariatur dolor esse. Cupidatat fugiat
          voluptate quis cupidatat sit officia laborum nisi nulla officia aute
          veniam id. Mollit elit tempor voluptate adipisicing mollit proident ut
          ut. Dolore aute pariatur nisi tempor mollit officia et in esse Lorem
          sit exercitation officia laboris. Ullamco id sunt cillum fugiat irure
          adipisicing minim consequat. Labore non mollit in veniam Lorem do duis
          velit. Ullamco id velit nostrud nostrud commodo laboris proident.
          Dolor occaecat duis laborum occaecat ad. Dolor proident et ipsum
          eiusmod nostrud minim nisi do aliqua. Sit sit aliquip tempor commodo
          amet aliquip adipisicing proident et do incididunt est dolore. Esse
          officia culpa fugiat dolor veniam nulla eu aute Lorem deserunt ea qui
          do. Nulla aliquip pariatur dolore ut consequat ex ad nulla. Aliquip
          Lorem sint dolore ea officia ex consequat reprehenderit voluptate non
          voluptate voluptate officia. Minim cillum eu adipisicing dolore
          commodo culpa veniam proident elit Lorem consequat. Ipsum nostrud in
          tempor aliqua Lorem et non. Anim pariatur qui occaecat occaecat anim
          ex adipisicing minim sunt reprehenderit nisi magna ipsum.
        </div>
      </ScrollContainer>
    </div>
  );
};
render(<App />, document.getElementById('content'));
