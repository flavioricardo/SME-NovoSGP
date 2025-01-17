﻿using SME.SGP.Dominio;
using SME.SGP.Dominio.Interfaces;
using SME.SGP.Infra;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SME.SGP.Aplicacao
{
    public class ComandosPlanoCiclo : IComandosPlanoCiclo
    {
        private readonly IRepositorioMatrizSaberPlano repositorioMatrizSaberPlano;
        private readonly IRepositorioObjetivoDesenvolvimentoPlano repositorioObjetivoDesenvolvimentoPlano;
        private readonly IRepositorioPlanoCiclo repositorioPlanoCiclo;
        private readonly IUnitOfWork unitOfWork;

        public ComandosPlanoCiclo(IRepositorioPlanoCiclo repositorioPlanoCiclo,
                                  IRepositorioMatrizSaberPlano repositorioMatrizSaberPlano,
                                  IRepositorioObjetivoDesenvolvimentoPlano repositorioObjetivoDesenvolvimentoPlano,
                                  IUnitOfWork unitOfWork)
        {
            this.repositorioPlanoCiclo = repositorioPlanoCiclo ?? throw new ArgumentNullException(nameof(repositorioPlanoCiclo));
            this.repositorioMatrizSaberPlano = repositorioMatrizSaberPlano ?? throw new ArgumentNullException(nameof(repositorioMatrizSaberPlano));
            this.repositorioObjetivoDesenvolvimentoPlano = repositorioObjetivoDesenvolvimentoPlano ?? throw new ArgumentNullException(nameof(repositorioObjetivoDesenvolvimentoPlano));
            this.unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        }

        public void Salvar(PlanoCicloDto planoCicloDto)
        {
            var planoCiclo = MapearParaDominio(planoCicloDto);
            using (var transacao = unitOfWork.IniciarTransacao())
            {
                planoCicloDto.Id = repositorioPlanoCiclo.Salvar(planoCiclo);
                AjustarMatrizes(planoCiclo, planoCicloDto);
                AjustarObjetivos(planoCiclo, planoCicloDto);
                unitOfWork.PersistirTransacao();
            }
        }

        private void AjustarMatrizes(PlanoCiclo planoCiclo, PlanoCicloDto planoCicloDto)
        {
            var matrizesPlanoCiclo = repositorioMatrizSaberPlano.ObterMatrizesPorIdPlano(planoCiclo.Id);

            var idsMatrizes = matrizesPlanoCiclo?.Select(c => c.MatrizSaberId)?.ToList();
            RemoverMatrizes(planoCicloDto, matrizesPlanoCiclo);
            InserirMatrizes(planoCiclo, planoCicloDto, idsMatrizes);
        }

        private void AjustarObjetivos(PlanoCiclo planoCiclo, PlanoCicloDto planoCicloDto)
        {
            var objetivosPlanoCiclo = repositorioObjetivoDesenvolvimentoPlano.ObterObjetivosDesenvolvimentoPorIdPlano(planoCiclo.Id);
            var idsObjetivos = objetivosPlanoCiclo?.Select(c => c.ObjetivoDesenvolvimentoId)?.ToList();

            InserirObjetivos(planoCicloDto, idsObjetivos);
            RemoverObjetivos(planoCicloDto, objetivosPlanoCiclo);
        }

        private void InserirMatrizes(PlanoCiclo planoCiclo, PlanoCicloDto planoCicloDto, List<long> idsMatrizes)
        {
            var matrizesIncluir = planoCicloDto.IdsMatrizesSaber.Except(idsMatrizes);

            foreach (var idMatrizIncluir in matrizesIncluir)
            {
                repositorioMatrizSaberPlano.Salvar(new MatrizSaberPlano()
                {
                    MatrizSaberId = idMatrizIncluir,
                    PlanoId = planoCiclo.Id
                });
            }
        }

        private void InserirObjetivos(PlanoCicloDto planoCicloDto, List<long> idsObjetivos)
        {
            var objetivosIncluir = planoCicloDto.IdsObjetivosDesenvolvimento.Except(idsObjetivos);

            foreach (var idObjetivo in objetivosIncluir)
            {
                repositorioObjetivoDesenvolvimentoPlano.Salvar(new ObjetivoDesenvolvimentoPlano()
                {
                    ObjetivoDesenvolvimentoId = idObjetivo,
                    PlanoId = planoCicloDto.Id
                });
            }
        }

        private PlanoCiclo MapearParaDominio(PlanoCicloDto planoCicloDto)
        {
            if (planoCicloDto == null)
            {
                throw new ArgumentNullException(nameof(planoCicloDto));
            }
            if (planoCicloDto.Id == 0 && repositorioPlanoCiclo.ObterPlanoCicloPorAnoCicloEEscola(planoCicloDto.Ano, planoCicloDto.CicloId, planoCicloDto.EscolaId))
            {
                throw new NegocioException("Já existe um plano ciclo referente a este Ano/Ciclo/Escola.");
            }

            var planoCiclo = repositorioPlanoCiclo.ObterPorId(planoCicloDto.Id);
            if (planoCiclo == null)
            {
                planoCiclo = new PlanoCiclo();
            }
            if (!planoCiclo.Migrado)
            {
                if (planoCicloDto.IdsMatrizesSaber == null || !planoCicloDto.IdsMatrizesSaber.Any())
                {
                    throw new NegocioException("A matriz de saberes deve conter ao menos 1 elemento.");
                }
                if (planoCicloDto.IdsObjetivosDesenvolvimento == null || !planoCicloDto.IdsObjetivosDesenvolvimento.Any())
                {
                    throw new NegocioException("Os objetivos de desenvolvimento sustentável devem conter ao menos 1 elemento.");
                }
            }
            planoCiclo.Descricao = planoCicloDto.Descricao;
            planoCiclo.CicloId = planoCicloDto.CicloId;
            planoCiclo.Ano = planoCicloDto.Ano;
            planoCiclo.EscolaId = planoCicloDto.EscolaId;
            return planoCiclo;
        }

        private void RemoverMatrizes(PlanoCicloDto planoCicloDto, IEnumerable<MatrizSaberPlano> matrizesPlanoCiclo)
        {
            if (matrizesPlanoCiclo != null)
            {
                var matrizesRemover = matrizesPlanoCiclo.Where(c => !planoCicloDto.IdsMatrizesSaber.Contains(c.MatrizSaberId));
                foreach (var matriz in matrizesRemover)
                {
                    repositorioMatrizSaberPlano.Remover(matriz.Id);
                }
            }
        }

        private void RemoverObjetivos(PlanoCicloDto planoCicloDto, IEnumerable<ObjetivoDesenvolvimentoPlano> objetivosPlanoCiclo)
        {
            if (objetivosPlanoCiclo != null)
            {
                var objetivosRemover = objetivosPlanoCiclo.Where(c => !planoCicloDto.IdsObjetivosDesenvolvimento.Contains(c.ObjetivoDesenvolvimentoId));

                foreach (var objetivo in objetivosRemover)
                {
                    repositorioObjetivoDesenvolvimentoPlano.Remover(objetivo.Id);
                }
            }
        }
    }
}