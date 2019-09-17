import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Button from '~/componentes/button';
import CampoTexto from '~/componentes/campoTexto';
import { Colors } from '~/componentes/colors';
import SelectComponent from '~/componentes/select';
import DataTable from '~/componentes/table/dataTable';
import notificacaoCategoria from '~/dtos/notificacaoCategoria';
import { confirmar } from '~/servicos/alertas';
import api from '~/servicos/api';
import history from '~/servicos/history';
import servicoNotificacao from '~/servicos/Paginas/ServicoNotificacao';

import { EstiloLista } from './estiloLista';

export default function NotificacoesLista() {
  const [idNotificacoesSelecionadas, setIdNotificacoesSelecionadas] = useState(
    []
  );
  const [listaNotificacoes, setListaNotificacoes] = useState([]);
  const [listaCategorias, setListaCategorias] = useState([]);
  const [listaStatus, setListaStatus] = useState([]);
  const [listaTipos, setTipos] = useState([]);

  const [turmaSelecionada, setTurmaSelecionada] = useState();
  const [statusSelecionado, setStatusSelecionado] = useState();
  const [categoriaSelecionada, setCategoriaSelecionada] = useState();
  const [tipoSelecionado, setTipoSelecionado] = useState();
  const [tituloSelecionado, setTituloSelecionado] = useState();
  const [codigoSelecionado, setCodigoSelecionado] = useState();
  const [desabilitarBotaoEditar, setDesabilitarBotaoEditar] = useState(true);
  const [desabilitarBotaoExcluir, setDesabilitarBotaoExcluir] = useState(true);
  const [desabilitarTurma, setDesabilitarTurma] = useState(true);

  const columns = [
    {
      title: 'Código',
      dataIndex: 'codigo',
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
    },
    {
      title: 'Título',
      dataIndex: 'titulo',
    },
    {
      title: 'Situação',
      dataIndex: 'descricaoStatus',
    },
    {
      title: 'Data/Hora',
      dataIndex: 'data',
    },
  ];

  const usuario = useSelector(store => store.usuario);

  useEffect(() => {
    async function carregarListas() {
      const status = await api.get('v1/notificacoes/status');
      setListaStatus(status.data);

      const categorias = await api.get('v1/notificacoes/categorias');
      setListaCategorias(categorias.data);

      const tipos = await api.get('v1/notificacoes/tipos');
      setTipos(tipos.data);
    }

    carregarListas();
  }, []);

  useEffect(() => {
    if (
      usuario &&
      usuario.turmaSelecionada &&
      usuario.turmaSelecionada.length
    ) {
      setDesabilitarTurma(false);
    } else {
      setDesabilitarTurma(true);
      setTurmaSelecionada('');
    }
    onClickFiltrar();
  }, [usuario.turmaSelecionada]);

  useEffect(() => {
    onClickFiltrar();
  }, [
    statusSelecionado,
    turmaSelecionada,
    categoriaSelecionada,
    tipoSelecionado,
    tituloSelecionado,
  ]);

  const listaSelectTurma = [
    { id: 1, descricao: 'Todas as turmas' },
    { id: 2, descricao: 'Turma selecionada' },
  ];

  function onSelectRow(ids) {
    if (ids && ids.length == 1) {
      setDesabilitarBotaoEditar(false);
    } else {
      setDesabilitarBotaoEditar(true);
    }

    if (ids && ids.length > 0) {
      const notifSelecionadas = listaNotificacoes.filter(noti => {
        return ids.includes(noti.id);
      });

      const categoriaDiferente = notifSelecionadas.find(
        item => item.categoria != notificacaoCategoria.Aviso
      );
      if (categoriaDiferente) {
        setDesabilitarBotaoExcluir(true);
      } else {
        setDesabilitarBotaoExcluir(false);
      }
    } else {
      setDesabilitarBotaoExcluir(true);
    }

    setIdNotificacoesSelecionadas(ids);
  }

  function onChangeTurma(turma) {
    setTurmaSelecionada(turma);
  }

  function onChangeStatus(status) {
    setStatusSelecionado(status);
  }

  function onChangeCategoria(categoria) {
    setCategoriaSelecionada(categoria);
  }

  function onChangeTitulo(titulo) {
    setTituloSelecionado(titulo.target.value);
  }

  function onChangeCodigo(codigo) {
    setCodigoSelecionado(codigo.target.value);
  }

  function onChangeTipo(tipo) {
    setTipoSelecionado(tipo);
  }

  function onClickEditar(id) {
    history.push(`/notificacoes/${id[0]}`);
  }

  async function onClickFiltrar() {
    const paramsQuery = {
      categoria: categoriaSelecionada,
      codigo: codigoSelecionado || null,
      status: statusSelecionado,
      tipo: tipoSelecionado,
      titulo: tituloSelecionado || null,
      usuarioId: '7208626', // TODO Mock
    };
    if (usuario.turmaSelecionada && usuario.turmaSelecionada.length) {
      paramsQuery.ano = usuario.turmaSelecionada[0].ano;
      paramsQuery.dreId = usuario.turmaSelecionada[0].codDre;
      paramsQuery.ueId = usuario.turmaSelecionada[0].codEscola;
    }
    if (
      usuario.turmaSelecionada &&
      usuario.turmaSelecionada.length &&
      !desabilitarTurma
    ) {
      paramsQuery.turmaId = usuario.turmaSelecionada[0].codEscola;
    }
    const listaNotifi = await api.get('v1/notificacoes', {
      params: paramsQuery,
    });
    setListaNotificacoes(listaNotifi.data);
    setIdNotificacoesSelecionadas([]);
  }

  function marcarComoLida() {
    servicoNotificacao.marcarComoLida(idNotificacoesSelecionadas, () =>
      onClickFiltrar()
    );
  }

  async function excluir() {
    const confirmado = await confirmar(
      'Atenção',
      'Você tem certeza que deseja excluir estas notificações?'
    );
    if (confirmado) {
      servicoNotificacao.excluir(idNotificacoesSelecionadas, () => {
        onClickFiltrar();
        setIdNotificacoesSelecionadas([]);
      });
    }
  }

  return (
    <>
      <Cabecalho pagina="Notificações" />
      <EstiloLista>
        <div className="col-md-6 pb-3">
          <CampoTexto
            placeholder="Título"
            onChange={onChangeTitulo}
            value={tituloSelecionado}
          />
        </div>
        <div className="col-md-6 pb-3">
          <CampoTexto
            placeholder="Código"
            onChange={onChangeCodigo}
            value={codigoSelecionado}
          />
        </div>
        <div className="col-md-3 pb-3">
          <SelectComponent
            name="turma-noti"
            id="turma-noti"
            lista={listaSelectTurma}
            valueOption="id"
            valueText="descricao"
            onChange={onChangeTurma}
            valueSelect={turmaSelecionada || []}
            placeholder="Turma"
            disabled={desabilitarTurma}
          />
        </div>
        <div className="col-md-3 pb-3">
          <SelectComponent
            name="status-noti"
            id="status-noti"
            lista={listaStatus}
            valueOption="id"
            valueText="descricao"
            onChange={onChangeStatus}
            valueSelect={statusSelecionado || []}
            placeholder="Filtrar por"
          />
        </div>
        <div className="col-md-3 pb-3">
          <SelectComponent
            name="categoria-noti"
            id="categoria-noti"
            lista={listaCategorias}
            valueOption="id"
            valueText="descricao"
            onChange={onChangeCategoria}
            valueSelect={categoriaSelecionada || []}
            placeholder="Categoria"
          />
        </div>
        <div className="col-md-3 pb-3">
          <SelectComponent
            name="tipo-noti"
            id="tipo-noti"
            lista={listaTipos}
            valueOption="id"
            valueText="descricao"
            onChange={onChangeTipo}
            valueSelect={tipoSelecionado || []}
            placeholder="Tipo"
          />
        </div>
        <div className="col-md-12 ">
          <Button
            label="Excluir"
            color={Colors.Vermelho}
            border
            className="mb-2 ml-2 float-right"
            onClick={excluir}
            disabled={desabilitarBotaoExcluir}
          />
          <Button
            label="Marcar como lida"
            color={Colors.Azul}
            border
            className="mb-2 ml-2 float-right"
            onClick={marcarComoLida}
          />
          <Button
            label="Editar"
            color={Colors.Azul}
            border
            className="mb-2 float-right"
            onClick={onClickEditar}
            disabled={desabilitarBotaoEditar}
          />
        </div>
        <div className="col-md-12 pt-2">
          <DataTable
            id="lista-notificacoes"
            selectedRowKeys={idNotificacoesSelecionadas}
            onSelectRow={onSelectRow}
            columns={columns}
            dataSource={listaNotificacoes}
            selectMultipleRows
          />
        </div>
      </EstiloLista>
    </>
  );
}
