/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React from 'react';
import selectParent from '../packages/select-parent';

import DateField from '../packages/Calendar/DateInput';

const stopPropagation = e => e.stopPropagation();

export default class DateEditor extends React.Component {
  constructor(props) {
    super(props);

    this.domRef = React.createRef();
    this.state = {
      position: 'bottom',
      expanded: false,
    };

    this.onExpandChange = this.onExpandChange.bind(this);
  }

  componentDidMount() {
    this.domNode = this.domRef.current;
    this.constrainToNode = selectParent('.InovuaReactDataGrid', this.domNode);
  }

  UNSAFE_componentWillMount() {
    const { cell } = this.props;

    const cellNode =
      cell && cell.getDOMNode() ? cell.getDOMNode() : cell.domRef.current;
    const gridNode = selectParent('.inovua-react-virtual-list', cellNode);

    const gridRect = gridNode.getBoundingClientRect();
    const cellRect = cellNode.getBoundingClientRect();

    if (cellRect.top > gridRect.top + 350 /* TODO remove hardcoded value */) {
      this.setState({
        position: 'top',
      });
    }
  }

  constrainTo = () => {
    return this.constrainToNode;
  };

  onExpandChange(expanded) {
    this.setState({
      expanded,
    });
  }
  render() {
    const { props } = this;
    return (
      <div
        className="InovuaReactDataGrid__cell__editor InovuaReactDataGrid__cell__editor--date"
        ref={this.domRef}
      >
        <DateField
          theme={props.theme}
          autoFocus={props.autoFocus}
          onExpandChange={this.onExpandChange}
          dateFormat={props.cellProps.dateFormat || 'YYYY-MM-DD'}
          defaultValue={props.value}
          pickerPosition={this.state.position}
          onChange={props.onChange}
          constrainTo={props.constrainTo || this.constrainTo}
          overlayProps={{
            target: () => {
              return this.domNode;
            },
            ...props.overlayProps,
          }}
          relativeToViewport={props.relativeToViewport}
          renderPicker={props.renderPicker}
          onLazyBlur={props.onComplete}
          onClick={stopPropagation}
          onKeyDown={e => {
            if (e.key === 'Enter' && !this.state.expanded) {
              props.onComplete();
            }
            if (e.key === 'Tab') {
              e.preventDefault();
              props.onTabNavigation(true, e.shiftKey ? -1 : 1);
            }
          }}
        />
      </div>
    );
  }
}

DateEditor.defaultProps = {
  relativeToViewport: false,
};
