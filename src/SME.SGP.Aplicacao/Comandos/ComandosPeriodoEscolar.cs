﻿using SME.SGP.Aplicacao.Interfaces;
using SME.SGP.Dominio;
using SME.SGP.Dominio.Interfaces;
using SME.SGP.Infra;
using System;
using System.Collections.Generic;

namespace SME.SGP.Aplicacao
{
    public class ComandosPeriodoEscolar : IComandosPeriodoEscolar
    {
        private readonly IRepositorioPeriodoEscolar repositorioPeriodo;
        private readonly IServicoPeriodoEscolar servicoPeriodoEscolar;

        public ComandosPeriodoEscolar(IRepositorioPeriodoEscolar repositorioPeriodo, IServicoPeriodoEscolar servicoPeriodoEscolar)
        {
            this.repositorioPeriodo = repositorioPeriodo ?? throw new ArgumentNullException(nameof(repositorioPeriodo));
            this.servicoPeriodoEscolar = servicoPeriodoEscolar ?? throw new ArgumentNullException(nameof(servicoPeriodoEscolar));
        }

        public void Salvar(PeriodoEscolarListaDto periodosDto)
        {
            if (periodosDto.TipoCalendario == 0) throw new NegocioException("É necessario informar o tipo de calendario");

            var listaPeriodoEscolar = MapearListaPeriodos(periodosDto);

            servicoPeriodoEscolar.SalvarPeriodoEscolar(listaPeriodoEscolar, periodosDto.TipoCalendario);
        }

        private IEnumerable<PeriodoEscolar> MapearListaPeriodos(PeriodoEscolarListaDto periodosDto)
        {
            var retorno = new List<PeriodoEscolar>();

            foreach (var periodo in periodosDto.Periodos)
            {
                if (periodo.Id > 0)
                    retorno.Add(ObterPeriodo(periodo.Id, periodo));
                else
                    retorno.Add(MapearParaDominio(periodo, periodosDto.TipoCalendario));
            }

            return retorno;
        }

        private PeriodoEscolar MapearParaDominio(PeriodoEscolarDto periodoDto, long tipoCalendario)
        {
            return new PeriodoEscolar
            {
                Bimestre = periodoDto.Bimestre,
                PeriodoInicio = periodoDto.PeriodoInicio,
                PeriodoFim = periodoDto.PeriodoFim,
                TipoCalendarioId = tipoCalendario,
                Migrado = false,
            };
        }

        private PeriodoEscolar ObterPeriodo(long Id, PeriodoEscolarDto periodo)
        {
            var periodoSalvar = repositorioPeriodo.ObterPorId(Id);

            periodoSalvar.PeriodoInicio = periodo.PeriodoInicio;
            periodoSalvar.PeriodoFim = periodo.PeriodoFim;

            return periodoSalvar;
        }
    }
}