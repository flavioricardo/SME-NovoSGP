import API from '../api';

const Service = {
  getDisciplinasProfessor: async (RF, CodigoTurma) => {
    const requisicao = await API.get(
      Service._getBaseUrlDisciplinasProfessor(RF, CodigoTurma)
    );

    return requisicao.data.map(req => {
      return {
        codigo: req.codigoComponenteCurricular,
        materia: req.nome,
      };
    });
  },

  getObjetivoseByDisciplinas: async (Ano, disciplinas) => {
    const corpoRequisicao = {
      Ano,
      ComponentesCurricularesIds: disciplinas,
    };

    const requisicao = await API.post(
      Service._getBaseUrlObjetivosFiltro(),
      corpoRequisicao
    );

    return requisicao.data;
  },

  postPlanoAnual: async Bimestres => {
    const ObjetoEnviar = Service._getObjetoPostPlanoAnual(Bimestres);

    const Erros = Service._validarDTO(ObjetoEnviar);

    if (Erros && Erros.length > 0) throw { error: Erros };

    const requisicao = API.post(
      Service._getBaseUrlSalvarPlanoAnual(),
      ObjetoEnviar
    );

    return requisicao
      .then(res => res)
      .catch(res => {
        throw { error: res.response.data.mensagens };
      });
  },

  _getBaseUrlDisciplinasProfessor: (RF, CodigoTurma) => {
    return `v1/professores/${RF}/turmas/${CodigoTurma}/disciplinas/`;
  },

  _getBaseUrlObjetivosFiltro: () => {
    return `v1/objetivos-aprendizagem`;
  },

  _getBaseUrlSalvarPlanoAnual: () => {
    return `v1/planos/anual`;
  },

  _getObjetoPostPlanoAnual: Bimestres => {
    const BimestresFiltrados = Bimestres.filter(x => x.ehExpandido);

    const ObjetoEnviar = {
      AnoLetivo: 0,
      EscolaId: 0,
      TurmaId: 0,
      Id: 0,
      Bimestres: [],
    };

    BimestresFiltrados.forEach(bimestre => {
      const temObjetivos =
        bimestre.objetivosAprendizagem &&
        bimestre.objetivosAprendizagem.length > 0;

      const objetivosAprendizagem = temObjetivos
        ? bimestre.objetivosAprendizagem
            .filter(x => x.selected)
            .map(obj => {
              return {
                Id: obj.id,
                IdComponenteCurricular: obj.idComponenteCurricular,
              };
            })
        : [];

      const BimestreDTO = {
        Bimestre: bimestre.indice,
        Descricao: bimestre.objetivo,
        ObjetivosAprendizagem: objetivosAprendizagem,
      };

      ObjetoEnviar.AnoLetivo = bimestre.anoLetivo;
      ObjetoEnviar.EscolaId = bimestre.escolaId;
      ObjetoEnviar.TurmaId = bimestre.turmaId;
      ObjetoEnviar.Id = bimestre.Id;

      ObjetoEnviar.Bimestres.push(BimestreDTO);
    });

    return ObjetoEnviar;
  },

  _validarDTO: DTO => {
    let Erros = [];

    if (
      !DTO.AnoLetivo ||
      DTO.AnoLetivo === '' ||
      typeof DTO.AnoLetivo === 'undefined'
    )
      Erros.push('Ano letivo não informado');

    if (
      !DTO.EscolaId ||
      DTO.EscolaId === '' ||
      typeof DTO.EscolaId === 'undefined'
    )
      Erros.push('Unidade escolar não informada');

    if (
      !DTO.TurmaId ||
      DTO.TurmaId === '' ||
      typeof DTO.TurmaId === 'undefined'
    )
      Erros.push('Turma não informada');

    Erros = Service._validarBimestresDTO(DTO.Bimestres, Erros);

    return Erros;
  },

  _validarBimestresDTO: (Bimestres, Erros) => {
    Bimestres.forEach((bimestre, index) => {
      if (
        !bimestre.Descricao ||
        bimestre.Descricao === '' ||
        typeof bimestre.Descricao === 'undefined'
      )
        Erros.push(`${index + 1}º Bimestre: Descrição não informada`);

      if (
        !bimestre.ObjetivosAprendizagem ||
        bimestre.ObjetivosAprendizagem.length === 0
      )
        Erros.push(`${index + 1}º Bimestre: Nenhum objetivo selecionado`);
    });

    return Erros;
  },

  urlObterPlanoAnual: () => {
    return `v1/planos/anual/obter`;
  },
  obterBimestre: bimestre => {
    return API.post(Service.urlObterPlanoAnual(), bimestre);
  },
};

export default Service;