﻿import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { store } from '~/redux';
import {
  selecionaMes,
  atribuiEventosMes,
} from '~/redux/modulos/calendarioEscolar/actions';
import { Base } from '~/componentes/colors';
import api from '~/servicos/api';

const Div = styled.div`
  ${props =>
    props.disabled &&
    `
    background: ${Base.CinzaBarras};
    opacity: 0.5;
    pointer-events: none;
  `}
`;
const Icone = styled.i`
  cursor: pointer;
`;

const Seta = props => {
  const { estaAberto } = props;

  return (
    <Icone
      className={`stretched-link fas ${
        estaAberto ? 'fa-chevron-down' : 'fa-chevron-right text-white'
      } `}
    />
  );
};

Seta.propTypes = {
  estaAberto: PropTypes.bool,
};

Seta.defaultProps = {
  estaAberto: false,
};

const Mes = props => {
  const { numeroMes, filtros } = props;
  const [mesSelecionado, setMesSelecionado] = useState({});

  const verificaMesAtual = () => {
    if (filtros && Object.entries(filtros).length > 0) {
      const { tipoCalendarioSelecionado = '' } = filtros;
      if (tipoCalendarioSelecionado) {
        const dataAtual = new Date();
        if (numeroMes === (dataAtual.getMonth() + 1).toString())
          store.dispatch(selecionaMes(numeroMes));
      } else store.dispatch(selecionaMes(0));
    }
  };

  useEffect(() => {
    verificaMesAtual();
  }, []);

  useEffect(() => {
    let estado = true;
    if (estado) {
      if (filtros && Object.entries(filtros).length > 0) {
        const {
          tipoCalendarioSelecionado = '',
          eventoSme = true,
          dreSelecionada = '',
          unidadeEscolarSelecionada = '',
        } = filtros;
        if (tipoCalendarioSelecionado) {
          api
            .get(
              `v1/calendarios/eventos/meses?EhEventoSme=${eventoSme}&${dreSelecionada &&
                `DreId=${dreSelecionada}&`}${tipoCalendarioSelecionado &&
                `IdTipoCalendario=${tipoCalendarioSelecionado}&`}${unidadeEscolarSelecionada &&
                `UeId=${unidadeEscolarSelecionada}`}`
            )
            .then(resposta => {
              if (resposta.data) {
                resposta.data.forEach(item => {
                  if (item && item.mes > 0)
                    store.dispatch(atribuiEventosMes(item.mes, item.eventos));
                });
              } else store.dispatch(atribuiEventosMes(numeroMes, 0));
            })
            .catch(() => {
              store.dispatch(atribuiEventosMes(numeroMes, 0));
            });
          verificaMesAtual();
        } else store.dispatch(atribuiEventosMes(numeroMes, 0));
      }
    }
    return () => (estado = false);
  }, [filtros]);

  const meses = useSelector(state => state.calendarioEscolar.meses);

  useEffect(() => {
    const mes = Object.assign({}, meses[numeroMes]);
    mes.style = { backgroundColor: Base.CinzaCalendario, color: Base.Preto };

    if (mes.estaAberto) {
      mes.chevronColor = Base.Branco;
      mes.className += ' border-bottom-0';
      mes.style = { color: Base.Preto };
    }

    if (mes.eventos > 0 && !mes.estaAberto)
      mes.chevronColor = Base.AzulCalendario;
    else if (mes.estaAberto) mes.chevronColor = Base.Branco;

    setMesSelecionado(mes);
  }, [meses]);

  const abrirMes = () => {
    if (filtros && Object.entries(filtros).length > 0) {
      const { tipoCalendarioSelecionado = '' } = filtros;
      if (tipoCalendarioSelecionado) store.dispatch(selecionaMes(numeroMes));
    }
  };

  return (
    <Div
      className="col-3 w-100 px-0"
      disabled={!mesSelecionado.estaAberto && mesSelecionado.eventos === 0}
    >
      <Div className={mesSelecionado.className}>
        <Div
          className="d-flex align-items-center justify-content-center position-relative"
          onClick={abrirMes}
          style={{
            backgroundColor: mesSelecionado.chevronColor,
            height: 75,
            width: 35,
          }}
        >
          <Seta estaAberto={mesSelecionado.estaAberto} />
        </Div>
        <Div
          className="d-flex align-items-center w-100"
          style={mesSelecionado.style}
        >
          <Div className="w-100 pl-2">{mesSelecionado.nome}</Div>
          <Div className="flex-shrink-1 d-flex align-items-center pr-3">
            <Div className="pr-2">{mesSelecionado.eventos}</Div>
            <Div>
              <Icone className="far fa-calendar-alt" />
            </Div>
          </Div>
        </Div>
      </Div>
    </Div>
  );
};

Mes.propTypes = {
  numeroMes: PropTypes.string,
  filtros: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

Mes.defaultProps = {
  numeroMes: '',
  filtros: {},
};

export default Mes;
