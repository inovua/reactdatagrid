/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cleanProps from '../../../common/cleanProps';
import assign from '../../../common/assign';
import eventManager from './eventManager';
import getMinMaxSize from './utils/getMinMaxSize';
import join from './utils/join';
import shouldComponentUpdate from './utils/shouldComponentUpdate';
import normalizeEvent from './utils/normalizeEvent';
import getFocusableElements from './utils/getFocusableElements';
import getPosition from '../../../common/getPositionRelativeToElement';
import Arrow from './Arrow';

import { posiblePositions } from '../../../common/getPositionRelativeToElement/positionsMap';

class InovuaOverlay extends Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: props.defaultVisible,
      position: null,
      arrowConfig: null,
      renderTrigger: null,
    };

    this.handleDocumentScroll = this.handleDocumentScroll.bind(this);
    this.onHide = this.onHide.bind(this);
    this.onShow = this.onShow.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.getOverlayNode = this.getOverlayNode.bind(this);
    this.getVisible = this.getVisible.bind(this);
    this.getActiveTargetNode = this.getActiveTargetNode.bind(this);
    this.rootRef = node => {
      this.rootNode = node;
    };

    this.fixedRef = node => {
      this.fixedNode = node;
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return shouldComponentUpdate(this, nextProps, nextState);
  }

  componentDidMount() {
    this.register();
    this.componentIsMounted = true;

    if (this.props.updatePositionOnScroll) {
      window.addEventListener('scroll', this.handleDocumentScroll, true);
    }

    const doPosition = () => {
      /**
       * If target is a node then activeTargetNode
       * is this target, so position can be set.
       */
      const target = this.getTarget();
      if (typeof target === 'object') {
        this.activeTargetNode = target;
        this.setPosition(this.props.onInitialPosition);
        if (this.getVisible()) {
          this.onShow({ target });
        }
      }
    };

    if (this.props.rafOnMount) {
      requestAnimationFrame(doPosition);
    } else {
      doPosition();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.visible !== nextProps.visible) {
      this.handleVisibleChange(nextProps.visible);
    }
  }

  componentWillUnmount() {
    this.unregister();
    this.componentIsMounted = null;
    this.activeTargetNode = null;

    if (this.props.updatePositionOnScroll) {
      window.removeEventListener('scroll', this.handleDocumentScroll, true);
    }
  }

  render() {
    const props = this.props;

    const className = this.prepareClassName();
    const contentClassName = this.prepareContentClassName();
    const style = this.prepareStyle();
    const contentStyle = this.prepareContentStyle();

    return (
      <div
        {...cleanProps(props, InovuaOverlay.propTypes)}
        className={className}
        ref={this.rootRef}
        style={style}
        onKeyDown={this.handleKeyDown}
      >
        <div
          className={contentClassName}
          {...this.getChildrenProps()}
          style={contentStyle}
        />
        {props.arrow && this.renderArrow()}
        {props.relativeToViewport && this.renderFixed()}
      </div>
    );
  }

  renderFixed() {
    return (
      <div
        style={{ position: 'fixed', top: 0, left: 0, width: 0, height: 0 }}
        ref={this.fixedRef}
      />
    );
  }

  renderArrow() {
    if (!this.state.arrowConfig) {
      return null;
    }
    const { rootClassName } = this.props;

    const position = this.state.arrowConfig.position;
    const location = this.state.arrowConfig.location;
    const className = join(
      `${rootClassName}__arrow`,
      `${rootClassName}__arrow--${location}`,
      this.props.arrowClassName
    );

    const style = assign({}, this.props.arrowStyle);

    if (this.props.border) {
      assign(style, {
        border: this.props.border,
      });
    }

    if (this.props.background != undefined) {
      assign(style, {
        background: this.props.background,
      });
    }

    const wrapperClassName = join(
      `${rootClassName}__arrow-wrapper`,
      `${rootClassName}__arrow-wrapper--${location}`
    );

    return (
      <Arrow
        className={className}
        wrapperClassName={wrapperClassName}
        position={position}
        style={style}
        size={this.props.arrowSize}
      />
    );
  }

  /**
   * Children can be a function or jsx.
   * If undefined, it used the target's data-tooltip
   * attribute and will set the contents with
   * dangerouslySetInnerHTML.
   */
  getChildrenProps() {
    const { children } = this.props;
    const targetNode = this.getPositionTarget();
    const childrenProps = { children };
    const childrenParams = {
      targetNode,
      visible: this.getVisible(),
    };

    if (typeof children === 'function') {
      return {
        children: children(childrenParams),
      };
    }

    if (children === undefined && targetNode) {
      const tooltip = targetNode.getAttribute('data-tooltip');
      if (tooltip != null) {
        return {
          dangerouslySetInnerHTML: {
            __html: tooltip,
          },
        };
      }
    }

    return childrenProps;
  }

  // className
  prepareClassName() {
    const { props, state } = this;
    const {
      rootClassName,
      theme,
      visibleClassName,
      relativeToViewport,
    } = props;

    const visible = this.getVisible();

    let className = join(
      rootClassName,
      props.className,
      visible && `${rootClassName}--visible`,
      visible && visibleClassName,
      !visible && `${rootClassName}--invisible`,
      relativeToViewport && `${rootClassName}--position-fixed`,
      theme && `${rootClassName}--theme-${theme}`
    );

    if (this.props.fade) {
      // animation
      className = join(
        className,
        props.fade && `${rootClassName}--has-transition`,
        state.transitionEnter && `${rootClassName}--transition-enter`,
        state.transitionEnterActive &&
          `${rootClassName}--transition-enter-active`,
        state.transitionLeave && `${rootClassName}--transition-leave`,
        state.transitionLeaveActive &&
          `${rootClassName}--transition-leave-active`
      );
    }

    return className;
  }

  prepareContentClassName() {
    return join(
      this.props.contentClassName,
      `${this.props.rootClassName}__content`
    );
  }

  prepareStyle() {
    const style = assign(
      {
        zIndex: this.props.zIndex,
      },
      this.props.style
    );
    /**
     * Transition duration must be added
     * only when transition should start.
     *
     * If is added all the time when it first
     * changes opacity, it will transition
     * directly/blinks, I think because it tries
     * to transition also from visibility hidden to
     * visible.
     */
    if (this.props.fade) {
      assign(style, this.getTransitionStyle());
    }

    if (this.props.border) {
      assign(style, {
        border: this.props.border,
      });
    }

    if (this.state.position) {
      if (this.props.useTransform) {
        style.transform = `translate3d(${Math.round(
          this.state.position.left || 0
        )}px, ${Math.round(this.state.position.top || 0)}px, 0px)`;
        style.left = 0;
        style.top = 0;
      } else {
        assign(style, {
          left: Math.round(this.state.position.left),
        });
        if (this.state.position.top != null) {
          style.top = Math.round(this.state.position.top);
        }
      }
      if (this.state.position.bottom != null) {
        style.bottom = Math.round(this.state.position.bottom);
      }
      if (this.state.position.width) {
        style.width = this.state.position.width;
      }
    }

    return style;
  }

  prepareContentStyle() {
    const style = assign({}, this.props.contentStyle);

    if (this.props.background != undefined) {
      assign(style, {
        background: this.props.background,
      });
    }

    if (this.props.padding != undefined) {
      assign(style, {
        padding: this.props.padding,
      });
    }

    if (this.props.height != undefined) {
      assign(style, {
        height: this.props.height,
      });
    }

    if (this.props.width != undefined) {
      assign(style, {
        width: this.props.width,
      });
    }

    const maxMinSize = getMinMaxSize(this.props);
    assign(style, maxMinSize);

    return style;
  }

  getTransitionStyle() {
    const { state } = this;
    const style = {};

    if (state.transitionEnterActive || state.transitionLeaveActive) {
      style.transitionDuration = state.transitionEnterActive
        ? `${this.getFadeInDuration()}ms`
        : `${this.getFadeOutDuration()}ms`;

      style.transitionTimingFunction = state.transitionEnterActive
        ? this.getFadeInTransitionFunction()
        : this.getFadeOutTransitionFunction();
    }

    return style;
  }

  // show hide logic

  onShow(event) {
    this.activeTargetNode = event.target;

    /**
     * a render must be triggered before
     * position and visibility is updated
     * because a real size is neaded for
     * a correct position to be determined
     */
    this.setState(
      {
        renderTrigger: !this.state.renderTrigger,
      },
      () => {
        this.setPosition();
        this.setVisible(true);
      }
    );
  }

  onHide(event) {
    this.setVisible(false);
  }

  // event registering
  register() {
    this.eventManager = this.getEventManager()({
      // events
      showEvent: normalizeEvent(this.props.showEvent),
      hideEvent: normalizeEvent(this.props.hideEvent),

      // selector
      target: this.getTarget(),

      // bools
      hideOnScroll: this.props.hideOnScroll,
      hideOnClickOutside: this.props.hideOnClickOutside,
      hideOnEscape: this.props.hideOnEscape,

      // actions
      onShow: this.onShow,
      onHide: this.onHide,

      // delays
      getShowDelay: () => this.props.showDelay,
      getHideDelay: () => this.props.hideDelay,

      // states
      getVisible: this.getVisible,

      // nodes
      getOverlayNode: this.getOverlayNode,
      getActiveTargetNode: this.getActiveTargetNode,
    });
  }

  unregister() {
    if (this.eventManager) {
      this.eventManager.unregister();
    }
  }

  getEventManager() {
    return this.props.eventManager;
  }

  getTarget() {
    let target;

    const rootNode = this.getOverlayNode();

    if (this.props.target) {
      target = this.props.target;

      if (typeof target === 'function') {
        target = target(this.props, rootNode, this);
      }
    } else {
      if (rootNode) {
        target = rootNode.parentElement;
      }
    }

    return target;
  }

  // visible
  setVisible(visible) {
    if (!this.isVisibleControlled()) {
      if (visible !== this.getVisible()) {
        this.handleVisibleChange(visible);
      }

      this.setState({
        visible,
      });
    }
    if (visible) {
      this.props.onShow();
    } else {
      this.props.onHide();
    }
    this.props.onVisibleChange(visible);
  }

  isVisibleControlled() {
    return this.props.visible != null; // allow null and undefined
  }

  getVisible() {
    return this.isVisibleControlled() ? this.props.visible : this.state.visible;
  }

  // positioning
  setPosition(callback) {
    this.setState(this.getPositionConfig(), callback);
  }

  /**
   * Uses `getPosition` with parameters
   */
  getPositionConfig() {
    const { constrainTo, offset, syncWidth } = this.props;
    let positions = this.props.positions;
    // const targetNode = this.getActiveTargetNode();
    const targetNode = this.getPositionTarget();

    let tooltipPositions = targetNode
      ? targetNode.getAttribute('data-tooltip-positions')
      : null;

    if (tooltipPositions) {
      positions = tooltipPositions
        .split(',')
        .map(position =>
          position && position.trim ? position.trim() : position
        );
    }
    const normalizedPositions = Array.isArray(positions)
      ? positions
      : [positions];

    const newState = getPosition({
      showArrow: true,
      constrainTo,
      offset,
      targetNode,
      overlayNode: this.getOverlayNode(),
      positions: normalizedPositions,
      adjustOnPositionBottom: this.props.adjustOnPositionBottom,
      relativeToViewport: this.props.relativeToViewport,
      arrowSize: this.props.arrowSize,
    });

    if (this.props.relativeToViewport && this.fixedNode) {
      const fixedRect = this.fixedNode.getBoundingClientRect();

      if (newState && newState.position) {
        const { useTransform } = this.props;
        newState.position = {
          top: newState.position.top - (useTransform ? 0 : fixedRect.top),
          left: newState.position.left - (useTransform ? 0 : fixedRect.left),
        };

        if (syncWidth) {
          newState.position.width = newState.alignRegion.width;
        }
      }
    }

    return newState;
  }

  handleDocumentScroll() {
    if (this.props.updatePositionOnScroll) {
      /**
       * Dom mutation is used because
       * state change whould be to expensive
       * onSCroll
       */
      this.updateDomPosition();
    }
  }

  updateDomPosition() {
    const positionConfig = this.getPositionConfig();

    if (this.rootNode && positionConfig) {
      const newPosition = positionConfig.position;
      if (newPosition.bottom !== undefined) {
        this.rootNode.style.bottom = `${newPosition.bottom}px`;
      }

      if (this.props.useTransform) {
        const oldPosition = this.state.position || { top: 0, left: 0 };
        this.rootNode.style.transform = `translate3d(${Math.round(
          newPosition.left || oldPosition.left
        )}px, ${Math.round(newPosition.top || oldPosition.top)}px, 0px)`;
      } else {
        if (newPosition.top !== undefined) {
          this.rootNode.style.top = `${Math.round(newPosition.top)}px`;
        }

        this.rootNode.style.left = `${Math.round(newPosition.left)}px`;
      }
    }
  }

  // node getters
  getOverlayNode() {
    return this.rootNode;
  }

  getActiveTargetNode() {
    return this.activeTargetNode;
  }

  getPositionTarget() {
    const target = this.getTarget();

    if (target instanceof Element) {
      return target;
    }

    return this.getActiveTargetNode();
  }

  // fade animation
  // animation
  handleVisibleChange(visible) {
    if (!this.props.fade) {
      return null;
    }
    if (visible) {
      this.setupEnterTransition();
    } else {
      this.setupLeaveTransition();
    }
  }

  setupEnterTransition() {
    this.props.onFadeInStart();
    this.setState(
      {
        transitionEnter: true,
        transitionEnterActive: false,

        // reset leave
        transitionLeave: false,
        transitionLeaveActive: false,
      },
      () => {
        setTimeout(() => {
          if (this.componentIsMounted) {
            this.setState(
              {
                transitionEnterActive: true,
              },
              () => {
                this.props.onFadeInEnd();
              }
            );
          }
        }, 16);
      }
    );
  }

  setupLeaveTransition() {
    this.props.onFadeOutStart();
    this.setState(
      {
        transitionLeave: true,
        transitionLeaveActive: false,

        // reset enter
        transitionEnter: false,
        transitionEnterActive: false,
      },
      () => {
        setTimeout(() => {
          if (this.componentIsMounted) {
            this.setState(
              {
                transitionLeaveActive: true,
              },
              () => {
                setTimeout(() => {
                  if (this.componentIsMounted) {
                    // cleanup
                    this.setState(
                      {
                        transitionLeave: false,
                        transitionLeaveActive: false,
                      },
                      () => {
                        this.props.onFadeOutEnd();
                      }
                    );
                  }
                }, this.getFadeOutDuration());
              }
            );
          }
        }, 16);
      }
    );
  }

  getFadeInDuration() {
    if (this.props.fadeInDuration) {
      return this.props.fadeInDuration;
    }
    return this.props.fadeDuration;
  }

  getFadeOutDuration() {
    if (this.props.fadeOutDuration) {
      return this.props.fadeOutDuration;
    }
    return this.props.fadeDuration;
  }

  getFadeInTransitionFunction() {
    if (this.props.fadeInTransitionFunction) {
      return this.props.fadeInTransitionFunction;
    }
    return this.props.fadeTransitionFunction;
  }

  getFadeOutTransitionFunction() {
    if (this.props.fadeOutTransitionFunction) {
      return this.props.fadeOutTransitionFunction;
    }
    return this.props.fadeTransitionFunction;
  }

  // capture tab navigation
  // root events
  handleKeyDown(event) {
    if (this.props.captureTabNavigation && event.key === 'Tab') {
      this.captureTabNavigation(event);
    }

    // let event propagate
    if (this.props.onKeyDown) {
      this.props.onKeyDown(event);
    }
  }

  captureTabNavigation(event) {
    const shiftKey = event.shiftKey;
    const nodes = getFocusableElements(this.rootNode);
    if (!nodes.length) {
      return null;
    }
    const firstNode = nodes[0];
    const lastNode = nodes[nodes.length - 1];

    if (lastNode === event.target && !shiftKey) {
      firstNode.focus();
      event.preventDefault();
      event.stopPropagation();
    }

    if (firstNode === event.target && shiftKey) {
      lastNode.focus();
      event.preventDefault();
      event.stopPropagation();
    }
  }

  // methods
  show() {
    this.setVisible(true);
  }

  hide() {
    this.setVisible(false);
  }
}

