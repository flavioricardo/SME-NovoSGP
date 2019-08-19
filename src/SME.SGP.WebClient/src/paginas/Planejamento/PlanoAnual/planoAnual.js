import React from 'react';
import shortid from 'shortid';
import styled from 'styled-components';
import CardCollapse from '../../../componentes/cardCollapse';
import Grid from '../../../componentes/grid';
import Button from '../../../componentes/button';
import TextEditor from '../../../componentes/textEditor';
import { listarObjetivosAprendizagem } from '../../../servicos/objetivos';
import { Colors, Base } from '../../../componentes/colors';
import Seta from '../../../recursos/Seta.svg';

const bimestres = [
  {
    nome: '1º Bimestre',
    materias: [
      { materia: 'Ciências' },
      { materia: 'História' },
      { materia: 'Geografia' },
    ],
  },
  { nome: '2º Bimestre', materias: [] },
  { nome: '3º Bimestre', materias: [] },
  { nome: '4º Bimestre', materias: [] },
];

const objetivos = [
  {
    id: 1623,
    year: 'third',
    code: 'EF03EF01',
    description:
      'Vivenciar/experimentar/fruir brincadeiras e jogos do contexto familiar/comunitário, incluindo os de matrizes africanas e indígenas, prezando pelo trabalho coletivo e pelo protagonismo e relacionando os elementos comuns a essas brincadeiras.',
    curricular_component_id: 3,
    created_at: '2019-01-09T18:54:00.495Z',
    updated_at: '2019-01-09T18:54:00.495Z',
  },
  {
    id: 1624,
    year: 'third',
    code: 'EF03EF02',
    description:
      'Planejar e utilizar estratégias para resolver desafios de brincadeiras e jogos do contexto familiar/comunitário, incluindo os de matrizes africanas e indígenas, com base no reconhecimento das características dessas práticas.',
    curricular_component_id: 3,
    created_at: '2019-01-09T18:54:34.206Z',
    updated_at: '2019-01-09T18:54:34.206Z',
  },
  {
    id: 1625,
    year: 'third',
    code: 'EF03EF03',
    description:
      'Descrever, por meio de múltiplas linguagens (corporal, oral e escrita e audiovisual), as brincadeiras e jogos regionais e populares de matrizes africanas e indígenas, explicando suas características e a importância desse patrimônio histórico-cultural na preservação das diferentes culturas.',
    curricular_component_id: 3,
    created_at: '2019-01-09T18:55:13.424Z',
    updated_at: '2019-01-10T18:47:34.270Z',
  },
  {
    id: 1626,
    year: 'third',
    code: 'EF03EF04',
    description:
      'Recriar, individual e coletivamente, brincadeiras e jogos do contexto familiar/comunitário, incluindo os de matrizes africanas e indígenas e demais práticas corporais tematizadas na escola, adequandoas aos espaços.',
    curricular_component_id: 3,
    created_at: '2019-01-09T18:55:53.435Z',
    updated_at: '2019-01-09T18:55:53.435Z',
  },
];

const objetivosSelecionados = [{ code: 'EF03EF01' }, { code: 'EF03EF02' }];

function selecionaMateria(event) {
  event.target.setAttribute(
    'aria-pressed',
    event.target.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'
  );

  listarObjetivosAprendizagem();
}

function selecionaObjetivo(event) {
  event.target.setAttribute(
    'aria-pressed',
    event.target.getAttribute('aria-pressed') === 'true' ? 'false' : 'true'
  );
  objetivosSelecionados.push({ code: event.target.innerHTML });
}

