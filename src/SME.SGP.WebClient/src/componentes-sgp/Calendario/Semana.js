﻿import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Base } from '~/componentes/colors';
import api from '~/servicos/api';

const Div = styled.div``;
const TipoEventosLista = styled(Div)`
  bottom: 5px;
  right: 10px;
`;
const TipoEvento = styled(Div)`
  font-size: 10px;
  margin-bottom: 2px;
  &:last-child {
    margin-bottom: 0;
  }
`;

const Dia = props => {
  const [estaAberto, setEstaAberto] = useState(false);
  const { dia, mesAtual, filtros, diaSelecionado } = props;
  const [tipoEventosDiaLista, setTipoEventosDiaLista] = useState([]);

  useEffect(() => {
    if (mesAtual && dia) {
      api
        .get(`v1/calendarios/eventos/meses/${mesAtual}/tipos`)
        .then(resposta => {
          if (resposta.data) {
            setTipoEventosDiaLista(
              resposta.data.filter(evento => evento.dia === dia.getDate())[0]
            );
          }
        });
    }
  }, [dia]);

  const selecionaDiaAberto = () => {};

  const style = {
    cursor: 'pointer',
    height: 62,
  };

  if (dia.getDay() === 0) style.backgroundColor = Base.RosaCalendario;
  else if (dia.getDay() === 6) style.backgroundColor = Base.CinzaCalendario;

  const className = `col border border-left-0 border-bottom-0 position-relative ${dia.getDay() ===
    6 && 'border-right-0'}`;

  let diaFormatado = dia.getDate();
  if (diaFormatado < 10) diaFormatado = `0${diaFormatado}`;

  const diaStyle = {
    color:
      mesAtual === dia.getMonth() + 1 ? Base.Preto : Base.CinzaDesabilitado,
    cursor: 'pointer',
    fontSize: '16px',
    top: 30,
  };

  return (
    <Div className={className} style={style} onClick={selecionaDiaAberto}>
      <Div className="w-100 h-100 d-flex">
        <Div className="position-relative" style={diaStyle}>
          {diaFormatado}
        </Div>
        {mesAtual === dia.getMonth() + 1 &&
          tipoEventosDiaLista &&
          tipoEventosDiaLista.tiposEvento && (
            <TipoEventosLista className="position-absolute">
              {tipoEventosDiaLista.tiposEvento.map(tipoEvento => {
                return (
                  <TipoEvento className="d-block badge badge-pill badge-light">
                    {tipoEvento}
                  </TipoEvento>
                );
              })}
            </TipoEventosLista>
          )}
      </Div>
    </Div>
  );
};

Dia.propTypes = {
  dia: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  mesAtual: PropTypes.number,
  filtros: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  diaSelecionado: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

Dia.defaultProps = {
  dia: {},
  mesAtual: 0,
  filtros: {},
  diaSelecionado: '',
};

const Semana = props => {
  const diaSelecionado = useSelector(
    state => state.calendarioEscolar.diaSelecionado
  );
  const { inicial, dias, mesAtual, filtros } = props;

  return (
    <Div>
      <Div className="w-100 d-flex">
        <Dia
          className={`${inicial ? '' : 'border-top-0'}`}
          dia={dias[0]}
          mesAtual={mesAtual}
          filtros={filtros}
          diaSelecionado={diaSelecionado}
        />
        <Dia
          className={`${inicial ? '' : 'border-top-0'}`}
          dia={dias[1]}
          mesAtual={mesAtual}
          filtros={filtros}
          diaSelecionado={diaSelecionado}
        />
        <Dia
          className={`${inicial ? '' : 'border-top-0'}`}
          dia={dias[2]}
          mesAtual={mesAtual}
          filtros={filtros}
          diaSelecionado={diaSelecionado}
        />
        <Dia
          className={`${inicial ? '' : 'border-top-0'}`}
          dia={dias[3]}
          mesAtual={mesAtual}
          filtros={filtros}
          diaSelecionado={diaSelecionado}
        />
        <Dia
          className={`${inicial ? '' : 'border-top-0'}`}
          dia={dias[4]}
          mesAtual={mesAtual}
          filtros={filtros}
          diaSelecionado={diaSelecionado}
        />
        <Dia
          className={`${inicial ? '' : 'border-top-0'}`}
          dia={dias[5]}
          mesAtual={mesAtual}
          filtros={filtros}
          diaSelecionado={diaSelecionado}
        />
        <Dia
          className={`${
            inicial ? 'border-right-0' : 'border-top-0 border-right-0'
          }`}
          dia={dias[6]}
          mesAtual={mesAtual}
          filtros={filtros}
          diaSelecionado={diaSelecionado}
        />
      </Div>
    </Div>
  );
};

Semana.propTypes = {
  inicial: PropTypes.bool,
  dias: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
  mesAtual: PropTypes.number,
  filtros: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

Semana.defaultProps = {
  inicial: false,
  dias: [],
  mesAtual: 0,
  filtros: {},
};

export default Semana;