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
import { render, simulateMouseEvent } from '../testUtils';
import '../../style/index.scss';

import sorty from '@inovua/sorty';

import findRows from './utils/findRows';
import findCells from './utils/findCells';
import findHeaderCells from './utils/findHeaderCells';
import getSortIcons from './utils/getSortIcons';
import wait from './utils/wait';

const getTextContent = grid => {
  return findRows(grid).map(r =>
    findCells(r)
      .map(findDOMNode)
      .map(c => c.textContent)
  );
};

describe('sort behavior', () => {
  describe('defaultSortInfo', () => {
    it('should render sorted grid when dataSource is array', () => {
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

      const gridInstance = render(
        <DataGrid
          dataSource={data}
          defaultSortInfo={{ name: 'id', dir: -1 }}
          columns={columns}
          idProperty="id"
        />
      );

      return wait().then(() => {
        const texts = getTextContent(gridInstance);

        expect(texts).to.deep.equal([
          ['3', 'bob', 'liverpool'],
          ['2', 'marry', 'paris'],
          ['1', 'john', 'london'],
        ]);

        expect([-1, 0, 0]).to.deep.equal(getSortIcons(gridInstance));
        gridInstance.unmount();
      });
    });

    it('should render sorted grid and then unsort on header click', () => {
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

      const gridInstance = render(
        <DataGrid
          dataSource={data}
          defaultSortInfo={{ name: 'id', dir: -1 }}
          columns={columns}
          idProperty="id"
        />
      );

      return wait()
        .then(() => {
          const texts = getTextContent(gridInstance);

          expect(texts).to.deep.equal([
            ['3', 'bob', 'liverpool'],
            ['2', 'marry', 'paris'],
            ['1', 'john', 'london'],
          ]);

          expect([-1, 0, 0]).to.deep.equal(getSortIcons(gridInstance));

          const idHeader = findHeaderCells(gridInstance).map(findDOMNode)[0];
          simulateMouseEvent('click', idHeader.firstChild);

          gridInstance.setProps({});

          return wait();
        })
        .then(() => {
          expect(getTextContent(gridInstance)).to.deep.equal([
            ['2', 'marry', 'paris'],
            ['1', 'john', 'london'],
            ['3', 'bob', 'liverpool'],
          ]);
          expect([0, 0, 0]).to.deep.equal(getSortIcons(gridInstance));
          gridInstance.unmount();
        });
    });

    it('should render sorted grid - when allowUnsort is false, it should not allow unsorted state', () => {
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

      const gridInstance = render(
        <DataGrid
          dataSource={data}
          defaultSortInfo={{ name: 'id', dir: -1 }}
          columns={columns}
          allowUnsort={false}
          idProperty="id"
        />
      );

      return wait()
        .then(() => {
          const texts = getTextContent(gridInstance);

          expect(texts).to.deep.equal([
            ['3', 'bob', 'liverpool'],
            ['2', 'marry', 'paris'],
            ['1', 'john', 'london'],
          ]);

          expect([-1, 0, 0]).to.deep.equal(getSortIcons(gridInstance));

          const idHeader = findHeaderCells(gridInstance).map(findDOMNode)[0];
          simulateMouseEvent('click', idHeader.firstChild);

          gridInstance.setProps({});

          return wait();
        })
        .then(() => {
          expect(getTextContent(gridInstance)).to.deep.equal([
            ['1', 'john', 'london'],
            ['2', 'marry', 'paris'],
            ['3', 'bob', 'liverpool'],
          ]);
          expect([1, 0, 0]).to.deep.equal(getSortIcons(gridInstance));
          gridInstance.unmount();
        });
    });

    it('should render sorted grid - when allowUnsort is false, it should not allow unsorted state when dataSource is Fn->Promise', () => {
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

      const gridInstance = render(
        <DataGrid
          dataSource={({ sortInfo }) => {
            return new Promise(resolve => {
              setTimeout(() => resolve(sorty(sortInfo, data)), 10);
            });
          }}
          defaultSortInfo={{ name: 'id', dir: -1 }}
          columns={columns}
          allowUnsort={false}
          idProperty="id"
        />
      );

      return wait()
        .then(() => {
          const texts = getTextContent(gridInstance);

          expect(texts).to.deep.equal([
            ['3', 'bob', 'liverpool'],
            ['2', 'marry', 'paris'],
            ['1', 'john', 'london'],
          ]);

          expect([-1, 0, 0]).to.deep.equal(getSortIcons(gridInstance));

          const idHeader = findHeaderCells(gridInstance).map(findDOMNode)[0];
          simulateMouseEvent('click', idHeader.firstChild);

          gridInstance.setProps({});

          return wait();
        })
        .then(() => {
          expect(getTextContent(gridInstance)).to.deep.equal([
            ['1', 'john', 'london'],
            ['2', 'marry', 'paris'],
            ['3', 'bob', 'liverpool'],
          ]);
          expect([1, 0, 0]).to.deep.equal(getSortIcons(gridInstance));
          gridInstance.unmount();
        });
    });
  });

  describe('sortInfo', () => {
    it('should NOT render sorted grid when dataSource is array', () => {
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

      const gridInstance = render(
        <DataGrid
          dataSource={data}
          sortInfo={{ name: 'id', dir: -1 }}
          columns={columns}
          idProperty="id"
        />
      );

      return wait().then(() => {
        const texts = getTextContent(gridInstance);

        expect(texts).to.deep.equal([
          ['2', 'marry', 'paris'],
          ['1', 'john', 'london'],
          ['3', 'bob', 'liverpool'],
        ]);

        expect([-1, 0, 0]).to.deep.equal(getSortIcons(gridInstance));
        gridInstance.unmount();
      });
    });

    it('should render sorted grid when dataSource is function that returns an array', () => {
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

      const gridInstance = render(
        <DataGrid
          dataSource={({ sortInfo }) => sorty(sortInfo, data)}
          sortInfo={{ name: 'id', dir: -1 }}
          columns={columns}
          idProperty="id"
        />
      );

      return wait()
        .then(() => {
          expect(getTextContent(gridInstance)).to.deep.equal([
            ['3', 'bob', 'liverpool'],
            ['2', 'marry', 'paris'],
            ['1', 'john', 'london'],
          ]);

          expect([-1, 0, 0]).to.deep.equal(getSortIcons(gridInstance));

          gridInstance.setProps({
            sortInfo: { name: 'name', dir: 1 },
          });

          return wait();
        })
        .then(() => {
          expect(getTextContent(gridInstance)).to.deep.equal([
            ['3', 'bob', 'liverpool'],
            ['1', 'john', 'london'],
            ['2', 'marry', 'paris'],
          ]);

          expect([0, 1, 0]).to.deep.equal(getSortIcons(gridInstance));
          gridInstance.unmount();
        });
    });

    it('should render sorted grid when dataSource is function that returns a Promise', () => {
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

      const gridInstance = render(
        <DataGrid
          dataSource={({ sortInfo }) =>
            new Promise(resolve => {
              resolve(sorty(sortInfo, data));
            })
          }
          sortInfo={{ name: 'id', dir: -1 }}
          columns={columns}
          idProperty="id"
        />
      );

      return wait()
        .then(() => {
          expect(getTextContent(gridInstance)).to.deep.equal([
            ['3', 'bob', 'liverpool'],
            ['2', 'marry', 'paris'],
            ['1', 'john', 'london'],
          ]);

          expect([-1, 0, 0]).to.deep.equal(getSortIcons(gridInstance));
          gridInstance.setProps({
            sortInfo: { name: 'name', dir: 1 },
          });

          return wait();
        })
        .then(() => {
          expect(getTextContent(gridInstance)).to.deep.equal([
            ['3', 'bob', 'liverpool'],
            ['1', 'john', 'london'],
            ['2', 'marry', 'paris'],
          ]);

          expect([0, 1, 0]).to.deep.equal(getSortIcons(gridInstance));
          gridInstance.unmount();
        });
    });
  });
});
