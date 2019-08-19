import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Alert from '../../../componentes/alert';
import { sucesso, erro } from '../../../servicos/alertas';

import Button from '../../../componentes/button';
import SelectComponent from '../../../componentes/select';
import TextEditor from '../../../componentes/textEditor';
import { Colors, Base } from '../../../componentes/colors';
import history from '../../../servicos/history';

import api from '../../../servicos/api';

const BtnLink = styled.div`
  color: #686868;
  font-family: Roboto, FontAwesome;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  cursor: pointer;
  i {
    background-color: ${Base.Roxo};
    border-radius: 3px;
    color: white;
    font-size: 8px;
    padding: 2px;
    margin-left: 3px;
    position: absolute;
    margin-top: 3px;
  }
`;

const ListaItens = styled.div`
  ul {
    list-style: none;
    columns: 2;
    -webkit-columns: 2;
    -moz-columns: 2;
  }

  li {
    margin-bottom: 5px;
  }

  font-size: 12px;
  color: #42474a;

  .btn-li-item {
    width: 30px;
    height: 30px;
    border: solid 0.8px ${Base.AzulAnakiwa};
    display: inline-block;
    font-weight: bold;
    margin-right: 5px;
    text-align: center;
  }

  .btn-li-item-matriz {
    border-radius: 50%;
  }

  .btn-li-item-ods {
    border-radius: 0.25rem !important;
  }
`;

const Badge = styled.span`
  cursor: pointer;
  padding-top: 5.5px;

  &[opcao-selecionada='true'] {
    background: ${Base.AzulAnakiwa} !important;
  }
`;

const TextArea = styled.div`
  textarea {
    height: 600px !important;
  }
`;

const InseridoAlterado = styled.div`
  object-fit: contain;
  font-weight: bold;
  font-style: normal;
  font-size: 10px;
  color: #42474a;
  p {
    margin: 0px;
  }
`;

