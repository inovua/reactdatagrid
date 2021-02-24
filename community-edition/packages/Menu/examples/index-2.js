/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import { render } from 'react-dom';
import Component from '@inovua/react-class';

import Menu from '../src';
import './index.scss';

const items = [
  {
    label: 'country and style',
    name: 'selecte country',
    items: [
      { label: 'ro', name: 'country', value: 'ro' },
      { label: 'de', name: 'country', value: 'de' },
      { label: 'es', name: 'country', value: 'es' },
      { label: 'uk', name: 'country', value: 'uk' },
      { label: 'no input' },
      { label: 'bold', name: 'bold' },
      { label: 'italic', name: 'italic' },
      { label: 'strikethrough', name: 'strikethrough' },
    ],
  },
  {
    label: <strong>strong</strong>,
  },
];

const longListOfItemsWithStyle = [
  {
    label: 'Home',
    name: 'test col name',
  },
  {
    label: 'Shop',
    name: 'cool name',
  },
  {
    label: 'Shop',
    name: 'cool name',
  },
  '-',
  {
    label: 'Hello World',
    name: 'cool name',
    items: [
      {
        label: 'Product 1',
        items: [
          {
            label: 'Sub Product 1',
            disabled: true,
          },
          {
            label: 'Sub Product 2',
          },
          {
            label: 'Sub Product 3',
          },
          {
            label: 'Sub Product 4',
          },
        ],
      },
      {
        label: 'Product 2',
      },
      {
        label: 'Product 3',
      },
      {
        label: 'Product 4',
      },
    ],
  },
];

