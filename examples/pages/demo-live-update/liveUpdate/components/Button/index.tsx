import React from 'react';

import { useAppState } from '../../hooks';

const Button = (props: any) => {
  const { theme } = useAppState();

  const className = [
    'configurator-button',
    theme ? `configurator-button--theme-${theme}` : '',
  ].join(' ');

  return <button className={className} {...props}></button>;
};

export default Button;
