/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';

import DataGrid from '..';
import { render } from '../testUtils';
import '../../style/index.scss';

import sorty from '@inovua/sorty';

import getSortIcons from './utils/getSortIcons';

import wait from './utils/wait';

describe('controlled props', () => {
  describe('- sortInfo change', () => {
    it('should call dataSource fn and correctly set header sort icon', done => {
      const columns = [
        { name: 'id', type: 'number' },
        { name: 'name', width: 200 },
        { name: 'city', width: 200 },
      ];

      const data = [
        {
          name: 'marry',
          id: 2,
          city: 'paris',
        },
        {
          name: 'john',
          id: 1,
          city: 'london',
        },
        {
          name: 'bob',
          id: 3,
          city: 'liverpool',
        },
      ];

      let lastSortInfo;

      const dataSource = ({ sortInfo }) => {
        lastSortInfo = sortInfo;
        return new Promise(resolve => {
          setTimeout(() => {
            let arr = [...data];
            arr = sortInfo ? sorty(sortInfo, arr) : arr;

            resolve(arr);
          }, 100);
        });
      };

      let gridInstance;

      const onInitialDataLoad = () => {
        expect([1, 0, 0]).to.deep.equal(getSortIcons(gridInstance));

        expect(lastSortInfo.name).to.equal('id');
        expect(lastSortInfo.dir).to.equal(1);

        gridInstance.setProps({
          sortInfo: { name: 'city', dir: -1 },
          onDataSourceResponse: () => {
            setTimeout(() => {
              const sortIcons = getSortIcons(gridInstance);
              expect([0, 0, -1]).to.deep.equal(sortIcons);

              expect(lastSortInfo.name).to.equal('city');
              expect(lastSortInfo.dir).to.equal(-1);

              gridInstance.unmount();
              done();
            }, 150);
          },
        });
      };

      gridInstance = render(
        <DataGrid
          dataSource={dataSource}
          sortInfo={{ name: 'id', dir: 1 }}
          columns={columns}
          idProperty="id"
          onDataSourceResponse={() => {
            setTimeout(onInitialDataLoad, 50);
          }}
        />
      );
    });
  });
});
