import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { AutoComplete } from 'antd';
import { Base } from './colors';
import Label from './label';

const { Option } = AutoComplete;

const Container = styled.div`
  .ant-select-arrow {
    color: ${Base.CinzaMako};
  }
  .ant-select-selection--single {
    align-items: center;
    display: flex;
  }

  .ant-select-selection__rendered {
    width: 100%;
  }
  .ant-select-selection__placeholder {
    display: block;
  }
  .ant-select-selection-selected-value {
    font-weight: bold;
  }
  .ant-select-auto-complete.ant-select .ant-input {
    height: 38px;
    line-height: 1.5;
    background: transparent;
    border-width: 1px;
  }
`;

const SelectAutocomplete = ({
  lista,
  placeholder,
  textField,
  valueField,
  className,
  label,
  name,
  id,
  onChange,
  onSelect,
  value,
  filtro,
}) => {
  const [itensFiltrados, setItensFiltrados] = useState(lista);

  const filtrar = value => {
    if (value) {
      const textoFiltro = value.toLowerCase();
      const dadosFiltrados = lista
        ? lista.filter(item => filtro(item, textoFiltro))
        : [];
      setItensFiltrados(dadosFiltrados);
    } else {
      setItensFiltrados([]);
    }
  };

  useEffect(() => {
    if (!value) {
      setItensFiltrados([]);
    } else {
      filtrar(value);
    }
  }, [value]);

  const opcoes = itensFiltrados.map(item => (
    <Option key={item[valueField]}>{item[textField]}</Option>
  ));

  return (
    <Container>
      <Label text={label} control={name} />
      <AutoComplete
        className={className}
        onSearch={filtrar}
        placeholder={placeholder}
        name={name}
        onChange={onChange}
        onSelect={onSelect}
        id={id}
        value={value}
      >
        {opcoes}
      </AutoComplete>
    </Container>
  );
};

export default SelectAutocomplete;
