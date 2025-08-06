// CheckboxWithTick.jsx
import React from 'react';

const CheckboxWithTick = ({ value }) => {
  return (
    <span
      style={{
        display: 'inline-block',
        width: '15px',
        height: '15px',
        border: '1px solid black',
        textAlign: 'center',
        lineHeight: '15px',
        fontSize: '16px',
        fontWeight: 'bold',
        marginRight: '8px',
      }}
    >
      {value === 'Y' ? '✓' : ''}
    </span>
  );
};

export default CheckboxWithTick;
