/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { findDOMNode } from 'react-dom';
import DataGrid from '../../../../../src';
import { render, wait } from '../../../../testUtils';
import '../../../../../style/index.scss';

const HEADER_GROUP_SELECTOR = '.InovuaReactDataGrid__header-group';

const THE_GRID = (
  <DataGrid
    dataSource={[]}
    idProperty="id"
    columnDefaultWidth={100}
    groups={[
      { name: 'height', group: 'personal info' },
      { name: 'weight', group: 'personal info' },
      { name: 'location' },
      { name: 'street', group: 'location' },
      { name: 'personal info' },
    ]}
    columns={[
      { name: 'height inch', group: 'height' },
      { name: 'height cm', group: 'height' },
      { name: 'weight cm', group: 'weight' },
      { name: 'weight inch', group: 'weight' },
      { name: 'street no', group: 'street' },
      { name: 'id', width: 200 },
      { name: 'street name', group: 'street' },
      {
        name: 'city',
        sortable: false,
        headerAlign: 'end',
        group: 'location',
        header: <span data-id="city">City</span>,
      },
    ]}
  />
);

const toJSON = function() {
  return JSON.stringify(this);
};

const getRect = node => {
  const rect = node.getBoundingClientRect();

  return {
    top: rect.top,
    left: rect.left,
    bottom: rect.bottom,
    right: rect.right,
    width: rect.width,
    height: rect.height,
    toString: toJSON,
  };
};

describe('DataGrid.headerHeight', () => {
  it('headerHeight: 80, virtualizeColumns: true & resizable: true should render column headers in correct positions', () => {
    const gridInstance = render(
      <DataGrid
        virtualizeColumns
        columnDefaultWidth={200}
        headerHeight={80}
        columns={[
          { name: 'firstName' },
          { name: 'lastName' },
          { name: 'email' },
          { name: 'age' },
          { name: 'username' },
          { name: 'password' },
        ]}
        idProperty="username"
        dataSource={[]}
      />
    );

    return wait().then(() => {
      const node = findDOMNode(gridInstance);
      const resizeWrapperNodes = [
        ...node.querySelectorAll(
          '.InovuaReactDataGrid__column-header__resize-wrapper'
        ),
      ];

      expect(resizeWrapperNodes.length).to.equal(6);

      const children = resizeWrapperNodes.map(n => n.firstChild);

      const wrapperRects = resizeWrapperNodes
        .map(getRect)
        .map((rect, index) => {
          if (index) {
            rect.left += 1;
            rect.width -= 1;
          }

          return rect;
        })
        .toString();

      const childrenRects = children.map(getRect).toString();

      expect(wrapperRects).to.eql(childrenRects);
      expect(getRect(resizeWrapperNodes[0]).height).to.eql(80);

      gridInstance.unmount();
    });
  });
});