const emptyFn = () => {};

InovuaOverlay.defaultProps = {
  captureTabNavigation: false,
  updatePositionOnScroll: false,
  zIndex: 100,
  theme: 'default',

  // style
  rootClassName: 'inovua-react-toolkit-overlay',
  background: null,
  padding: null,

  // visibility
  eventManager,
  target: null,
  showEvent: ['mouseenter'],
  hideEvent: ['mouseleave'],
  defaultVisible: false,

  // arrow
  arrow: true,
  arrowStyle: {},
  arrowSize: 11,

  // delays
  showDelay: null,
  hideDelay: null,

  // visible modifiers
  hideOnClickOutside: true,
  hideOnScroll: false,

  // animation
  fade: false,
  fadeDuration: 300,
  fadeInDuration: 300,
  fadeOutDuration: 50,
  fadeTransitionFunction: 'ease',

  // position
  positions: posiblePositions,
  constrainTo: true,
  offset: 10,
  rafOnMount: true,
  relativeToViewport: true,
  adjustOnPositionBottom: false,

  // events
  onVisibleChange: emptyFn,
  onShow: emptyFn,
  onHide: emptyFn,

  onFadeInStart: emptyFn,
  onFadeOutStart: emptyFn,
  onFadeInEnd: emptyFn,
  onFadeOutEnd: emptyFn,
};

