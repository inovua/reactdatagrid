/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { mount } from 'enzyme';
import Value from '../Value';
import Tag from '../Tag';

describe('Value', () => {
  describe('render tag', () => {
    it('renderTag overwrites the tag render', () => {
      const wrapper = mount(
        <Value
          multiple
          value={['world']}
          items={[{ label: 'hello', id: 'world' }]}
        />
      );
      expect(wrapper.find(Tag)).toHaveLength(1);

      wrapper.setProps({
        renderTag: ({ domProps }) => <div key={domProps.key} id="helloWorld" />,
      });

      expect(wrapper.find(Tag)).toHaveLength(1);
      expect(wrapper.find('#helloWorld')).toHaveLength(1);
    });
    it('renderTag can mutate props that are applied on Tag', () => {
      const wrapper = mount(
        <Value
          multiple
          value={['world']}
          items={[{ label: 'hello', id: 'world' }]}
          renderTag={({ domProps }) => {
            domProps.id = 'mutatedId';
          }}
        />
      );
      expect(wrapper.find(Tag)).toHaveLength(1);
      expect(wrapper.find('#mutatedId')).toHaveLength(1);
    });
  });

  describe('renderTags', () => {
    it('overwrites render tags', () => {
      const wrapper = mount(
        <Value
          multiple
          value={['world']}
          items={[{ label: 'hello', id: 'world' }]}
          renderTags={({ tags }) => <div id="customTags" children={tags} />}
        />
      );
      expect(wrapper.find('#customTags')).toHaveLength(1);
      expect(wrapper.find(Tag)).toHaveLength(1);
    });
  });

  describe('renderRemainingTags', () => {
    it('overwrites combined tag render', () => {
      const wrapper = mount(
        <Value
          multiple
          value={['world']}
          renderRemainingTags={({ domProps }) => (
            <div key={domProps.key} id="customRemainigTag" />
          )}
          groupedItems={{
            visibleItems: [
              { label: 'hello', id: 'world' },
              { label: 'hello', id: 'world1' },
            ],
            remainingItems: [{ label: 'hello', id: 'world2' }],
          }}
        />
      );
      expect(wrapper.find(Tag)).toHaveLength(2);
      expect(wrapper.find('#customRemainigTag')).toHaveLength(1);
    });
  });

  xdescribe('renderDisplayValue', () => {
    it('renders custom display value', () => {
      const wrapper = mount(
        <Value
          multiple={false}
          focus={false}
          label={'hello world'}
          renderDisplayValue={() => {
            return <div id="customDisplayValue" />;
          }}
        />
      );
      expect(wrapper.find('#customDisplayValue')).toHaveLength(1);
    });
    it('mutated props are added on default implementation', () => {
      const wrapper = mount(
        <Value
          multiple={false}
          focus={false}
          label={'hello world'}
          renderDisplayValue={({ domProps }) => {
            domProps.id = 'customDisplayValue';
          }}
        />
      );
      expect(wrapper.find('#customDisplayValue')).toHaveLength(1);
    });
  });
});