describe('DataGrid resizable header', () => {
  it('should render all groups as resizable', done => {
    const gridInstance = render(
      <DataGrid
        dataSource={[]}
        idProperty="id"
        columnDefaultWidth={100}
        groups={[
          { name: 'height', group: 'personal info' },
          { name: 'weight', group: 'personal info' },
          { name: 'location', resizable: true },
          { name: 'street', group: 'location' },
          { name: 'personal info' },
        ]}
        columns={[
          { name: 'height inch', group: 'height' },
          { name: 'height cm', group: 'height' },
          { name: 'weight cm', group: 'weight' },
          { name: 'weight inch', group: 'weight' },
          { name: 'street no', group: 'street' },
          { name: 'id', width: 200 },
          { name: 'street name', group: 'street' },
          {
            name: 'city',
            sortable: false,
            headerAlign: 'end',
            group: 'location',
            header: <span data-id="city">City</span>,
          },
        ]}
      />
    );

    setTimeout(() => {
      const groupResizers = [
        ...findDOMNode(gridInstance).querySelectorAll(
          '.InovuaReactDataGrid__header-group-resizer'
        ),
      ];
      expect(groupResizers.length).to.equal(7);
      gridInstance.unmount();
      done();
    }, 20);
  });

  it('should respect groups.resizable: false attr', done => {
    const gridInstance = render(
      <DataGrid
        dataSource={[]}
        idProperty="id"
        columnDefaultWidth={100}
        groups={[
          { name: 'height', group: 'personal info' },
          { name: 'weight', group: 'personal info' },
          { name: 'location', resizable: false },
          { name: 'street', group: 'location' },
          { name: 'personal info' },
        ]}
        columns={[
          { name: 'height inch', group: 'height' },
          { name: 'height cm', group: 'height' },
          { name: 'weight cm', group: 'weight' },
          { name: 'weight inch', group: 'weight' },
          { name: 'street no', group: 'street' },
          { name: 'id', width: 200 },
          { name: 'street name', group: 'street' },
          {
            name: 'city',
            sortable: false,
            headerAlign: 'end',
            group: 'location',
            header: <span data-id="city">City</span>,
          },
        ]}
      />
    );

    setTimeout(() => {
      const groupResizers = [
        ...findDOMNode(gridInstance).querySelectorAll(
          '.InovuaReactDataGrid__header-group-resizer'
        ),
      ];
      expect(groupResizers.length).to.equal(5);
      gridInstance.unmount();
      done();
    }, 20);
  });

  it('should respect DataGrid.props.resizable = false', done => {
    const gridInstance = render(
      <DataGrid
        dataSource={[]}
        resizable={false}
        idProperty="id"
        columnDefaultWidth={100}
        groups={[
          { name: 'height', group: 'personal info' },
          { name: 'weight', group: 'personal info' },
          { name: 'location', resizable: true },
          { name: 'street', group: 'location' },
          { name: 'personal info' },
        ]}
        columns={[
          { name: 'height inch', group: 'height' },
          { name: 'height cm', group: 'height' },
          { name: 'weight cm', group: 'weight' },
          { name: 'weight inch', group: 'weight' },
          { name: 'street no', group: 'street' },
          { name: 'id', width: 200 },
          { name: 'street name', group: 'street' },
          {
            name: 'city',
            sortable: false,
            headerAlign: 'end',
            group: 'location',
            header: <span data-id="city">City</span>,
          },
        ]}
      />
    );

    setTimeout(() => {
      const groupResizers = [
        ...findDOMNode(gridInstance).querySelectorAll(
          '.InovuaReactDataGrid__header-group-resizer'
        ),
      ];
      expect(groupResizers.length).to.equal(2);
      // since the location group is split in two places
      gridInstance.unmount();
      done();
    }, 20);
  });
});
describe('DataGrid grouped column headers', () => {
  it('should be displayed in correct positions', done => {
    const gridInstance = render(THE_GRID);
    /**
     *  Personal Info                                     | Location  |    | Location           |
     *  Height                  | Weight                  | Street    |    | Street      |      |
     *  Height inch | Height cm | Weight cm | Weight inch | Street no | Id | Street name | City |
     */
    setTimeout(() => {
      const headerNode = findDOMNode(gridInstance).querySelector(
        `.InovuaReactDataGrid__header`
      );

      const topLevelGroups = [...headerNode.children];
      expect(topLevelGroups.length).to.equal(4);
      // personal info, location, id, location
      const gridRect = headerNode.getBoundingClientRect();
      const [
        personalInfoGroup,
        locationGroup,
        idGroup,
        secondLocationGroup,
      ] = topLevelGroups;
      const [
        personalInfoRect,
        locationRect,
        idRect,
        secondLocationRect,
      ] = topLevelGroups.map(g => g.getBoundingClientRect());

      // --------------- PERSONAL INFO -----------
      // expect personal info to contain two other groups - height and weight
      expect(
        personalInfoGroup.querySelectorAll(HEADER_GROUP_SELECTOR).length
      ).to.equal(2);

      // expect personal info to contain four actual columns - height inch & cm and weight inch & cm
      expect(
        personalInfoGroup.querySelectorAll(
          '.InovuaReactDataGrid__column-header'
        ).length
      ).to.equal(4);

      expect(personalInfoRect.left - gridRect.left).to.equal(0);
      expect(personalInfoRect.width).to.equal(400);

      // --------------- LOCATION -----------
      // expect location to contain one group - street
      expect(
        locationGroup.querySelectorAll(HEADER_GROUP_SELECTOR).length
      ).to.equal(1);
      // expect location to contain 1 actual column - street no
      expect(
        personalInfoGroup.querySelectorAll(
          '.InovuaReactDataGrid__column-header'
        ).length
      ).to.equal(4);

      expect(locationRect.left - gridRect.left).to.equal(400);
      // since there are 4 columns in the first group
      // each with width 100
      // --------------- ID -----------
      expect(idRect.left - gridRect.left).to.equal(500);

      // --------------- SECOND LOCATION -----------
      expect(secondLocationRect.left - gridRect.left).to.equal(700);

      gridInstance.unmount();
      done();
    }, 30);
  });

  it('should render with correct nesting & innerText', done => {
    const gridInstance = render(THE_GRID);
    /**
     *  Personal Info                                     | Location  |    | Location           |
     *  Height                  | Weight                  | Street    |    | Street      |      |
     *  Height inch | Height cm | Weight cm | Weight inch | Street no | Id | Street name | City |
     */
    setTimeout(() => {
      const headerNode = findDOMNode(gridInstance).querySelector(
        `.InovuaReactDataGrid__header`
      );

      const topLevelGroups = [...headerNode.children];
      expect(topLevelGroups.length).to.equal(4);
      // personal info, location, id, location
      const [
        personalInfoGroup,
        locationGroup,
        idGroup,
        secondLocationGroup,
      ] = topLevelGroups;

      const [heightGroup, weightGroup] = [
        ...personalInfoGroup.querySelector(`${HEADER_GROUP_SELECTOR}-cells`)
          .children,
      ];

      expect(heightGroup.innerText).to.equal(
        `Height
Height inch
Height cm
`
      );

      expect(weightGroup.innerText).to.equal(
        `Weight
Weight cm
Weight inch
`
      );

      expect(locationGroup.innerText).to.equal(
        `Location
Street
Street no
`
      );

      expect(idGroup.innerText).to.equal(
        `Id
`
      );

      expect(secondLocationGroup.innerText).to.equal(
        `Location
Street
Street name
City
`
      );
      const cityHeader = secondLocationGroup.querySelector('[data-id="city"]');
      expect(cityHeader.innerText).to.equal('City');

      expect(
        // default border
        cityHeader.parentNode.parentNode.getBoundingClientRect().right + 1
      ).to.equal(secondLocationGroup.getBoundingClientRect().right);

      gridInstance.unmount();
      done();
    }, 30);
  });

  it('should display correct configuration, with groupBy + hideGroupByColumns=false', done => {
    const gridInstance = render(
      <DataGrid
        dataSource={[]}
        idProperty="id"
        columnDefaultWidth={100}
        groups={[
          { name: 'height', group: 'personal info' },
          { name: 'weight', group: 'personal info' },
          { name: 'location', xresizable: false },
          { name: 'street', group: 'location' },
          { name: 'personal info' },
        ]}
        groupBy={['city']}
        hideGroupByColumns={false}
        columns={[
          { name: 'height inch', group: 'height', defaultLocked: true },
          { name: 'height cm', group: 'height', defaultLocked: true },
          { name: 'street name', group: 'street' },
          {
            name: 'city',
            defaultLocked: 'end',
            sortable: false,
            headerAlign: 'end',
            group: 'location',
            header: <span data-id="city">City</span>,
          },
        ]}
      />
    );

    setTimeout(() => {
      const simpleColumnHeaders = findDOMNode(gridInstance).querySelectorAll(
        '.InovuaReactDataGrid__column-header'
      );
      expect(simpleColumnHeaders.length).to.equal(5);

      gridInstance.unmount();
      done();
    }, 20);
  });

  /**
   * We want to make sure that `groupBy` does not add another column to the unlocked section
   */
  it('should display correct configuration, with groupBy + hideGroupByColumns=true', done => {
    const gridInstance = render(
      <DataGrid
        dataSource={[]}
        idProperty="id"
        columnDefaultWidth={100}
        groups={[
          { name: 'height', group: 'personal info' },
          { name: 'weight', group: 'personal info' },
          { name: 'location', xresizable: false },
          { name: 'street', group: 'location' },
          { name: 'personal info' },
        ]}
        groupBy={['city']}
        hideGroupByColumns
        columns={[
          { name: 'height inch', group: 'height', defaultLocked: true },
          { name: 'height cm', group: 'height', defaultLocked: true },
          { name: 'street name', group: 'street' },
          {
            name: 'city',
            defaultLocked: 'end',
            sortable: false,
            headerAlign: 'end',
            group: 'location',
            header: <span data-id="city">City</span>,
          },
        ]}
      />
    );

    setTimeout(() => {
      const simpleColumnHeaders = findDOMNode(gridInstance).querySelectorAll(
        '.InovuaReactDataGrid__column-header'
      );
      expect(simpleColumnHeaders.length).to.equal(4);

      gridInstance.unmount();
      done();
    }, 20);
  });

  it('should dispay correct configuration', done => {
    const gridInstance = render(
      <DataGrid
        columnDefaultWidth={200}
        columns={[
          { name: 'id' },
          { name: 'firstName', group: 'personal info' },
          { name: 'lastName', group: 'personal info' },
          { name: 'birthDate', group: 'personal info' },
          { name: 'index', group: 'other' },
          { name: 'grade', group: 'other' },
          { name: 'age' },
          { name: 'email', group: 'info' },
        ]}
        hideGroupByColumns={false}
        idProperty="id"
        groups={[
          { name: 'misc' },
          { name: 'personal info', group: 'info' },
          { name: 'info', group: 'misc' },
          { name: 'other' },
        ]}
        dataSource={[]}
      />
    );
    /**
     *     |             misc                    |      other     |      |  misc |
     *     |_____________________________________|________________|      |_______|
     *     |             info                    |                |      |  info |
     *     |_____________________________________|                |      |_______|
     *     |          personal info              |                |      |       |
     *     |_____________________________________|                |      |       |
     *  Id | first name | last name | birth date |  index | grade |  age | email |
     */
    const findTitle = node =>
      node.querySelector('.InovuaReactDataGrid__header-group__title');
    const findCells = node =>
      node.querySelector(`${HEADER_GROUP_SELECTOR}-cells`);

    setTimeout(() => {
      const headerNode = findDOMNode(gridInstance).querySelector(
        '.InovuaReactDataGrid__header'
      );

      const topLevelGroups = [...headerNode.children];
      expect(topLevelGroups.length).to.equal(5);
      // id, misc, other, age, misc
      const [
        idGroup,
        misc1Group,
        otherGroup,
        ageGroup,
        misc2Group,
      ] = topLevelGroups;

      expect(idGroup.innerText).to.equal(
        `Id
`
      );
      expect(findTitle(misc1Group).innerText).to.equal(`Misc`);
      expect(findTitle(otherGroup).innerText).to.equal(`Other`);
      expect(ageGroup.innerText).to.equal(
        `Age
`
      );
      expect(findTitle(misc2Group).innerText).to.equal(`Misc`);

      const misc1Info = findCells(misc1Group);
      expect(findTitle(misc1Info).innerText).to.equal(`Info`);

      const personalInfo = findCells(misc1Info);
      expect(findTitle(personalInfo).innerText).to.equal(`Personal info`);

      const personalInfoCells = findCells(personalInfo);
      expect(personalInfoCells.innerText.split('\n').join('|')).to.equal(
        `First name|Last name|Birth date|`
      );

      const info2 = findCells(misc2Group);
      expect(findTitle(info2).innerText).to.equal('Info');

      const emailCell = findCells(info2);
      expect(emailCell.innerText).to.equal(
        `Email
`
      );
      gridInstance.unmount();
      done();
    }, 30);
  });
});
