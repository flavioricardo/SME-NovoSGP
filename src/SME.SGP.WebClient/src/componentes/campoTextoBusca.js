import React from 'react';
import styled from 'styled-components';

import { Input } from 'antd';

const { Search } = Input;

const Campo = styled.div`
  .ant-input {
    height: 38px;
  }
`;

const CampoTextoBusca = ({
  placeholder,
  value,
  desabilitado,
  onSearch,
  onChange,
  onKeyDown,
  type
}) => {
  return (
    <>
      <Campo>
        <Search
          onChange={onChange}
          placeholder={placeholder}
          onSearch={onSearch}
          disabled={desabilitado}
          value={value}
          type={type && type}
          onKeyDown={onKeyDown}
        />
      </Campo>
    </>
  );
};
export default CampoTextoBusca;
