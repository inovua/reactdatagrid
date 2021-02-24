/**
 * Copyright © INOVUA TRADING.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

import ReactDOM from 'react-dom';
import { ReactNode, cloneElement, MutableRefObject } from 'react';

import { TypeComputedProps } from '../../types';

export default (
  menu: ReactNode,
  computedProps: TypeComputedProps,
  menusRef?: MutableRefObject<any[]>
) => {
  const { menuPortalContainer } = computedProps;

  const didMount = menu ? menu.props.componentDidMount : null;
  const willUnmount = menu ? menu.props.componentWillUnmount : null;

  if (menu) {
    menu = cloneElement(menu, {
      rtl: computedProps.rtl,
      componentDidMount: (...args: any[]) => {
        if (didMount) {
          didMount(...args);
        }

        menusRef = menusRef || computedProps.menusRef;

        const menuInstance = args[0];
        menusRef!.current.push(menuInstance);
      },
      componentWillUnmount: (...args: any[]) => {
        if (willUnmount) {
          willUnmount(...args);
        }
        const menuInstance = args[0];

        menusRef = menusRef || computedProps.menusRef;
        menusRef!.current = menusRef!.current.filter(it => it !== menuInstance);
      },
    });
  }

  if (menuPortalContainer && ReactDOM.createPortal) {
    let container: string | Element | null = menuPortalContainer;
    if (typeof container === 'string') {
      container = document.querySelector(container);
    }
    if (container) {
      return ReactDOM.createPortal(menu, container as Element);
    }
  }
  return menu;
};
