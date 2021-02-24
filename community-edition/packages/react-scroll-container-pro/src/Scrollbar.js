/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import autoBind from '../../react-class/autoBind';
import cleanProps from '../../react-clean-props';
import shouldComponentUpdate from './shouldComponentUpdate';
import join from '../../join';
const HORIZONTAL = 'horizontal';
const VERTICAL = 'vertical';
const SIZES = { [VERTICAL]: 'height', [HORIZONTAL]: 'width' };
const OTHER_SIZES = { [VERTICAL]: 'width', [HORIZONTAL]: 'height' };
const MARGINS = { [VERTICAL]: 'right', [HORIZONTAL]: 'bottom' };
const TRACK_SIDES = {
    [VERTICAL]: ['top', 'bottom'],
    [HORIZONTAL]: ['left', 'right'],
};
const STYLES = {
    vertical: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        contain: 'layout paint style',
    },
    horizontal: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        contain: 'layout paint style',
    },
};
export default class InovuaScrollbar extends Component {
    constructor(props) {
        super(props);
        autoBind(this);
        this.scrollPos = 0;
        this.state = { scrollPos: 0 };
        this.refTrack = c => {
            this.trackNode = c;
        };
        this.refThumb = c => {
            this.thumbNode = c;
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        return shouldComponentUpdate(this, nextProps, nextState);
    }
    setVisible(visible) {
        this.visible = visible;
        // when trying to hide the scrollbar, but the mouse is over it
        // just don't hide it. Let setOver(false) do the job
        if (!visible && this.state.over) {
            return;
        }
        if (this.state.visible === visible) {
            return;
        }
        this.setState({ visible });
    }
    setScrollPos(scrollPos) {
        this.scrollPos = scrollPos;
        const transform = this.getThumbTransform();
        if (this.currentTransform == transform) {
            return;
        }
        // in order to squeeze in the most perf,
        // we manage this via direct style.transform assignment
        // and not via setState to trigger a render
        this.thumbNode.style.transform = this.currentTransform = transform;
    }
    getScrollPos() {
        return this.scrollPos;
    }
    render() {
        const { props } = this;
        const { autoHide } = props;
        let { className, style, orientation, vertical, horizontal, visible: thumbVisible, } = props;
        if (orientation) {
            vertical = orientation == VERTICAL;
            horizontal = !vertical;
        }
        this.orientation = orientation = horizontal ? HORIZONTAL : VERTICAL;
        const sizeName = SIZES[orientation];
        const otherSizeName = OTHER_SIZES[orientation];
        if (autoHide === false) {
            thumbVisible = true;
        }
        else {
            if (this.state.visible !== undefined) {
                thumbVisible = this.state.visible;
            }
            if (this.state.active) {
                thumbVisible = true;
            }
        }
        const hiding = !thumbVisible && this.prevVisible;
        const showing = thumbVisible && !this.prevVisible;
        className = join(className, 'inovua-react-scroll-container__scrollbar', `inovua-react-scroll-container__scrollbar--orientation-${orientation}`, `inovua-react-scroll-container__scrollbar--direction-${this.props.rtl ? 'rtl' : 'ltr'}`, !thumbVisible && 'inovua-react-scroll-container__scrollbar--hidden', hiding && 'inovua-react-scroll-container__scrollbar--hiding', this.state.active && 'inovua-react-scroll-container__scrollbar--active', showing && 'inovua-react-scroll-container__scrollbar--showing');
        style = Object.assign({}, style, STYLES[orientation]);
        if (showing && this.props.showTransitionDuration) {
            style.transitionDuration = this.props.showTransitionDuration;
        }
        if (hiding && this.props.hideTransitionDuration) {
            style.transitionDuration = this.props.hideTransitionDuration;
        }
        this.prevVisible = thumbVisible;
        const divProps = cleanProps(props, InovuaScrollbar.propTypes);
        const thumbSize = this.getThumbSize();
        const transform = this.getThumbTransform(orientation, thumbSize);
        const scrollThumbOverWidth = Math.max(this.props.scrollThumbOverWidth, this.props.scrollThumbWidth);
        const thumbRadius = this.props.scrollThumbRadius !== undefined
            ? this.props.scrollThumbRadius
            : this.props.scrollThumbWidth;
        const thumbStyle = Object.assign({}, this.props.scrollThumbStyle, {
            [sizeName]: thumbSize,
            [otherSizeName]: this.state.over || this.state.active || this.props.alwaysShowTrack
                ? scrollThumbOverWidth
                : this.props.scrollThumbWidth,
            transform,
            borderRadius: thumbRadius,
            transitionDuration: this.props.scrollTrackOverTransitionDuration,
        });
        let trackSides = TRACK_SIDES[orientation];
        const scrollThumbMargin = this.props.scrollThumbMargin || 0;
        if (this.props.scrollThumbMargin) {
            style[MARGINS[orientation]] = scrollThumbMargin;
            if (this.props.scrollThumbStartEndRespectMargin) {
                style[trackSides[0]] = this.props.scrollThumbMargin;
            }
        }
        style[trackSides[1]] =
            scrollThumbMargin +
                (this.props.oppositeVisible ? this.props.scrollThumbWidth : 0);
        const thumbClassName = `inovua-react-scroll-container__thumb inovua-react-scroll-container__thumb--orientation-${orientation} inovua-react-scroll-container__thumb--direction-${this.props.rtl ? 'rtl' : 'ltr'}`;
        let trackClassName = `inovua-react-scroll-container__track inovua-react-scroll-container__track--orientation-${orientation} inovua-react-scroll-container__track--direction-${this.props.rtl ? 'rtl' : 'ltr'}`;
        const trackVisible = this.props.alwaysShowTrack ||
            (thumbVisible && this.state.over) ||
            (this.props.showTrackOnDrag && this.state.active);
        if (trackVisible) {
            trackClassName += ' inovua-react-scroll-container__track--visible';
        }
        const trackStyle = {
            pointerEvents: 'none',
            [otherSizeName]: scrollThumbOverWidth,
        };
        if (this.props.dragToScroll) {
            if (thumbVisible) {
                // when the thumb is visible, we should start
                // accepting mouseenter/mouseleave events, so activate pointer events
                trackStyle.pointerEvents = 'all';
            }
            trackStyle.borderRadius = thumbRadius;
            trackClassName += ' inovua-react-scroll-container__track--drag-to-scroll';
            if (this.state.active) {
                // set it to be same as thumb, so as not to flicker cursor when
                // dragging & moving outside the thumb region
                trackStyle.cursor = 'auto';
            }
        }
        if (this.props.rtl) {
            let leftVal = style.left;
            style.left = style.right;
            style.right = leftVal;
        }
        const onThumbMouseDown = thumbVisible && this.props.dragToScroll ? this.onThumbMouseDown : null;
        const onTrackClick = thumbVisible && this.props.dragToScroll ? this.onTrackClick : null;
        const onTrackWheel = this.props.dragToScroll && this.state.over ? this.onTrackWheel : null;
        return (React.createElement("div", Object.assign({}, divProps, { style: style, className: className, "data-orientation": orientation }),
            React.createElement("div", { ref: this.refTrack, style: trackStyle, className: trackClassName, onClick: onTrackClick, onWheel: onTrackWheel, onMouseEnter: this.props.dragToScroll ? this.onMouseEnter : null, onMouseLeave: this.props.dragToScroll ? this.onMouseLeave : null },
                React.createElement("div", { ref: this.refThumb, style: thumbStyle, className: thumbClassName, onMouseDown: onThumbMouseDown }))));
    }
    setOver(over) {
        const doSetOver = overValue => {
            this.setState({ over: overValue }, () => {
                if (!overValue) {
                    if (this.visible !== this.state.visible) {
                        this.setVisible(this.visible);
                    }
                }
            });
        };
        if (this.setOverFalseTimeoutId) {
            clearTimeout(this.setOverFalseTimeoutId);
        }
        if (!over) {
            this.setOverFalseTimeoutId = setTimeout(() => {
                doSetOver(false);
            }, 500);
        }
        else {
            this.setOverFalseTimeoutId = setTimeout(() => {
                doSetOver(true);
            }, 35);
        }
    }
    onMouseEnter() {
        this.setOver(true);
    }
    onMouseLeave() {
        this.setOver(false);
    }
    onTrackWheel(event) {
        // ideally the wheel event should be forwarded to the scroll node so scrolling happens naturally
        const delta = this.orientation == VERTICAL ? event.deltaY : event.deltaX;
        event.preventDefault();
        // in order to prevent browser BACK navigation on mac
        this.props.onWheelScroll(this.orientation, delta, event);
    }
    onTrackClick(event) {
        const target = event.target;
        if (target != this.trackNode) {
            return;
        }
        const rect = target.getBoundingClientRect();
        const offsetX = event.clientX - rect.left;
        const offsetY = event.clientY - rect.top;
        const pos = this.orientation == VERTICAL ? offsetY : offsetX;
        const thumbPos = this.getThumbPosition();
        const direction = pos > thumbPos ? 1 : -1;
        if (this.props.onPageScroll) {
            this.props.onPageScroll(this.orientation, direction);
        }
    }
    getCoord(event) {
        return this.orientation == VERTICAL ? event.pageY : event.pageX;
    }
    getThumbPosition() {
        return this.scrollPosToThumbPos(this.getScrollPos(), this.orientation, this.getThumbSize());
    }
    onThumbMouseDown(event) {
        event.preventDefault();
        event.stopPropagation();
        this.initialPos = this.getCoord(event);
        this.thumbSize = this.getThumbSize();
        this.initialThumbPos = this.getThumbPosition();
        this.setState({ active: true });
        global.addEventListener('mousemove', this.onMouseMove);
        global.addEventListener('mouseup', this.onMouseUp);
        this.props.onStartDrag(this.orientation);
    }
    onMouseMove(event) {
        const pos = this.getCoord(event);
        const diff = pos - this.initialPos;
        const scrollPos = this.thumbPosToScrollPos(this.initialThumbPos + diff, this.orientation, this.thumbSize);
        if (this.orientation == VERTICAL) {
            this.onScrollThumbScrollTop(scrollPos);
        }
        else {
            this.onScrollThumbScrollLeft(scrollPos);
        }
    }
    onScrollThumbScrollTop(scrollPos) {
        this.props.onScrollThumbScrollTop(scrollPos);
    }
    onScrollThumbScrollLeft(scrollPos) {
        this.props.onScrollThumbScrollLeft(scrollPos);
    }
    onMouseUp() {
        global.removeEventListener('mousemove', this.onMouseMove);
        global.removeEventListener('mouseup', this.onMouseUp);
        this.setState({ active: false });
        this.props.onStopDrag(this.orientation);
    }
    getThumbTransform(orientation = this.orientation, thumbSize = this.getThumbSize()) {
        let scrollPos = this.scrollPosToThumbPos(this.getScrollPos(), orientation, thumbSize) ||
            0;
        if (orientation == VERTICAL) {
            return `translate3d(0px, ${scrollPos}px, 0px)`;
        }
        if (this.props.rtl) {
            scrollPos = -scrollPos;
        }
        return `translate3d(${scrollPos}px, 0px, 0px)`;
    }
    thumbPosToScrollPos(thumbPos, orientation, thumbSize) {
        const { clientSize, scrollSize, trackSize } = this.props;
        const scrollPos = (thumbPos * (scrollSize - clientSize)) / (trackSize - thumbSize);
        return scrollPos;
    }
    scrollPosToThumbPos(scrollPos, orientation, thumbSize) {
        const { clientSize, scrollSize, trackSize } = this.props;
        const thumbPos = (scrollPos / (scrollSize - clientSize)) * (trackSize - thumbSize);
        return Math.floor(thumbPos);
    }
    getRatio() {
        return this.props.trackSize / this.props.clientSize;
    }
    getThumbSize() {
        const { scrollSize, clientSize } = this.props;
        /*
         * thumbSize   clientSize
         * --------- = --------
         * trackSize   scrollSize
         */
        let thumbSize = scrollSize ? (clientSize * clientSize) / scrollSize : 0;
        thumbSize *= this.getRatio();
        thumbSize = Math.max(thumbSize, this.props.scrollThumbMinSize);
        return thumbSize || 0;
    }
}
InovuaScrollbar.defaultProps = {
    onScrollThumbScrollTop: () => { },
    onScrollThumbScrollLeft: () => { },
    onStartDrag: () => { },
    onStopDrag: () => { },
    scrollThumbMargin: 2,
    scrollThumbMinSize: 10,
    showTrackOnDrag: false,
};
InovuaScrollbar.propTypes = {
    alwaysShowTrack: PropTypes.bool,
    autoHide: PropTypes.bool,
    clientSize: PropTypes.number,
    dragToScroll: PropTypes.bool,
    emptyScrollOffset: PropTypes.number,
    hideTransitionDuration: PropTypes.string,
    horizontal: PropTypes.bool,
    showTrackOnDrag: PropTypes.bool,
    onStartDrag: PropTypes.func,
    onStopDrag: PropTypes.func,
    onPageScroll: PropTypes.func,
    onScrollThumbScrollLeft: PropTypes.func,
    onScrollThumbScrollTop: PropTypes.func,
    onWheelScroll: PropTypes.func,
    oppositeVisible: PropTypes.bool,
    // true when the other scrollbar is also visible
    orientation: PropTypes.oneOf([VERTICAL, HORIZONTAL]),
    nativeScrollbarWidth: PropTypes.number.isRequired,
    scrollSize: PropTypes.number,
    scrollThumbMargin: PropTypes.number.isRequired,
    scrollThumbMinSize: PropTypes.number,
    scrollThumbOverWidth: PropTypes.number,
    scrollThumbRadius: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    scrollThumbStartEndRespectMargin: PropTypes.bool,
    scrollThumbStyle: PropTypes.shape({}),
    scrollThumbWidth: PropTypes.number,
    scrollTrackOverTransitionDuration: PropTypes.string,
    showTransitionDuration: PropTypes.string,
    size: PropTypes.number,
    trackSize: PropTypes.number,
    vertical: PropTypes.bool,
    visible: PropTypes.bool,
    rtl: PropTypes.bool,
};
