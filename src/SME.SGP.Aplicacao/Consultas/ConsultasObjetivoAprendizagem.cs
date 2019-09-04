﻿using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using SME.SGP.Aplicacao.Integracoes;
using SME.SGP.Aplicacao.Integracoes.Respostas;
using SME.SGP.Dominio;
using SME.SGP.Dominio.Interfaces;
using SME.SGP.Dto;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public class ConsultasObjetivoAprendizagem : IConsultasObjetivoAprendizagem
    {
        private readonly IConfiguration configuration;
        private readonly IRepositorioCache repositorioCache;
        private readonly IRepositorioComponenteCurricular repositorioComponenteCurricular;
        private readonly IServicoJurema servicoJurema;

        public ConsultasObjetivoAprendizagem(IServicoJurema servicoJurema,
                                             IRepositorioCache repositorioCache,
                                             IRepositorioComponenteCurricular repositorioComponenteCurricular,
                                             IConfiguration configuration)
        {
            this.servicoJurema = servicoJurema ?? throw new ArgumentNullException(nameof(servicoJurema));
            this.repositorioCache = repositorioCache ?? throw new ArgumentNullException(nameof(repositorioCache));
            this.repositorioComponenteCurricular = repositorioComponenteCurricular ?? throw new ArgumentNullException(nameof(repositorioComponenteCurricular));
            this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public async Task<IEnumerable<ObjetivoAprendizagemDto>> Filtrar(FiltroObjetivosAprendizagemDto filtroObjetivosAprendizagemDto)
        {
            var objetivos = await Listar();
            var componentesCurriculares = repositorioComponenteCurricular.Listar();
            if (componentesCurriculares == null)
            {
                throw new NegocioException("Não foi possível recuperar a lista de componentes curriculares.");
            }

            var componentesFiltro = componentesCurriculares.Where(c => filtroObjetivosAprendizagemDto.ComponentesCurricularesIds.Contains(c.CodigoEOL));
            var componentesJurema = componentesFiltro.Select(c => c.CodigoJurema);

            return objetivos?
                .Where(c => componentesJurema.Contains(c.IdComponenteCurricular)
                    && c.Ano == filtroObjetivosAprendizagemDto.Ano);
        }

        public async Task<IEnumerable<ObjetivoAprendizagemDto>> Listar()
        {
            var objetivos = new List<ObjetivoAprendizagemDto>();

            var objetivosCacheString = repositorioCache.Obter("ObjetivosAprendizagem");

            if (string.IsNullOrEmpty(objetivosCacheString))
            {
                var objetivosJuremaDto = await servicoJurema.ObterListaObjetivosAprendizagem();
                objetivos = MapearParaDto(objetivosJuremaDto).ToList();

                var tempoExpiracao = int.Parse(configuration.GetSection("ExpiracaoCache").GetSection("ObjetivosAprendizagem").Value);

                await repositorioCache.SalvarAsync("ObjetivosAprendizagem", JsonConvert.SerializeObject(objetivos), tempoExpiracao);
            }
            else
                objetivos = JsonConvert.DeserializeObject<List<ObjetivoAprendizagemDto>>(objetivosCacheString);

            return objetivos;
        }

        private IEnumerable<ObjetivoAprendizagemDto> MapearParaDto(IEnumerable<ObjetivoAprendizagemResposta> objetivos)
        {
            foreach (var objetivoDto in objetivos)
            {
                var codigo = objetivoDto.Codigo.Replace("(", "").Replace(")", "");
                var anoString = codigo.Substring(3, 1);
                int.TryParse(anoString, out int ano);
                if (ano != 0)
                {
                    yield return new ObjetivoAprendizagemDto()
                    {
                        Descricao = objetivoDto.Descricao,
                        Id = objetivoDto.Id,
                        Ano = ano,
                        Codigo = codigo,
                        IdComponenteCurricular = objetivoDto.ComponenteCurricularId
                    };
                }
            }
        }
    }
}