/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import { render } from 'react-dom';

import InertialScroller from '../src/';
import '../style/index.scss';
import './index.scss';

class App extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <InertialScroller>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
            eget purus libero. Nulla ut pretium libero. Vestibulum adipiscing
            quam ac sapien scelerisque, a posuere sem dictum. Ut aliquet lectus
            ut nibh dapibus cursus. Donec quam libero, aliquam nec aliquam quis,
            feugiat quis metus. Phasellus ac orci mauris. Cras hendrerit
            suscipit nisi, eget varius mi condimentum vel. Donec id libero
            magna. Nam scelerisque nisi tellus, ut cursus ipsum imperdiet eget.
            Donec porttitor non lectus ut lacinia. Cum sociis natoque penatibus
            et magnis dis parturient montes, nascetur ridiculus mus. Ut egestas
            commodo facilisis. Etiam orci nibh, pellentesque sed ipsum
            consequat, faucibus tempus augue. Cras iaculis diam in auctor
            bibendum.
          </p>
          <p>
            Nulla ornare, nisl vel condimentum bibendum, quam velit vestibulum
            sem, vel aliquam tellus urna vitae justo. Aenean elementum semper
            nulla, a mattis tellus venenatis in. Nulla rhoncus felis risus, sed
            convallis libero viverra at. Aenean at lobortis neque. Vivamus
            viverra lectus id libero congue bibendum. Curabitur id est et arcu
            dapibus laoreet. Duis imperdiet elit et mauris adipiscing, vehicula
            vulputate nisi accumsan. Nunc varius ante lorem, eget volutpat sem
            mollis blandit.
          </p>
          <p>
            Donec tincidunt rutrum tincidunt. Duis viverra sem in metus sodales,
            sed suscipit turpis aliquet. Etiam eleifend id dolor eget hendrerit.
            Curabitur pulvinar lacus et sapien dictum feugiat. Praesent iaculis
            sagittis ipsum nec semper. Nam pellentesque tortor ac nibh egestas
            dignissim. Curabitur sit amet auctor velit. Fusce nisl diam,
            placerat eget consectetur in, congue ut sapien. In in facilisis
            felis. Nulla faucibus magna eget odio tincidunt rhoncus. In ac
            molestie lorem. Aliquam pulvinar porta nibh id pulvinar. Morbi id
            gravida libero. Nam consectetur, metus sit amet tincidunt varius,
            nibh tortor molestie nulla, non semper risus ligula non lectus.
          </p>
          <p>
            Phasellus imperdiet tincidunt ultricies. Vivamus mi tellus,
            pellentesque sed venenatis et, imperdiet at tellus. Fusce ut dui
            lobortis, sodales libero eget, elementum lacus. Nullam nisi urna,
            semper eget consequat at, sollicitudin non justo. Mauris consequat
            velit feugiat mollis bibendum. Aliquam mi enim, porta et vestibulum
            at, ultrices id ante. Ut vitae est non justo hendrerit pellentesque
            vel nec urna. Pellentesque gravida consequat quam at scelerisque.
            Proin mauris purus, euismod sit amet dui et, tempor feugiat est.
            Maecenas sed pretium quam, vitae sagittis nisl. Donec sed augue
            bibendum, elementum nulla tincidunt, semper risus.
          </p>
          <p>
            Suspendisse molestie placerat eros et posuere. Nullam tellus nisi,
            fermentum eu felis quis, consequat vestibulum odio. Interdum et
            malesuada fames ac ante ipsum primis in faucibus. Fusce congue
            pellentesque felis a venenatis. Morbi lacus libero, ornare id velit
            sit amet, gravida viverra elit. Proin id tellus nec lacus pulvinar
            tempor. Aliquam eu ligula nisi. Pellentesque interdum imperdiet urna
            at tristique. Duis nunc sapien, tincidunt nec posuere ac,
            scelerisque sed justo. Maecenas in ultricies arcu, eget mattis enim.
            Duis sollicitudin nec mauris sed interdum. Fusce et viverra dolor,
            vitae ullamcorper mauris. Nulla quis libero in dolor pellentesque
            convallis nec quis sem. Nulla quis malesuada dui. Mauris non
            vehicula arcu, non elementum turpis.
          </p>
          <p>
            Praesent faucibus, ipsum et rhoncus vestibulum, lacus tortor
            pellentesque lorem, vel elementum nunc lectus et est. Mauris semper
            lacinia sapien, nec consectetur elit adipiscing consectetur. In hac
            habitasse platea dictumst. Maecenas velit elit, placerat et quam at,
            commodo commodo ante. Praesent vel nulla dui. Phasellus rutrum velit
            nec dui dignissim, vitae tincidunt augue ultricies. Ut tincidunt sem
            ut viverra gravida. Vestibulum pellentesque ligula eget orci commodo
            venenatis. Donec metus urna, congue et adipiscing nec, placerat ac
            dui. Proin vel euismod magna, in venenatis tortor. Mauris
            pellentesque libero eu quam hendrerit porttitor. Proin lobortis
            lectus sed urna consequat euismod a et nibh. Suspendisse lacinia
            blandit nibh, nec tincidunt odio feugiat vitae. Nulla rhoncus tellus
            sed risus mattis, placerat imperdiet elit gravida. Vivamus
            fringilla, dui quis faucibus volutpat, lorem orci tristique urna,
            sed convallis turpis ipsum rutrum dolor.
          </p>
          <p>
            Aliquam turpis velit, pulvinar vitae vestibulum vel, volutpat a
            lorem. Aenean mattis ut felis ut egestas. Sed quis sapien quam.
            Fusce risus ligula, malesuada sed venenatis at, cursus nec enim.
            Phasellus ac dolor auctor mauris porta cursus. Proin tincidunt
            libero pulvinar, dapibus ligula nec, venenatis purus. Maecenas
            mauris nulla, faucibus ac posuere at, semper sollicitudin arcu.
            Fusce facilisis sem erat. Etiam vel augue sapien. Suspendisse
            potenti. Etiam aliquet semper nunc, in scelerisque nibh dapibus sit
            amet. Duis iaculis tempus magna sit amet posuere. Cras ac bibendum
            purus.
          </p>
          <p>
            Fusce non risus placerat, vestibulum metus non, varius tellus. Etiam
            quis augue vitae lorem dignissim condimentum at ac ante. Aliquam
            dignissim eros orci, nec aliquet arcu euismod in. Maecenas dictum
            dui a tristique fringilla. Aliquam dui turpis, congue vitae metus
            nec, cursus ornare lectus. Pellentesque interdum erat ac placerat
            volutpat. Nulla feugiat, ligula a lobortis rutrum, sem libero
            tristique nisi, quis aliquam ligula nisl id erat. Vestibulum quam
            diam, gravida vitae enim eu, ornare posuere nisi. Class aptent
            taciti sociosqu ad litora torquent per conubia nostra, per inceptos
            himenaeos. Ut luctus nibh justo, luctus luctus ligula suscipit sit
            amet.
          </p>
          <p>
            Proin at arcu nibh. Proin venenatis magna accumsan, bibendum augue
            adipiscing, facilisis lacus. Cras lectus urna, facilisis quis
            adipiscing non, blandit et arcu. Suspendisse sagittis adipiscing
            purus at convallis. Etiam consequat urna erat, at varius neque
            euismod quis. Pellentesque euismod urna quis sem faucibus
            pellentesque. Nam egestas, quam porta facilisis ultricies, velit
            nisi posuere sapien, quis facilisis lacus dolor id justo. Vestibulum
            mattis erat sed iaculis vulputate.
          </p>
          <p>
            Vestibulum tincidunt vestibulum turpis, in scelerisque nibh. Cras
            nunc metus, cursus in lectus eu, mollis adipiscing erat. Vivamus
            venenatis nibh quam, at posuere tortor rhoncus eu. Donec nunc
            tortor, dictum quis sagittis nec, imperdiet a turpis. Cras sodales
            ante mauris, eget tincidunt mauris ultricies in. Mauris hendrerit
            aliquam sem, at commodo orci volutpat vel. In dolor felis, congue
            vitae orci ut, mollis tristique diam. Praesent diam erat, pretium in
            ipsum non, cursus rutrum lectus. Ut vitae arcu eu neque porta
            egestas. Nam id nisl semper, tristique ligula vitae, interdum diam.
            Phasellus et nisi non nunc posuere rutrum. Praesent eu arcu quam.
            Fusce sed elit urna.
          </p>
          <p>(END OF TEXT)</p>
        </InertialScroller>
      </div>
    );
  }
}

render(<App />, document.getElementById('content'));