function PlanoAnual() {
  const Badge = styled.button`
    &:last-child {
      margin-right: 0 !important;
    }

    &[aria-pressed='true'] {
      background: ${Base.CinzaBadge} !important;
      border-color: ${Base.CinzaBadge} !important;
    }
  `;

  const ListItem = styled.li`
    border-color: ${Base.AzulAnakiwa} !important;
  `;

  const ListItemButton = styled(ListItem)`
    cursor: pointer;

    &[aria-pressed='true'] {
      background: ${Base.AzulAnakiwa} !important;
    }
  `;

  const toolbarOptions = [
    ['bold', 'italic', 'underline'],
    [{ list: 'bullet' }, { list: 'ordered' }],
  ];

  const modules = {
    toolbar: toolbarOptions,
  };

  return (
    <>
      <Grid cols={12}>
        <h1>Plano Anual</h1>
      </Grid>
      <Grid cols={6} className="d-flex justify-content-start mb-3">
        <Button
          label="Migrar Conteúdo"
          icon="share-square"
          color={Colors.Azul}
          border
          disabled
        />
      </Grid>
      <Grid cols={6} className="d-flex justify-content-end mb-3">
        <Button
          label="Voltar"
          icon="arrow-left"
          color={Colors.Azul}
          border
          className="mr-3"
        />
        <Button
          label="Cancelar"
          color={Colors.Roxo}
          border
          bold
          className="mr-3"
        />
        <Button label="Salvar" color={Colors.Roxo} border bold disabled />
      </Grid>
      <Grid cols={12}>
        {bimestres.length > 0
          ? bimestres.map(bimestre => {
              const indice = shortid.generate().replace(/[0-9]/g, '');
              return (
                <CardCollapse
                  key={indice}
                  titulo={bimestre.nome}
                  indice={indice}
                >
                  <div className="row">
                    <Grid cols={6}>
                      <h6 className="d-inline-block font-weight-bold my-0 fonte-14">
                        Objetivos de aprendizagem
                      </h6>
                      <div>
                        {bimestre.materias.length > 0
                          ? bimestre.materias.map(materia => {
                              return (
                                <Badge
                                  role="button"
                                  onClick={selecionaMateria}
                                  aria-pressed={false}
                                  key={shortid.generate()}
                                  className="badge badge-pill border text-dark bg-white font-weight-light p-2 mt-3 mr-2"
                                >
                                  {materia.materia}
                                </Badge>
                              );
                            })
                          : null}
                      </div>
                      <div className="mt-4">
                        {objetivos.length > 0
                          ? objetivos.map(objetivo => {
                              return (
                                <ul
                                  key={shortid.generate()}
                                  className="list-group list-group-horizontal mt-3"
                                >
                                  <ListItemButton
                                    className="list-group-item d-flex align-items-center font-weight-bold fonte-14"
                                    role="button"
                                    aria-pressed="false"
                                    onClick={selecionaObjetivo}
                                    onKeyUp={selecionaObjetivo}
                                  >
                                    {objetivo.code}
                                  </ListItemButton>
                                  <ListItem className="list-group-item flex-fill p-2 fonte-12">
                                    {objetivo.description}
                                  </ListItem>
                                </ul>
                              );
                            })
                          : null}
                      </div>
                    </Grid>
                    <Grid cols={6}>
                      <h6 className="d-inline-block font-weight-bold my-0 fonte-14">
                        Objetivos de aprendizagem e meus objetivos (Currículo da
                        cidade)
                      </h6>
                      <div
                        role="group"
                        aria-label={`${objetivosSelecionados.length} objetivos selecionados`}
                      >
                        {objetivosSelecionados.length > 0
                          ? objetivosSelecionados.map(selecionado => {
                              return (
                                <Button
                                  key={shortid.generate()}
                                  label={selecionado.code}
                                  color={Colors.AzulAnakiwa}
                                  bold
                                  steady
                                  remove
                                  className="text-dark mt-3 mr-2"
                                />
                              );
                            })
                          : null}
                      </div>
                      <div className="mt-4">
                        <h6 className="d-inline-block font-weight-bold my-0 mr-2 fonte-14">
                          Planejamento Anual
                        </h6>
                        <span className="text-secondary font-italic fonte-12">
                          Itens autorais do professor
                        </span>
                        <p className="text-secondary mt-3 fonte-13">
                          É importante seguir a seguinte estrutura:
                        </p>
                        <ul className="list-group list-group-horizontal fonte-10">
                          <li className="list-group-item border-right-0 py-1">
                            Objetivos
                          </li>
                          <li className="list-group-item border-left-0 border-right-0 px-0 py-1">
                            <img src={Seta} alt="Próximo" />
                          </li>
                          <li className="list-group-item border-left-0 border-right-0 py-1">
                            Conteúdo
                          </li>
                          <li className="list-group-item border-left-0 border-right-0 px-0 py-1">
                            <img src={Seta} alt="Próximo" />
                          </li>
                          <li className="list-group-item border-left-0 border-right-0 py-1">
                            Estratégia
                          </li>
                          <li className="list-group-item border-left-0 border-right-0 px-0 py-1">
                            <img src={Seta} alt="Próximo" />
                          </li>
                          <li className="list-group-item border-left-0 py-1">
                            Avaliação
                          </li>
                        </ul>
                        <fieldset className="mt-3">
                          <form action="">
                            <TextEditor
                              className="form-control"
                              modules={modules}
                              height={135}
                            />
                          </form>
                        </fieldset>
                      </div>
                    </Grid>
                  </div>
                </CardCollapse>
              );
            })
          : null}
      </Grid>
    </>
  );
}

export default PlanoAnual;
