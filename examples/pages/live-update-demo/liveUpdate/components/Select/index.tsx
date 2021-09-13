import React from 'react';

import { useAppState } from '../../hooks';

const Select = (props: any) => {
  const { theme } = useAppState();

  const onChange = event => {
    const value = event.target.value * 1;
    props.onChange(value);
  };

  const className = [
    'configurator-select',
    theme ? `configurator-select--theme-${theme}` : '',
  ].join(' ');

  const style = { ...props.style };

  return (
    <select
      className={className}
      style={style}
      disabled={props.disabled}
      value={props.value * 1}
      onChange={onChange}
    >
      {(props.dataSource || []).map(
        (option: { id: number; label: string }, index: number) => {
          return (
            <option key={index} value={option.id}>
              {option.label}
            </option>
          );
        }
      )}
    </select>
  );
};

export default Select;