const PREVIEW_ICON = (
  <svg
    fill="#000000"
    height="24"
    viewBox="0 0 24 24"
    width="24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M0 0h24v24H0z" fill="none" />
    <path d="M11.5 9C10.12 9 9 10.12 9 11.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5S12.88 9 11.5 9zM20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-3.21 14.21l-2.91-2.91c-.69.44-1.51.7-2.39.7C9.01 16 7 13.99 7 11.5S9.01 7 11.5 7 16 9.01 16 11.5c0 .88-.26 1.69-.7 2.39l2.91 2.9-1.42 1.42z" />
  </svg>
);

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      checkState: {},
      selected: {
        country: 'ro',
        bold: 'bold',
        italic: 'italic',
      },
    };
  }

  render() {
    const onChange = event => {
      const value = event.target.value;
      const checked = event.target.checked;
      this.setState({
        checkState: {
          ...this.state.checkState,
          [value]: checked,
        },
      });
    };

    return (
      <div>
        <h3>submenustyle and item active style</h3>
        <Menu
          items={items}
          submenuStyle={{
            border: '1px solid red',
          }}
          itemActiveStyle={{
            background: 'pink',
            color: 'green',
          }}
        />

        <h3>items separated by titles</h3>
        <Menu
          items={[
            { isTitle: true, label: 'Country' },
            { label: 'ro', name: 'country', value: 'ro' },
            { label: 'de', name: 'country', value: 'de' },
            { label: 'es', name: 'country', value: 'es' },
            { label: 'uk', name: 'country', value: 'uk' },
            { isTitle: true, label: 'Style' },
            { label: 'bold', name: 'bold' },
            { label: 'italic', name: 'italic' },
            { label: 'strikethrough', name: 'strikethrough' },
          ]}
        />

        <h3>nested simple and multiple selection</h3>
        <Menu
          enableSelection
          defaultSelected={this.state.selected}
          dismissOnClick={false}
          items={[
            {
              label: 'country and style',
              name: 'selecte country',
              items: [
                { label: 'ro', name: 'country', value: 'ro' },
                { label: 'de', name: 'country', value: 'de' },
                { label: 'es', name: 'country', value: 'es' },
                { label: 'uk', name: 'country', value: 'uk' },
                { label: 'no input' },
                { label: 'bold', name: 'bold' },
                { label: 'italic', name: 'italic' },
                { label: 'strikethrough', name: 'strikethrough' },
              ],
            },
            {
              label: <strong>strong</strong>,
            },
          ]}
        />
        <h3>nested simple and multiple selection with input position end</h3>
        <Menu
          enableSelection
          defaultSelected={this.state.selected}
          dismissOnClick={false}
          selectionInputPosition={'end'}
          items={[
            {
              label: 'country and style',
              name: 'selecte country',
              items: [
                { label: 'ro', name: 'country', value: 'ro' },
                { label: 'de', name: 'country', value: 'de' },
                { label: 'es', name: 'country', value: 'es' },
                { label: 'uk', name: 'country', value: 'uk' },
                { label: 'no input' },
                { label: 'bold', name: 'bold' },
                { label: 'italic', name: 'italic' },
                { label: 'strikethrough', name: 'strikethrough' },
              ],
            },
            {
              label: 'hello world 2',
            },
          ]}
        />

        <h3>simple and multiple selection</h3>
        <Menu
          enableSelection
          selected={this.state.selected}
          onSelectionChange={newSelection => {
            this.setState({ selected: newSelection });
          }}
          items={[
            { label: 'ro', name: 'country', value: 'ro' },
            { label: 'de', name: 'country', value: 'de' },
            { label: 'es', name: 'country', value: 'es' },
            { label: 'uk', name: 'country', value: 'uk' },
            { label: 'no input' },
            { label: 'bold', name: 'bold' },
            { label: 'italic', name: 'italic' },
            { label: 'strikethrough', name: 'strikethrough' },
          ]}
        />

        <h3>menu with custom inputs inside submenu</h3>
        <Menu
          shadow={false}
          submenuAlignOffset={{ x: -10, y: 10 }}
          submenuMaxHeight={100}
          columns={['label', 'check']}
          items={[
            {
              label: 'Bold',
              items: [
                {
                  label: 'Bold',
                  dismissOnClick: false,
                  check: (
                    <input
                      type="checkbox"
                      checked={this.state.checkState['Bold'] || false}
                      value="Bold"
                      onChange={onChange}
                    />
                  ),
                },
                {
                  label: 'Italic',
                  dismissOnClick: false,
                  check: (
                    <input
                      type="checkbox"
                      checked={this.state.checkState['Italic'] || false}
                      value="Italic"
                      onChange={onChange}
                    />
                  ),
                },
                {
                  label: 'Underline',
                  dismissOnClick: false,
                  check: (
                    <input
                      type="checkbox"
                      checked={this.state.checkState['Underline'] || false}
                      value="Underline"
                      onChange={onChange}
                    />
                  ),
                },
                {
                  label: 'Strikethrough',
                  dismissOnClick: false,
                  check: (
                    <input
                      type="checkbox"
                      checked={this.state.checkState['Strikethrough'] || false}
                      value="Strikethrough"
                      onChange={onChange}
                    />
                  ),
                },
                {
                  label: 'Subscript',
                  dismissOnClick: false,
                  check: (
                    <input
                      type="checkbox"
                      checked={this.state.checkState['Subscript'] || false}
                      value="Subscript"
                      onChange={onChange}
                    />
                  ),
                },
                {
                  label: 'Superscript',
                  dismissOnClick: false,
                  check: (
                    <input
                      type="checkbox"
                      checked={this.state.checkState['Superscript'] || false}
                      value="Superscript"
                      onChange={onChange}
                    />
                  ),
                },
              ],
            },
            { label: 'Italic' },
            { label: 'Underline' },
            { label: 'Strikethrough' },
            { label: 'Subscript' },
            { label: 'Superscript' },
          ]}
        />
        <h3>meniu cu arrow scroll</h3>
        <Menu
          enableKeyboardNavigation
          maxHeight={190}
          submenuMaxHeight={175}
          columns={['icon', { name: 'label', colspan: 10 }]}
          items={[
            { label: 'home 1' },
            { label: 'home 2' },
            { label: 'home 3' },

            {
              label: 'New',
              icon: PREVIEW_ICON,
              items: [
                { label: 'Document', disabled: true },
                { label: 'Spreadsheet' },
                { label: 'Presentation' },
                { label: 'Form' },
                {
                  label: 'Drawing',
                  items: [
                    { label: 'Document', disabled: true },
                    { label: 'Spreadsheet', disabled: true },
                    {
                      label: 'Presentation',
                      disabled: true,
                      disabledStyle: { backgroundColor: 'red' },
                    },
                    { label: 'Form', disabled: true },
                    { label: 'Drawing' },
                  ],
                },
              ],
            },
            {
              label: 'Options',
              disabled: true,
              items: [
                { label: 'Preview', icon: PREVIEW_ICON },
                { label: 'Share' },
                { label: 'Make a copy' },
                { label: 'Download' },
              ],
            },
            {
              label: 'Format',
              items: [
                { label: 'Bold' },
                { label: 'Italic' },
                { label: 'Underline' },
                { label: 'Strikethrough' },
                { label: 'Subscript' },
                { label: 'Superscript' },
                '-',
                { label: 'Clear Formatting' },
              ],
            },
            { label: 'Save' },
            '-',
            {
              label: 'Export as',
              items: [
                { label: 'Text document' },
                { label: 'PDF' },
                { label: 'Open document text' },
                { label: 'Rich text' },
              ],
            },
          ]}
        />
        <h3>Complex menu with default theme</h3>
        <Menu
          enableKeyboardNavigation
          columns={['icon', { name: 'label', colspan: 10 }]}
          items={[
            { label: 'home 1' },
            { label: 'home 2' },
            { label: 'home 3' },

            {
              label: 'New',
              icon: PREVIEW_ICON,
              items: [
                { label: 'Document', disabled: true },
                { label: 'Spreadsheet' },
                { label: 'Presentation' },
                { label: 'Form' },
                {
                  label: 'Drawing',
                  items: [
                    { label: 'Document', disabled: true },
                    { label: 'Spreadsheet', disabled: true },
                    {
                      label: 'Presentation',
                      disabled: true,
                      disabledStyle: { backgroundColor: 'red' },
                    },
                    { label: 'Form', disabled: true },
                    { label: 'Drawing' },
                  ],
                },
              ],
            },
            {
              label: 'Options',
              disabled: true,
              items: [
                { label: 'Preview', icon: PREVIEW_ICON },
                { label: 'Share' },
                { label: 'Make a copy' },
                { label: 'Download' },
              ],
            },
            {
              label: 'Format',
              items: [
                { label: 'Bold' },
                { label: 'Italic' },
                { label: 'Underline' },
                { label: 'Strikethrough' },
                { label: 'Subscript' },
                { label: 'Superscript' },
                '-',
                { label: 'Clear Formatting' },
              ],
            },
            { label: 'Save' },
            '-',
            {
              label: 'Export as',
              items: [
                { label: 'Text document' },
                { label: 'PDF' },
                { label: 'Open document text' },
                { label: 'Rich text' },
              ],
            },
            { label: 'Document' },
          ]}
        />
        <h2>without shadow</h2>
        <Menu
          shadow={false}
          items={[
            { label: 'Bold' },
            { label: 'Italic' },
            { label: 'Underline' },
            { label: 'Strikethrough' },
            { label: 'Subscript' },
            { label: 'Superscript' },
          ]}
        />
        <h2>offset {'x: -10, y: 10'} </h2>
        <Menu
          shadow={false}
          submenuAlignOffset={{ x: -10, y: 10 }}
          items={[
            {
              label: 'Bold',
              items: [
                { label: 'Bold' },
                { label: 'Italic' },
                { label: 'Underline' },
                { label: 'Strikethrough' },
                { label: 'Subscript' },
                { label: 'Superscript' },
              ],
            },
            { label: 'Italic' },
            { label: 'Underline' },
            { label: 'Strikethrough' },
            { label: 'Subscript' },
            { label: 'Superscript' },
          ]}
        />
        <h2>Animation enabled </h2>
        <Menu
          enableAnimation
          items={[
            { label: 'home 1' },
            { label: 'home 2' },
            { label: 'home 3' },

            {
              label: 'New',
              icon: PREVIEW_ICON,
              items: [
                { label: 'Document', disabled: true },
                { label: 'Spreadsheet' },
                { label: 'Presentation' },
                { label: 'Form' },
                {
                  label: 'Drawing',
                  items: [
                    { label: 'Document', disabled: true },
                    { label: 'Spreadsheet', disabled: true },
                    {
                      label: 'Presentation',
                      disabled: true,
                      disabledStyle: { backgroundColor: 'red' },
                    },
                    { label: 'Form', disabled: true },
                    { label: 'Drawing' },
                  ],
                },
              ],
            },
            {
              label: 'Options',
              disabled: true,
              items: [
                { label: 'Preview', icon: PREVIEW_ICON },
                { label: 'Share' },
                { label: 'Make a copy' },
                { label: 'Download' },
              ],
            },
            {
              label: 'Format',
              items: [
                { label: 'Bold' },
                { label: 'Italic' },
                { label: 'Underline' },
                { label: 'Strikethrough' },
                { label: 'Subscript' },
                { label: 'Superscript' },
                '-',
                { label: 'Clear Formatting' },
              ],
            },
            { label: 'Save' },
            '-',
            {
              label: 'Export as',
              items: [
                { label: 'Text document' },
                { label: 'PDF' },
                { label: 'Open document text' },
                { label: 'Rich text' },
              ],
            },
          ]}
        />
        <h2>Animation duration 1000ms </h2>
        <Menu
          enableAnimation
          fadeDuration={1000}
          items={[
            {
              label: 'Bold',
              items: [
                { label: 'Bold' },
                { label: 'Italic' },
                { label: 'Underline' },
                { label: 'Strikethrough' },
                { label: 'Subscript' },
                { label: 'Superscript' },
              ],
            },
            { label: 'Italic' },
            { label: 'Underline' },
            { label: 'Strikethrough' },
            { label: 'Subscript' },
            { label: 'Superscript' },
          ]}
        />
        <h2>show delay 300ms</h2>
        <Menu
          showSubmenuDelay={300}
          items={[
            {
              label: 'Bold',
              items: [
                { label: 'Bold' },
                { label: 'Italic' },
                { label: 'Underline' },
                { label: 'Strikethrough' },
                { label: 'Subscript' },
                { label: 'Superscript' },
              ],
            },
            { label: 'Italic' },
            { label: 'Underline' },
            {
              label: 'Bold',
              items: [
                { label: 'Bold' },
                { label: 'Italic' },
                { label: 'Underline' },
                { label: 'Strikethrough' },
                { label: 'Subscript' },
                { label: 'Superscript' },
              ],
            },
            { label: 'Subscript' },
            { label: 'Superscript' },
          ]}
        />
        <h2>hide delay 300ms</h2>
        <Menu
          hideSubmenuDelay={300}
          items={[
            {
              label: 'Bold',
              items: [
                { label: 'Bold' },
                { label: 'Italic' },
                { label: 'Underline' },
                { label: 'Strikethrough' },
                { label: 'Subscript' },
                { label: 'Superscript' },
              ],
            },
            { label: 'Italic' },
            { label: 'Underline' },
            {
              label: 'Bold',
              items: [
                { label: 'Bold' },
                { label: 'Italic' },
                { label: 'Underline' },
                { label: 'Strikethrough' },
                { label: 'Subscript' },
                { label: 'Superscript' },
              ],
            },
            { label: 'Subscript' },
            { label: 'Superscript' },
          ]}
        />

        <h2>Context menu</h2>
        <div
          id="constrainTo"
          style={{
            maxWidth: 300,
            minWidth: 300,
            marginRight: 30,
            border: '1px dashed blue',
            position: 'relative',
            height: 400,
          }}
          onContextMenu={this.onContextMenu}
        >
          <strong>context menu with animation</strong>
          {this.state.menuAlignTo && (
            <Menu
              enableRootAnimation
              autoFocus
              onDismiss={() => {
                this.setState({
                  menuAlignTo: null,
                });
              }}
              alignOffset={[3, { x: 5, y: 30 }, 1]}
              style={{ position: 'fixed' }}
              alignTo={{
                left: this.state.menuAlignTo.left,
                top: this.state.menuAlignTo.top,
                height: 1,
                width: 1,
              }}
              enableAnimation={true}
              constrainTo={'#constrainTo'}
              alignPositions={['tl-c', 'bl-c', 'br-c']}
              items={longListOfItemsWithStyle}
            />
          )}
        </div>
      </div>
    );
  }

  onContextMenu(event) {
    event.preventDefault();

    this.setState({
      menuAlignTo: {
        left: event.clientX,
        top: event.clientY,
        width: 1,
        height: 1,
      },
    });
  }

  handleChildClick() {
    console.log('child clicked!');
  }

  handleClick(itemProps) {
    console.log('clicked !!!', arguments);
  }
}

render(<App />, document.getElementById('content'));
