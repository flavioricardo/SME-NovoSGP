import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import * as Yup from 'yup';
import Cabecalho from '~/componentes-sgp/cabecalho';
import Button from '~/componentes/button';
import CampoTexto from '~/componentes/campoTexto';
import { Colors } from '~/componentes/colors';
import ModalConteudoHtml from '~/componentes/modalConteudoHtml';
import SelectComponent from '~/componentes/select';
import DataTable from '~/componentes/table/dataTable';
import { confirmar, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';

import Card from '../../../componentes/card';
import history from '~/servicos/history';
import { URL_HOME } from '~/constantes/url';
import { store } from '~/redux';
import RotasDto from '~/dtos/rotasDto';
import { verificaSomenteConsulta } from '~/servicos/servico-navegacao';

export default function ReiniciarSenha() {
  const [linhaSelecionada, setLinhaSelecionada] = useState({});
  const [listaUsuario, setListaUsuario] = useState([]);

  const [listaDres, setListaDres] = useState([]);
  const [dreSelecionada, setDreSelecionada] = useState('');
  const [listaUes, setListaUes] = useState([]);
  const [ueSelecionada, setUeSelecionada] = useState('');
  const [nomeUsuarioSelecionado, setNomeUsuarioSelecionado] = useState('');
  const [rfSelecionado, setRfSelecionado] = useState('');
  const [emailUsuarioSelecionado, setEmailUsuarioSelecionado] = useState('');
  const [exibirModalReiniciarSenha, setExibirModalReiniciarSenha] = useState(
    false
  );
  const [semEmailCadastrado, setSemEmailCadastrado] = useState(false);
  const [refForm, setRefForm] = useState();

  const usuario = store.getState().usuario;
  const permissoesTela = usuario.permissoes[RotasDto.REINICIAR_SENHA];

  const [validacoes] = useState(
    Yup.object({
      emailUsuario: Yup.string()
        .email('Digite um e-mail válido.')
        .required('E-mail é obrigatório'),
    })
  );

  const colunas = [
    {
      title: 'Nome do usuário',
      dataIndex: 'nomeServidor',
      width: '66%',
    },
    {
      title: 'Registro Funcional (RF)',
      dataIndex: 'codigoRf',
      width: '30%',
    },
    {
      title: 'Ação',
      dataIndex: 'acaoReiniciar',
      width: '3%',
      render: (texto, linha) => {
        return (
          <div className="botao-reiniciar-tabela-acao">
            <Button
              label="Reiniciar"
              color={Colors.Roxo}
              disabled={!permissoesTela.podeAlterar}
              border
              className="ml-2 text-center"
              onClick={() => onClickReiniciar(linha)}
            />
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    const carregarDres = async () => {
      const dres = await api.get('v1/dres');
      setListaDres(dres.data);
    };
    carregarDres();

    verificaSomenteConsulta(permissoesTela);
  }, []);

  const onClickVoltar = () => history.push(URL_HOME);

  const onChangeDre = dre => {
    setDreSelecionada(dre);
    setUeSelecionada([]);
    setListaUes([]);
    if (dre) {
      carregarUes(dre);
    }
  };

  const onChangeUe = ue => {
    setUeSelecionada(ue);
  };

  const onChangeNomeUsuario = nomeUsuario => {
    setNomeUsuarioSelecionado(nomeUsuario.target.value);
  };

  const onChangeRf = rf => {
    setRfSelecionado(rf.target.value);
  };

  const carregarUes = async dre => {
    const ues = await api.get(`/v1/dres/${dre}/ues`);
    setListaUes(ues.data || []);
  };

  const onClickFiltrar = async () => {
    if (!permissoesTela.podeConsultar) return;

    if (ueSelecionada) {
      const parametrosPost = {
        codigoUE: ueSelecionada,
        nomeServidor: nomeUsuarioSelecionado,
        codigoRF: rfSelecionado,
      };
      const lista = await api
        .post(
          `v1/unidades-escolares/${ueSelecionada}/funcionarios`,
          parametrosPost
        )
        .catch(() => {
          setListaUsuario([]);
        });
      if (lista && lista.data) {
        setListaUsuario([]);
        setListaUsuario(lista.data);
      } else {
        setListaUsuario([]);
      }
    } else {
      setListaUsuario([]);
    }
  };

  const onClickReiniciar = async linha => {
    if (!permissoesTela.podeAlterar) return;

    setLinhaSelecionada(linha);
    const confirmou = await confirmar(
      'Reiniciar Senha',
      '',
      'Deseja realmente reiniciar essa senha?',
      'Reiniciar',
      'Cancelar'
    );
    if (confirmou) {
      reiniciarSenha(linha);
    }
  };

  const reiniciarSenha = async linha => {
    let deveAtualizarEmail = false;
    await api
      .put(`v1/autenticacao/${linha.codigoRf}/reiniciar-senha`)
      .catch(error => {
        if (error && error.response && error.response.data) {
          deveAtualizarEmail = error.response.data.deveAtualizarEmail;
        }
      });
    if (deveAtualizarEmail) {
      setEmailUsuarioSelecionado('');
      setSemEmailCadastrado(true);
      setExibirModalReiniciarSenha(true);
    } else {
      setSemEmailCadastrado(false);
      sucesso(
        `Senha do usuário ${linha.nomeServidor} foi reiniciada com sucesso.`
      );
      onClickFiltrar();
    }
  };

  const onConfirmarReiniciarSenha = async form => {
    const parametro = { novoEmail: form.emailUsuario };
    await api.put(`v1/usuarios/${linhaSelecionada.codigoRf}/email`, parametro);
    onCloseModalReiniciarSenha();
    reiniciarSenha(linhaSelecionada);
    refForm.resetForm();
  };

  const onCancelarReiniciarSenha = () => {
    onCloseModalReiniciarSenha();
  };

  const onCloseModalReiniciarSenha = () => {
    setExibirModalReiniciarSenha(false);
    setSemEmailCadastrado(false);
    refForm.resetForm();
  };

  const validaSeTemEmailCadastrado = () => {
    return semEmailCadastrado
      ? `Este usuário não tem e-mail cadastrado, para seguir com
     o processo de reinicio da senha é obrigatório informar um e-mail válido.`
      : null;
  };

  return (
    <>
      <Cabecalho pagina="Reiniciar senha" />
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
        </div>
        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 pb-2">
          <SelectComponent
            name="dre-reiniciar-senha"
            id="dre-reiniciar-senha"
            lista={listaDres}
            disabled={!permissoesTela.podeConsultar}
            valueOption="id"
            valueText="nome"
            onChange={onChangeDre}
            valueSelect={dreSelecionada || []}
            label="Diretoria Regional de Educação (DRE)"
            placeholder="Diretoria Regional de Educação (DRE)"
          />
        </div>
        <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 pb-2">
          <SelectComponent
            name="ues-list"
            id="ues-list"
            lista={listaUes}
            disabled={!permissoesTela.podeConsultar}
            valueOption="codigo"
            valueText="nome"
            onChange={onChangeUe}
            valueSelect={ueSelecionada || []}
            label="Unidade Escolar (UE)"
            placeholder="Unidade Escolar (UE)"
          />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-6 col-xl-6 pb-3">
          <CampoTexto
            label="Nome do usuário"
            placeholder="Nome do usuário"
            onChange={onChangeNomeUsuario}
            desabilitado={!permissoesTela.podeConsultar}
            value={nomeUsuarioSelecionado}
          />
        </div>
        <div className="col-sm-12 col-md-6 col-lg-4 col-xl-5 pb-3">
          <CampoTexto
            label="Registro Funcional (RF)"
            placeholder="Registro Funcional (RF)"
            onChange={onChangeRf}
            desabilitado={!permissoesTela.podeConsultar}
            value={rfSelecionado}
          />
        </div>
        <div className="col-sm-12 col-md-12 col-lg-2 col-xl-1 pb-3">
          <Button
            label="Filtrar"
            color={Colors.Azul}
            disabled={!permissoesTela.podeConsultar}
            border
            className="text-center d-block mt-4 float-right w-100"
            onClick={onClickFiltrar}
          />
        </div>

        <div className="col-md-12 pt-4">
          <DataTable
            rowKey="codigoRf"
            columns={colunas}
            dataSource={listaUsuario}
          />
        </div>
      </Card>

      <Formik
        ref={refFormik => setRefForm(refFormik)}
        enableReinitialize
        initialValues={{
          emailUsuario: emailUsuarioSelecionado,
        }}
        validationSchema={validacoes}
        onSubmit={values => onConfirmarReiniciarSenha(values)}
        validateOnChange
        validateOnBlur
      >
        {form => (
          <Form>
            <ModalConteudoHtml
              key="reiniciarSenha"
              visivel={exibirModalReiniciarSenha}
              onConfirmacaoPrincipal={() => {
                form.validateForm().then(() => form.handleSubmit(e => e));
              }}
              onConfirmacaoSecundaria={() => onCancelarReiniciarSenha()}
              onClose={onCloseModalReiniciarSenha}
              labelBotaoPrincipal="Cadastrar e reiniciar"
              tituloAtencao={semEmailCadastrado ? 'Atenção' : null}
              perguntaAtencao={validaSeTemEmailCadastrado()}
              labelBotaoSecundario="Cancelar"
              titulo="Reiniciar Senha"
              closable={false}
            >
              <b> Deseja realmente reiniciar essa senha? </b>

              <CampoTexto
                label="E-mail"
                name="emailUsuario"
                form={form}
                maxlength="50"
              />
            </ModalConteudoHtml>
          </Form>
        )}
      </Formik>
    </>
  );
}