InovuaOverlay.propTypes = {
  shouldComponentUpdate: PropTypes.func,
  captureTabNavigation: PropTypes.bool,
  updatePositionOnScroll: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),

  // style
  rootClassName: PropTypes.string,
  border: PropTypes.string,
  background: PropTypes.string,
  theme: PropTypes.string,
  zIndex: PropTypes.number,

  // content
  contentStyle: PropTypes.object,
  contentClassName: PropTypes.string,
  padding: PropTypes.number,

  // size
  height: PropTypes.number,
  width: PropTypes.number,
  minSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.shape({
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ]),
  maxSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.shape({
      height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    }),
  ]),

  // arrow
  arrow: PropTypes.bool,
  arrowClassName: PropTypes.string,
  arrowStyle: PropTypes.object,
  arrowSize: PropTypes.number,

  // visibility
  visible: PropTypes.bool,
  visibleClassName: PropTypes.string,
  defaultVisible: PropTypes.bool,
  target: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func,
  ]),
  eventManager: PropTypes.func,

  // visible events
  showEvent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),
  hideEvent: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.string),
    PropTypes.string,
  ]),

  // delays
  showDelay: PropTypes.number,
  hideDelay: PropTypes.number,

  // visible modifiers
  hideOnClickOutside: PropTypes.bool,
  hideOnScroll: PropTypes.bool,
  hideOnEscape: PropTypes.bool,

  useTransform: PropTypes.bool,

  // animation
  fade: PropTypes.bool,
  fadeDuration: PropTypes.number,
  fadeInDuration: PropTypes.number,
  fadeOutDuration: PropTypes.number,
  fadeTransitionFunction: PropTypes.string,
  fadeInTransitionFunction: PropTypes.string,
  fadeOutTransitionFunction: PropTypes.string,

  // positioning
  constrainTo: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.func,
    PropTypes.bool,
  ]),
  positions: (props, propName, componentName) => {
    const positions = props[propName];

    if (typeof positions === 'string') {
      if (posiblePositions.indexOf(positions) === -1) {
        return new Error(
          `
Invalid prop ${propName} suplied to ${componentName}.
Following values are allowed: ${posiblePositions.join(', ')}
`
        );
      }
    }
  },
  offset: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.shape({
      x: PropTypes.number,
      y: PropTypes.number,
    }),
    PropTypes.arrayOf(
      PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.shape({
          x: PropTypes.number,
          y: PropTypes.number,
        }),
      ])
    ),
  ]),
  rafOnMount: PropTypes.bool,
  relativeToViewport: PropTypes.bool,
  adjustOnPositionBottom: PropTypes.bool,
  syncWidth: PropTypes.bool,

  onInitialPosition: PropTypes.func,

  // events
  onVisibleChange: PropTypes.func,
  onShow: PropTypes.func,
  onHide: PropTypes.func,

  onFadeInStart: emptyFn,
  onFadeOutStart: emptyFn,
  onFadeInEnd: emptyFn,
  onFadeOutEnd: emptyFn,
};

export default InovuaOverlay;
