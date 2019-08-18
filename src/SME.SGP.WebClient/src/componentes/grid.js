import React from 'react';
import PropTypes from 'prop-types';

const Grid = props => {
  const { cols, className, children } = props;
  return (
    <div className={`col-xl-${cols} col-sm-12 ${className}`}>{children}</div>
  );
};

Grid.propTypes = {
  cols: PropTypes.number,
  className: PropTypes.string,
  children: PropTypes.node,
};

Grid.defaultProps = {
  cols: 12,
  className: '',
};

export default Grid;