export default function PlanoCiclo(props) {
  const { match } = props;

  const urlPrefeitura = 'https://curriculo.prefeitura.sp.gov.br';
  const urlMatrizSaberes = `${urlPrefeitura}/matriz-de-saberes`;
  const urlODS = `${urlPrefeitura}/ods`;

  const [listaMatriz, setListaMatriz] = useState([]);
  const [listaODS, setListaODS] = useState([]);
  const [listaCiclos, setListaCiclos] = useState([]);
  let [listaMatrizSelecionda, setListaMatrizSelecionda] = useState([]);
  let [listaODSSelecionado, setListaODSSelecionado] = useState([]);
  const [cicloSelecionado, setCicloSelecionado] = useState('1');
  const [descricaoCiclo, setDescricaoCiclo] = useState('');
  const [parametrosRota, setParametrosRota] = useState({ id: 0 });
  const [inseridoPor, setInseridoPor] = useState('ELISANGELA DOS SANTOS');
  const [dataInseridoPor, setDataInseridoPor] = useState('02/05/2019 às 20:28');
  const [alteradoPor, setAlteradoPor] = useState('JOÃO DA SILVA');
  const [dataAlteradoPor, setDataAlteradoPor] = useState('02/05/2019 às 20:28');
  const [anoCiclo, setAnoCiclo] = useState(2019); // TODO Remover

  useEffect(() => {
    async function obterCicloExistente() {
      if (
        true
        // match.params &&
        // match.params.ano &&
        // match.params.cicloId &&
        // match.params.escolaId
      ) {
        // const ciclo = await api.get(
        //   `v1/planos-ciclo/${match.params.ano}/${match.params.cicloId}/${match.params.escolaId}`
        // );
        const ciclo = {
          data: {
            cicloId: 1,
            descricao: 'NOVA DESCRICAO',
            id: 37,
            idsMatrizesSaber: [1, 2, 3, 4, 5],
            idsObjetivosDesenvolvimentoSustentavel: [1, 2, 3, 4, 5, 6, 7, 8, 9],
          },
        };

        if (ciclo && ciclo.data) {
          setParametrosRota({
            id: ciclo.data.id,
            ano: match.params.ano,
            cicloId: match.params.cicloId,
            escolaId: match.params.escolaId,
          });
          if (
            ciclo.data.idsMatrizesSaber &&
            ciclo.data.idsMatrizesSaber.length
          ) {
            ciclo.data.idsMatrizesSaber.forEach(id => {
              document.getElementById(`matriz-${id}`).click();
            });
          }
          if (
            ciclo.data.idsObjetivosDesenvolvimentoSustentavel &&
            ciclo.data.idsObjetivosDesenvolvimentoSustentavel.length
          ) {
            ciclo.data.idsObjetivosDesenvolvimentoSustentavel.forEach(id => {
              document.getElementById(`ods-${id}`).click();
            });
          }

          setDescricaoCiclo(ciclo.data.descricao);
          setCicloSelecionado(String(ciclo.data.cicloId));
        }
      } else if (match.params && match.params.ano) {
        setAnoCiclo(match.params.ano);
      }
    }

    function obterSugestaoCiclo() {
      // TODO - Setar o ciclo quando tiver uma sugestão!
      // setCicloSelecionado('2');
    }

    async function carregarListas() {
      const matrizes = await api.get('v1/matrizes-saber');
      setListaMatriz(matrizes.data);

      const ods = await api.get('v1/objetivos-desenvolvimento-sustentavel');
      setListaODS(ods.data);

      const ciclos = await api.get('v1/ciclos');
      setListaCiclos(ciclos.data);

      obterCicloExistente();
      obterSugestaoCiclo();
    }

    carregarListas();
  }, []);

  function addRemoverMatriz(event, matrizSelecionada) {
    const estaSelecionado =
      event.target.getAttribute('opcao-selecionada') === 'true';
    event.target.setAttribute(
      'opcao-selecionada',
      estaSelecionado ? 'false' : 'true'
    );

    if (estaSelecionado) {
      listaMatrizSelecionda = listaMatrizSelecionda.filter(
        item => item.id !== matrizSelecionada.id
      );
    } else {
      listaMatrizSelecionda.push(matrizSelecionada);
    }
    setListaMatrizSelecionda(listaMatrizSelecionda);
  }

  function addRemoverODS(event, odsSelecionado) {
    const estaSelecionado =
      event.target.getAttribute('opcao-selecionada') === 'true';
    event.target.setAttribute(
      'opcao-selecionada',
      estaSelecionado ? 'false' : 'true'
    );

    if (estaSelecionado) {
      listaODSSelecionado = listaODSSelecionado.filter(
        item => item.id !== odsSelecionado.id
      );
    } else {
      listaODSSelecionado.push(odsSelecionado);
    }
    setListaODSSelecionado(listaODSSelecionado);
  }

  function setCiclo(value) {
    setCicloSelecionado(value);
  }

  function onChangeTextEditor(value) {
    setDescricaoCiclo(value);
  }

  function irParaLinkExterno(link) {
    window.open(link, '_blank');
  }

  function validaMatrizSelecionada() {
    listaMatriz.forEach(item => {
      const jaSelecionado = listaMatrizSelecionda.find(
        matriz => matriz.id === item.id
      );
      if (jaSelecionado) {
        return true;
      }
      return false;
    });
  }

  function validaODSSelecionado() {
    listaODS.forEach(item => {
      const jaSelecionado = listaODSSelecionado.find(
        matriz => matriz.id === item.id
      );
      if (jaSelecionado) {
        return true;
      }
      return false;
    });
  }

  function onClickVoltar() {
    history.push('/');
  }

  function salvarPlanoCiclo() {
    if (!listaMatrizSelecionda.length) {
      erro('Selecione uma opção ou mais em Matriz de saberes');
      return;
    }

    if (!listaODSSelecionado.length) {
      erro(
        'Selecione uma opção ou mais em Objetivos de Desenvolvimento Sustentável'
      );
      return;
    }

    const params = {
      ano: parametrosRota.ano || anoCiclo,
      cicloId: cicloSelecionado,
      descricao: descricaoCiclo,
      escolaId: 1,
      id: parametrosRota.id || 0,
      idsMatrizesSaber: listaMatrizSelecionda.map(matriz => matriz.id),
      idsObjetivosDesenvolvimento: listaODSSelecionado.map(ods => ods.id),
    };

    api.post('v1/planos-ciclo', params).then(
      () => {
        console.log(params);
        sucesso(
          `Salvo com sucesso! Ano: ${params.ano}, Ciclo: ${params.cicloId}, Ciclo: ${params.escolaId}`
        );
      },
      e => {
        erro(`Erro: ${e.response.data.mensagens[0]}`);
      }
    );
  }

  const toolbarOptions = [
    ['bold', 'italic', 'underline'],
    [{ list: 'bullet' }, { list: 'ordered' }],
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  //TODO quanto tivermos a tela de login e a home, deverá ser movido todos os alertas para a home/container
  const notificacoes = useSelector(state => state.notificacoes);

  return (
    <>
      <div className="col-md-12">
        {notificacoes.alertas.map(alerta => (
          <Alert alerta={alerta} key={alerta.id} />
        ))}
      </div>
      <div className="col-md-12">
        <div className="row mb-3">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-6">
                <SelectComponent
                  className="col-md-12"
                  name="tipo-ciclo"
                  id="tipo-ciclo"
                  lista={listaCiclos}
                  valueOption="id"
                  label="descricao"
                  onChange={setCiclo}
                  valueSelect={cicloSelecionado}
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 d-flex justify-content-end">
            <Button
              label="Voltar"
              icon="arrow-left"
              color={Colors.Azul}
              border
              className="mr-3"
              onClick={onClickVoltar}
            />
            <Button
              label="Cancelar"
              color={Colors.Roxo}
              border
              bold
              className="mr-3"
              onClick={onClickVoltar}
            />
            <Button
              label="Salvar"
              color={Colors.Roxo}
              border
              bold
              onClick={salvarPlanoCiclo}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            Este é um espaço para construção coletiva. Considere os diversos
            ritmos de aprendizagem para planejar e traçar o percurso de cada
            ciclo.
          </div>
          <div className="col-md-6">
            Considerando as especificações de cada ciclo desta unidade escolar e
            o currículo da cidade, <b>selecione</b> os itens da matriz do saber
            e dos objetivos de desenvolvimento e sustentabilidade que contemplam
            as propostas que planejaram:
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <TextEditor
              className="form-control"
              modules={modules}
              height={515}
              onChange={onChangeTextEditor}
              value={descricaoCiclo}
            />
            <InseridoAlterado>
              <p>
                INSERIDO por {inseridoPor} em {dataInseridoPor}
              </p>
                ALTERADO por {alteradoPor} em {dataAlteradoPor}
              <p />
            </InseridoAlterado>
          </div>
          <div className="col-md-6 btn-link-plano-ciclo">
            <div className="col-md-12">
              <div className="row mb-3">
                <BtnLink onClick={() => irParaLinkExterno(urlMatrizSaberes)}>
                  Matriz de saberes
                  <i className="fas fa-share" />
                </BtnLink>
              </div>

              <div className="row">
                <ListaItens>
                  <ul>
                    {listaMatriz.map(item => {
                      return (
                        <li key={item.id}>
                          {
                            <Badge
                              id={`matriz-${item.id}`}
                              className="btn-li-item btn-li-item-matriz"
                              opcao-selecionada={validaMatrizSelecionada}
                              onClick={e => addRemoverMatriz(e, item)}
                            >
                              {item.id}
                            </Badge>
                          }
                          {item.descricao}
                        </li>
                      );
                    })}
                  </ul>
                </ListaItens>
              </div>

              <hr className="row mb-3 mt-3" />

              <div className="row mb-3">
                <BtnLink onClick={() => irParaLinkExterno(urlODS)}>
                  Objetivos de Desenvolvimento Sustentável
                  <i className="fas fa-share" />
                </BtnLink>
              </div>
              <div className="row">
                <ListaItens>
                  <ul>
                    {listaODS.map(item => {
                      return (
                        <li key={item.id}>
                          {
                            <Badge
                              id={`ods-${item.id}`}
                              className="btn-li-item btn-li-item-ods"
                              opcao-selecionada={validaODSSelecionado}
                              onClick={e => addRemoverODS(e, item)}
                            >
                              {item.id}
                            </Badge>
                          }
                          {item.descricao}
                        </li>
                      );
                    })}
                  </ul>
                </ListaItens>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
