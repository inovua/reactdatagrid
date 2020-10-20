/**
 * Copyright (c) INOVUA SOFTWARE TECHNOLOGIES.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { cloneElement, CSSProperties } from 'react';
import PropTypes from 'prop-types';

import shouldComponentUpdate from '../../../packages/shouldComponentUpdate';
import sealedObjectFactory from './sealedObjectFactory';
import { RowHeightManager } from './RowHeightManager';

const sharedRowProps = sealedObjectFactory({
  index: null,
  count: null,
  rowHeight: null,
  renderIndex: null,
  empty: null,
  sticky: null,
  rowSpan: null,
});

const STR_HIDDEN = 'hidden';
const STR_ABSOLUTE = 'absolute';
const STR_ZERO_PX = '0px';
const STR_VISIBLE = 'visible';

const raf = (global as any).requestAnimationFrame;
const caf = (global as any).cancelAnimationFrame;

type TypeVirtualListRow = {
  useTransformPosition: boolean;
  pure: boolean;
  showEmptyRows?: boolean;
  rowHeightManager: RowHeightManager;
  naturalRowHeight?: boolean;
  virtualized?: boolean;
  contain?: boolean | string;
};
export default class InovuaVirtualListRow extends React.Component<
  TypeVirtualListRow
> {
  private mounted: boolean = true;
  private _appliedIndex?: number;
  private refetchNode?: boolean = true;
  private visible?: boolean;
  private index?: number;
  private offset?: number = 0;
  private rowSpan?: number;
  private oldRowSpan?: number;
  private ref: (r: any) => void;
  private row: any;
  private node!: HTMLElement;

  constructor(props: TypeVirtualListRow) {
    super(props);

    this.ref = r => {
      this.row = r;
    };
  }

  getInstance() {
    return this.row;
  }

  shouldComponentUpdate(
    nextProps: TypeVirtualListRow,
    nextState: any
  ): boolean {
    if (!nextProps.pure) {
      return true;
    }

    return shouldComponentUpdate(this, nextProps, nextState);
  }

  componentDidMount() {
    const { naturalRowHeight } = this.props;
    this.fetchNode();
    if (naturalRowHeight) {
      this.node.style.visibility = STR_HIDDEN;
    }
    this.updateRowHeight();
    this.updateRowSpan();
  }

  componentWillUnmount() {
    this.mounted = false;

    if (this.props.onUnmount) {
      this.props.onUnmount(this);
    }

    this.node = null;
    this.info = null;
  }

  componentDidUpdate() {
    if (this.refetchNode) {
      this.fetchNode();
      this.refetchNode = false;
    }
    this.updateRowSpan();
  }

  updateRowSpan() {
    if (this.rowSpan !== this.oldRowSpan) {
      this.props.notifyRowSpan(this.getIndex(), this.rowSpan);
      const node = this.getDOMNode();

      node.style.zIndex = this.rowSpan > 1 ? 1 : null;
    }
  }

  getDOMNode() {
    if (this.node) {
      return this.node;
    }
    if (!this.row) {
      return null;
    }
    this.node = this.row.domRef ? this.row.domRef.current : this.row;
    return this.node;
  }

  fetchNode() {
    const node = this.getDOMNode();

    if (!this.props.virtualized) {
      return;
    }

    if (node && !this.isVisible()) {
      node.style.visibility = STR_HIDDEN;
    }

    const { contain, rowHeightManager } = this.props;

    if (node) {
      node.style.position = STR_ABSOLUTE;
      node.style.top = STR_ZERO_PX;
      if (contain) {
        if (contain === true) {
          node.style.contain = 'style layout paint';
        } else {
          node.style.contain = contain;
        }
      }

      if (rowHeightManager != null) {
        const index = this.getIndex();
        // in order to force setIndex to set the transform position and not skip the transform
        delete this.index;
        this.setIndex(index, undefined, false);
      }
    }
  }

  render() {
    const {
      renderRow,
      count,
      index: renderIndex,
      showEmptyRows,
      onKeyDown,
      onFocus,
      rowHeightManager,
      sticky,
      contain,
      virtualized,
      useTransformPosition,
    } = this.props;

    const index = this.getIndex();

    sharedRowProps.empty = false;

    if (index >= count) {
      if (!showEmptyRows) {
        this.renderResult = false;
        return null;
      }
      sharedRowProps.empty = true;
    }

    const rowHeight = rowHeightManager
      ? rowHeightManager.getRowHeight(index)
      : this.props.rowHeight;
    sharedRowProps.rowHeight = rowHeight;
    sharedRowProps.count = count;
    sharedRowProps.index = index;
    sharedRowProps.renderIndex = renderIndex;
    sharedRowProps.rowSpan = 1;
    sharedRowProps.sticky = sticky;

    const row = renderRow(sharedRowProps);

    this.oldRowSpan = this.rowSpan || 1;
    this.rowSpan = sharedRowProps.rowSpan;

    if (this.renderResult === false && row) {
      this.refetchNode = true;
    }
    this.renderResult = !!row;

    if (!row) {
      return null;
    }

    let extraStyle: CSSProperties | null = null;
    if (virtualized) {
      extraStyle = {
        top: 0,
        position: STR_ABSOLUTE,
        backfaceVisibility: STR_HIDDEN,

        visibility: this.isVisible() ? STR_VISIBLE : STR_HIDDEN,
      };

      extraStyle[
        useTransformPosition ? 'transform' : 'top'
      ] = useTransformPosition
        ? `translate3d(0px, ${this.offset}px, 0px)`
        : this.offset;

      if (contain) {
        if (contain === true) {
          extraStyle.contain = 'style layout paint';
        } else {
          extraStyle.contain = contain;
        }
      }

      if (row.props && row.props.style) {
        extraStyle = { ...row.props.style, ...extraStyle };
      }
    }

    return cloneElement(row, {
      // it is crucial for performance that this row has the same key
      // i.e.: the initial index of the row.
      // even if data changes, and `setIndex` is called, the key should remain
      // the initial this.props.index, so as to reuse the same `div` (HTMLElement)
      // and not throw it away and replace with another HTMLElement
      key: this.props.index,
      ref: this.ref,
      onFocus: onFocus ? onFocus.bind(null, index) : null,
      onKeyDown: onKeyDown ? onKeyDown.bind(null, index) : null,
      style: extraStyle,
    });
  }

  updateRowHeight(config?: { useRaf: boolean }) {
    const { naturalRowHeight, rowHeightManager } = this.props;
    if (naturalRowHeight) {
      const index = this.index;
      const rowHeight = rowHeightManager.getRowHeight(index);
      const offsetHeight = this.node.offsetHeight;
      if (rowHeight != offsetHeight) {
        const info = {
          index,
          height: offsetHeight,
        };

        if (!offsetHeight) {
          return;
        }
        const useRaf =
          config && config.useRaf !== undefined ? !!config.useRaf : true;
        if (useRaf) {
          rowHeightManager.setRowHeightLazy(info);
        } else {
          rowHeightManager.setRowHeight(info);
        }
      }
    }
  }

  update(callback?: (info?: any) => void) {
    if (this.mounted === false) {
      return;
    }
    if (this.props.rowHeightManager != null) {
      this.forceUpdate(() => {
        this.updateRowHeight();
        if (typeof callback === 'function') {
          callback();
        }
      });
      return;
    }

    this.forceUpdate(() => {
      if (typeof callback == 'function') {
        callback(this.getInfo(true /* update height */));
      }
    });
  }

  setVisible(value: boolean, callback?: (info: any) => void) {
    if (this.mounted === false) {
      return;
    }

    this.visible = value;
    if (this.node) {
      this.node.style.visibility = value ? STR_VISIBLE : STR_HIDDEN;
    }

    if (typeof callback == 'function') {
      callback(this.getInfo());
    }
  }

  setRowOffset(index = this.index) {
    const { rowHeightManager, useTransformPosition } = this.props;
    if (rowHeightManager) {
      const rowOffset = rowHeightManager.getRowOffset(index);
      this.offset = rowOffset;
      if (useTransformPosition) {
        this.node.style.transform = `translate3d(0px, ${rowOffset}px, 0px)`;
      } else {
        this.node.style.top = `${rowOffset}px`;
      }
    }
  }

  setIndex(
    index: number,
    callback: () => void | undefined,
    useRaf: boolean = false,
    force?: boolean
  ) {
    if (this.mounted === false) {
      return;
    }

    // if this.index is set and same index, skip applying the transform altogether
    if (this.index === index && this.isVisible() && !force) {
      if (callback) {
        callback();
      }
      return;
    }

    this.index = index;
    this._appliedIndex = undefined;
    this.doSetIndex(index, callback, useRaf);
  }

  doSetIndex(index: number, callback: () => void | undefined, useRaf: boolean) {
    const sameIndex = this._appliedIndex === index;
    this._appliedIndex = index;

    if (useRaf !== true) {
      this.setVisible(true);
      this.setRowOffset(index);
      // but we might have the case when this.index is not yet set,
      // so no transform applied. In this case, we want to apply the transform,
      // but after applying the transform, if we have
      // the same index, we can skip the update altogether
      if (sameIndex) {
        if (callback) {
          callback();
        }
        return;
      }
      this.update(callback);
    } else {
      if (this.setIndexRafId) {
        caf(this.setIndexRafId);
      }
      this.setIndexRafId = raf(() => {
        delete this.setIndexRafId;
        this.setVisible(true);
        this.setRowOffset(index);
        if (sameIndex) {
          if (callback) {
            callback();
          }
          return;
        }
        this.update(callback);
      });
    }
  }

  isVisible() {
    return this.visible !== false;
  }

  setOffset(offset: number) {
    // TODO check why this ruins layout!
    // if (this.props.rowHeight != null && this.offset === offset) {
    //   return
    // }
    this.offset = offset;

    if (this.node) {
      const nodeStyle = this.node.style;
      nodeStyle.position = STR_ABSOLUTE;
      nodeStyle.top = STR_ZERO_PX;
      nodeStyle.backfaceVisibility = STR_HIDDEN;
      if (this.props.useTransformPosition) {
        nodeStyle.transform = `translate3d(0px, ${offset}px, 0px)`;
      } else {
        nodeStyle.top = `${offset}px`;
      }
    }
  }

  getIndex() {
    return this.index === undefined ? this.props.index : this.index;
  }

  getRowSpan() {
    return this.rowSpan;
  }

  getInfo(updateHeight) {
    if (this.mounted === false) {
      return this.info;
    }

    if (!this.info) {
      this.info = sealedObjectFactory({
        row: null,
        node: null,
        height: null,
        index: null,
        key: null,
        offset: null,
      });
    }

    this.info.row = this;
    this.info.node = this.node;
    this.info.height =
      updateHeight || this.height === undefined
        ? this.node
          ? this.node.offsetHeight
          : 0
        : this.height;
    this.info.index = this.getIndex();
    this.info.key = this.props.index;
    this.info.offset = this.props.virtualized
      ? this.offset
      : this.node
      ? this.node.offsetTop
      : 0;

    return this.info;
  }
}

InovuaVirtualListRow.defaultProps = {
  pure: false,
  useTransformPosition: false,
};

const propTypes = {
  pure: PropTypes.bool,
  naturalRowHeight: PropTypes.bool,
  rowHeightManager: PropTypes.object,
  count: PropTypes.number,
  contain: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  index: PropTypes.number.isRequired,
  onRowHeightChange: PropTypes.func,
  renderRow: PropTypes.func.isRequired,
  useTransformPosition: PropTypes.bool,
  virtualized: PropTypes.bool,
};

InovuaVirtualListRow.propTypes = propTypes;

export { propTypes };
