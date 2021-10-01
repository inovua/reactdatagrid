/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import NotifyResize from '../../../packages/react-notify-resize/src';
import smoothScrollTo from '../../smoothScrollTo';

type TypeProps = {
  theme: string;
  scrollDebounceDelay: number;
  scrollDebounce: boolean;
  rafOnScroll: boolean;
  cancelPrevScrollRaf: boolean;
  avoidScrollTopBrowserLayout: boolean;
  onScroll?: (event: MouseEvent) => void;
  renderScroller?: () => void;
  renderRowContainer?: () => void;
  onResize?: (
    size: number | { width: number; height: number },
    self?: any
  ) => any;
  onBrowserScroll?: ({
    scrollTop,
    reorder,
  }: {
    scrollTop?: number;
    reorder?: boolean;
  }) => void;
  onScrollStart?: Function;
  onScrollStop?: (scrollPos: any, prevScrollPos: any, eventTarget: any) => void;
  applyCSSContainOnScroll: boolean;
  usePassiveScroll: boolean;
  onWillUnmount?: Function;
  onDidMount?: Function;
  scrollMaxDelta?: any;
  rowContainer?: any;
  children?: any[];
  minRowWidth?: number;
};

const defaultProps = {
  theme: 'default-light',
  scrollDebounceDelay: 0,
  scrollDebounce: false,
  rafOnScroll: false,
  cancelPrevScrollRaf: true,
  avoidScrollTopBrowserLayout: false,
  applyCSSContainOnScroll: true,
  usePassiveScroll: true,
};
class Scroller extends Component<TypeProps, any> {
  domNodeRef: any;
  browserResizerRef: any;
  domNode: any;
  browserResizer: any;
  unmounted: boolean = false;
  scrollRafId: any;
  scrollStarted: boolean = false;
  targetRect?: any;
  scroll?: { scrollTop: number; scrollLeft: number };

  constructor(props: any) {
    super(props);

    this.domNodeRef = (c: any) => {
      if (props.usePassiveScroll) {
        if (c) {
          this.setupPassiveScrollListener(c);
        } else {
          this.removePassiveScrollListener(this.domNode);
        }
      }
      this.domNode = c;
    };

    this.browserResizerRef = (b: any) => {
      this.browserResizer = b;
    };
  }

  setupPassiveScrollListener = (node: any) => {
    node.addEventListener('scroll', this.onScroll, {
      passive: true,
    });
  };

  removePassiveScrollListener = (node: any = this.domNode) => {
    if (node) {
      node.removeEventListener('scroll', this.onScroll, {
        passive: true,
      });
    }
  };

  componentDidMount = () => {
    if (typeof this.props.onDidMount === 'function') {
      this.props.onDidMount(this, this.getDOMNode(), this.browserResizer);
    }
  };

  componentWillUnmount = () => {
    this.unmounted = true;

    if (this.props.usePassiveScroll) {
      this.removePassiveScrollListener();
    }

    if (typeof this.props.onWillUnmount === 'function') {
      this.props.onWillUnmount(this);
    }
  };

  get scrollTop() {
    return this.domNode.scrollTop;
  }

  get scrollLeft() {
    return this.domNode.scrollLeft;
  }

  get scrollTopMax() {
    return this.domNode.firstChild.clientHeight;
  }

  get scrollLeftMax() {
    return this.props.minRowWidth;
  }

  set scrollTop(value) {
    this.domNode.scrollTop = value;
  }

  set scrollLeft(value) {
    this.domNode.scrollLeft = value;
  }

  onScroll = (event: any) => {
    const eventTarget = event.target;

    if (this.props.onScroll) {
      this.props.onScroll(event);
    }

    const scrollTop = eventTarget.scrollTop;
    this.updateScroll({ scrollTop });
  };

  updateScroll = ({ scrollTop }: { scrollTop: number }) => {
    if (this.props.onBrowserScroll) {
      this.props.onBrowserScroll({
        scrollTop,
        reorder: false,
      });
    }
  };

  smoothScrollTo(
    newValue: number,
    cfg: any,
    callback: (...args: any[]) => void
  ) {
    return smoothScrollTo(this.getDOMNode(), newValue, cfg, callback);
  }

  onStop = (scrollPos: any, prevScrollPos: any, eventTarget: any) => {
    this.scrollStarted = false;

    if (this.props.applyCSSContainOnScroll) {
      this.applyCSSContainOnScrollUpdate(false);
    }

    delete this.targetRect;
    if (this.props.onScrollStop) {
      this.props.onScrollStop(scrollPos, prevScrollPos, eventTarget);
    }
  };

  applyCSSContainOnScrollUpdate = (bool: boolean) => {
    const domNode = this.domNode;

    if (domNode) {
      domNode.style.contain = bool ? 'strict' : '';
    }
  };

  sync = () => {
    if (this.unmounted) {
      return;
    }
  };

  getDOMNode = () => {
    return this.domNode;
  };

  renderScroller = () => {
    if (this.props.renderScroller) {
      this.props.renderScroller();
    }
  };

  renderRowContainer = () => {
    if (this.props.renderRowContainer) {
      return this.props.renderRowContainer;
    }
  };

  onResize = (size: number) => {
    this.sync();
    if (this.props.onResize) {
      this.props.onResize(size);
    }
  };

  renderSizer = () => {
    return (
      <NotifyResize
        key="browserScrollerResizer"
        ref={this.browserResizerRef}
        onResize={this.onResize}
        notifyOnMount
      />
    );
  };

  prepareStyle = () => {
    if (!this.domNode) {
      return;
    }

    const parentNode = this.domNode.parentNode;
    const header = parentNode.firstChild;
    const headerHeight = header.offsetHeight;

    this.domNode.style.overflow = 'auto';
    this.domNode.style.height = `calc(100% - ${headerHeight}px)`;
  };

  scrollerStyle = (props: any) => {
    const height = props.rowHeight * props.count;

    return {
      height,
    };
  };

  renderChildren = (props: TypeProps) => {
    const scrollerStyle = this.scrollerStyle(props);
    let container;

    if (props.rowContainer) {
      const containerProps = {
        children: props.children,
      };
      container = props.rowContainer(containerProps);
    }

    if (container === undefined) {
      container = <div key="browserContainer">{props.children}</div>;
    }

    const containerWrapper = (
      <div
        key="browserScrollContainer"
        style={scrollerStyle}
        className="InovuaReactDataGrid__browser-scroll-container"
      >
        {container}
      </div>
    );
    const sizer = this.renderSizer();

    const children = React.Fragment ? (
      <React.Fragment>
        {containerWrapper}
        {sizer}
      </React.Fragment>
    ) : (
      [containerWrapper, sizer]
    );

    return children;
  };

  render = () => {
    const { props } = this;

    this.prepareStyle();

    const children = this.renderChildren(props);

    return (
      <div
        ref={this.domNodeRef}
        className="InovuaReactDataGrid__browser-scroll"
      >
        {children}
      </div>
    );
  };

  static defaultProps = defaultProps;
}

export default Scroller;
