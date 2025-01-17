import { Form, Formik } from 'formik';
import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import * as Yup from 'yup';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Button from '~/componentes/button';
import { CampoData, momentSchema } from '~/componentes/campoData/campoData';
import CampoTexto from '~/componentes/campoTexto';
import Card from '~/componentes/card';
import { Colors } from '~/componentes/colors';
import ListaPaginada from '~/componentes/listaPaginada/listaPaginada';
import SelectComponent from '~/componentes/select';
import { URL_HOME } from '~/constantes/url';
import RotasDto from '~/dtos/rotasDto';
import { confirmar, erros, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import history from '~/servicos/history';
import servicoEvento from '~/servicos/Paginas/Calendario/ServicoEvento';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';

const EventosLista = () => {
  const usuario = useSelector(store => store.usuario);
  const permissoesTela = usuario.permissoes[RotasDto.EVENTOS];

  const [somenteConsulta, setSomenteConsulta] = useState(false);

  const [listaCalendarioEscolar, setListaCalendarioEscolar] = useState([]);
  const [nomeEvento, setNomeEvento] = useState('');
  const [listaTipoEvento, setListaTipoEvento] = useState([]);
  const [tipoEvento, setTipoEvento] = useState(undefined);
  const [eventosSelecionados, setEventosSelecionados] = useState([]);
  const [filtro, setFiltro] = useState({});
  const [selecionouCalendario, setSelecionouCalendario] = useState(false);

  const [refForm, setRefForm] = useState();
  const [valoresIniciais] = useState({
    tipoCalendarioId: undefined,
    dataInicio: '',
    dataFim: '',
  });
  const [validacoes] = useState(
    Yup.object({
      dataInicio: momentSchema.test(
        'validaInicio',
        'Data obrigatória',
        function() {
          const { dataInicio } = this.parent;
          const { dataFim } = this.parent;
          if (!dataInicio && dataFim) {
            return false;
          }
          return true;
        }
      ),
      dataFim: momentSchema.test('validaFim', 'Data obrigatória', function() {
        const { dataInicio } = this.parent;
        const { dataFim } = this.parent;
        if (dataInicio && !dataFim) {
          return false;
        }
        return true;
      }),
    })
  );

  const colunas = [
    {
      title: 'Nome do evento',
      dataIndex: 'nome',
      width: '45%',
    },
    {
      title: 'Tipo de evento',
      dataIndex: 'tipo',
      width: '20%',
      render: (text, row) => <span> {row.tipoEvento.descricao}</span>,
    },
    {
      title: 'Data início',
      dataIndex: 'dataInicio',
      width: '15%',
      render: data => formatarCampoDataGrid(data),
    },
    {
      title: 'Data fim',
      dataIndex: 'dataFim',
      width: '15%',
      render: data => formatarCampoDataGrid(data),
    },
  ];

  useEffect(() => {
    const obterListaEventos = async () => {
      const tiposEvento = await api.get('v1/calendarios/eventos/tipos/listar');
      if (tiposEvento && tiposEvento.data && tiposEvento.data.items) {
        setListaTipoEvento(tiposEvento.data.items);
      } else {
        setListaTipoEvento([]);
      }
    };

    const consultaTipoCalendario = async () => {
      const tiposCalendario = await api.get('v1/calendarios/tipos');
      if (
        tiposCalendario &&
        tiposCalendario.data &&
        tiposCalendario.data.length
      ) {
        tiposCalendario.data.map(item => {
          item.id = String(item.id);
          item.descricaoTipoCalendario = `${item.anoLetivo} - ${item.nome} - ${item.descricaoPeriodo}`;
        });
        setListaCalendarioEscolar(tiposCalendario.data);
      } else {
        setListaCalendarioEscolar([]);
      }
    };
    setSomenteConsulta(verificaSomenteConsulta(permissoesTela));

    obterListaEventos();

    consultaTipoCalendario();
  }, []);

  useEffect(() => {
    validaFiltrar();
  }, [nomeEvento, tipoEvento]);

  const formatarCampoDataGrid = data => {
    let dataFormatada = '';
    if (data) {
      dataFormatada = moment(data).format('DD/MM/YYYY');
    }
    return <span> {dataFormatada}</span>;
  };

  const onClickVoltar = () => {
    history.push(URL_HOME);
  };

  const onClickExcluir = async () => {
    if (eventosSelecionados && eventosSelecionados.length > 0) {
      const listaNomeExcluir = eventosSelecionados.map(item => item.nome);
      const confirmado = await confirmar(
        'Excluir evento',
        listaNomeExcluir,
        `Deseja realmente excluir ${
          eventosSelecionados.length > 1 ? 'estes eventos' : 'este evento'
        }?`,
        'Excluir',
        'Cancelar'
      );
      if (confirmado) {
        const idsDeletar = eventosSelecionados.map(c => c.id);
        const excluir = await servicoEvento
          .deletar(idsDeletar)
          .catch(e => erros(e));
        if (excluir && excluir.status == 200) {
          const mensagemSucesso = `${
            eventosSelecionados.length > 1
              ? 'Eventos excluídos'
              : 'Evento excluído'
          } com sucesso.`;
          sucesso(mensagemSucesso);
          validaFiltrar();
        }
      }
    }
  };

  const onClickNovo = () => {
    const calendarioId = refForm.getFormikContext().values.tipoCalendarioId;
    history.push(`eventos/novo/${calendarioId}`);
  };

  const onChangeNomeEvento = e => {
    setNomeEvento(e.target.value);
  };

  const onChangeTipoEvento = tipoEvento => {
    setTipoEvento(tipoEvento);
  };

  const onFiltrar = valoresForm => {
    const params = {
      tipoCalendarioId: valoresForm.tipoCalendarioId,
      nomeEvento,
      tipoEventoId: tipoEvento,
      dataInicio: valoresForm.dataInicio,
      dataFim: valoresForm.dataFim,
    };
    setFiltro(params);
    setEventosSelecionados([]);
  };

  const onChangeCalendarioId = tipoCalendarioId => {
    if (tipoCalendarioId) {
      setSelecionouCalendario(true);
    } else {
      setSelecionouCalendario(false);
      setTipoEvento('');
      setNomeEvento('');
      refForm.resetForm();
    }
    validaFiltrar();
  }; 

  const validaFiltrar = () => {
    if (refForm) {
      refForm.validateForm().then(() => refForm.handleSubmit(e => e));
    }
  };

  const onClickEditar = evento => {
    history.push(`eventos/editar/${evento.id}`);
  };

  const onSelecionarItems = items => {
    setEventosSelecionados(items);
  };

  return (
    <>
      <Cabecalho pagina="Evento do Calendário Escolar" />
      <Card>
        <div className="col-md-12 d-flex justify-content-end pb-4">
          <Button
            label="Voltar"
            icon="arrow-left"
            color={Colors.Azul}
            border
            className="mr-2"
            onClick={onClickVoltar}
          />
          <Button
            label="Excluir"
            color={Colors.Vermelho}
            border
            className="mr-2"
            onClick={onClickExcluir}
            disabled={!permissoesTela.podeExcluir || (eventosSelecionados && eventosSelecionados.length < 1) }
            hidden={!selecionouCalendario}
          />
          <Button
            label="Novo"
            color={Colors.Roxo}
            border
            bold
            className="mr-2"
            onClick={onClickNovo}
            hidden={!selecionouCalendario}
            disabled={somenteConsulta || !permissoesTela.podeIncluir}
          />
        </div>

        <Formik
          ref={refFormik => setRefForm(refFormik)}
          enableReinitialize
          initialValues={valoresIniciais}
          validationSchema={validacoes}
          onSubmit={valores => onFiltrar(valores)}
          validateOnChange
          validateOnBlur
        >
          {form => (
            <Form className="col-md-12 mb-4">
              <div className="row">
                <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 pb-2">
                  <SelectComponent
                    name="tipoCalendarioId"
                    id="select-tipo-calendario"
                    lista={listaCalendarioEscolar}
                    valueOption="id"
                    valueText="descricaoTipoCalendario"
                    onChange={onChangeCalendarioId}
                    placeholder="Selecione um calendário"
                    form={form}
                  />
                </div>
                <div className="col-sm-12 col-md-3 col-lg-3 col-xl-3 pb-2">
                  <CampoTexto
                    placeholder="Digite o nome do evento"
                    onChange={onChangeNomeEvento}
                    value={nomeEvento}
                    desabilitado={!selecionouCalendario}
                  />
                </div>
                <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 pb-2">
                  <SelectComponent
                    name="select-tipo-evento"
                    id="select-tipo-evento"
                    lista={listaTipoEvento}
                    valueOption="id"
                    valueText="descricao"
                    onChange={onChangeTipoEvento}
                    valueSelect={tipoEvento || undefined}
                    placeholder="Selecione um tipo"
                    disabled={!selecionouCalendario}
                  />
                </div>

                <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 pb-2">
                  <CampoData
                    formatoData="DD/MM/YYYY"
                    name="dataInicio"
                    onChange={validaFiltrar}
                    placeholder="Data início"
                    form={form}
                    desabilitado={!selecionouCalendario}
                  />
                </div>
                <div className="col-sm-12 col-md-2 col-lg-2 col-xl-2 pb-2">
                  <CampoData
                    formatoData="DD/MM/YYYY"
                    name="dataFim"
                    onChange={validaFiltrar}
                    placeholder="Data fim"
                    form={form}
                    desabilitado={!selecionouCalendario}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
        <div className="col-md-12 pt-2">
          {
            selecionouCalendario ?
              <ListaPaginada
                url="v1/calendarios/eventos"
                id="lista-eventos"
                colunaChave="id"
                colunas={colunas}
                filtro={filtro}
                onClick={onClickEditar}
                multiSelecao
                selecionarItems={onSelecionarItems}
              /> : ''
          }
        </div>
      </Card>
    </>
  );
};

export default EventosLista;
