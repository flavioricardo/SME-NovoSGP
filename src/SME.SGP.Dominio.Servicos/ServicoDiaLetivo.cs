﻿using SME.SGP.Dominio.Interfaces;
using System;
using System.Collections.Generic;

namespace SME.SGP.Dominio.Servicos
{
    public class ServicoDiaLetivo : IServicoDiaLetivo
    {
        private readonly IRepositorioEvento repositorioEvento;
        private readonly IRepositorioPeriodoEscolar repositorioPeriodoEscolar;

        public ServicoDiaLetivo(IRepositorioEvento repositorioEvento,
                                IRepositorioPeriodoEscolar repositorioPeriodoEscolar)
        {
            this.repositorioEvento = repositorioEvento ?? throw new System.ArgumentNullException(nameof(repositorioEvento));
            this.repositorioPeriodoEscolar = repositorioPeriodoEscolar ?? throw new System.ArgumentNullException(nameof(repositorioPeriodoEscolar));
        }

        public bool ValidarSeEhDiaLetivo(DateTime data, long tipoCalendarioId, string dreId, string ueId)
        {
            var periodoEscolar = repositorioPeriodoEscolar.ObterPorTipoCalendarioData(tipoCalendarioId, data);
            if (periodoEscolar == null)
                return false;
            if (!repositorioEvento.EhEventoLetivoPorTipoDeCalendarioDataDreUe(tipoCalendarioId, data, dreId, ueId))
                return false;
            return data.DayOfWeek != DayOfWeek.Saturday && data.DayOfWeek != DayOfWeek.Sunday;
        }

        public bool ValidarSeEhDiaLetivo(DateTime dataInicio, DateTime dataFim, long tipoCalendarioId, bool ehLetivo = false)
        {
            var periodoEscolar = repositorioPeriodoEscolar.ObterPorTipoCalendarioData(tipoCalendarioId, dataInicio, dataFim);
            if (periodoEscolar == null)
                return false;
            if (!ehLetivo)
                return ValidaSeEhFinalSemana(dataInicio, dataFim);
            return true;
        }

        private bool ValidaSeEhFinalSemana(DateTime inicio, DateTime fim)
        {
            for (DateTime data = inicio; data <= fim; data = data.AddDays(1))
                if (data.DayOfWeek == DayOfWeek.Saturday || data.DayOfWeek == DayOfWeek.Sunday)
                    return false;
            return true;
        }
    }
}