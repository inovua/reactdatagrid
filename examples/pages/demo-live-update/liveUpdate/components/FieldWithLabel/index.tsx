import React from 'react';

import Label from '../Label';
import Button from '../Button';
import Select from '../Select';

const FieldWithLabel = (props: any) => {
  const renderChildren = () => {
    if (props.type === 'button') {
      const spinner = <span className="spinner"></span>;

      return (
        <Button
          style={{ ...props.buttonStyle, width: '100%', height: 36 }}
          onClick={props.onClick}
          disabled={props.disabled}
        >
          {props.loading ? spinner : props.children}
        </Button>
      );
    }

    if (props.type === 'select') {
      return (
        <Select
          style={{
            ...props.selectStyle,
            minWidth: 110,
            maxWidth: 110,
            height: 36,
          }}
          disabled={props.disabled}
          dataSource={props.selectData}
          value={props.selectValue}
          onChange={props.onSelectChange}
        />
      );
    }
  };

  return (
    <div className="field-with-label-wrapper">
      {props.label ? <Label>{props.label}</Label> : null}
      {renderChildren()}
    </div>
  );
};

export default FieldWithLabel;
