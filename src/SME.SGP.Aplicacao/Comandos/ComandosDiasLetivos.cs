﻿using SME.SGP.Aplicacao.Interfaces;
using SME.SGP.Dominio.Interfaces;
using SME.SGP.Dto;
using SME.SGP.Infra;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SME.SGP.Aplicacao
{
    public class ComandosDiasLetivos : IComandosDiasLetivos
    {
        private const string ChaveDiasLetivosEja = "EjaDiasLetivos";
        private const string ChaveDiasLetivosFundMedio = "FundamentalMedioDiasLetivos";
        private readonly IRepositorioEvento repositorioEvento;
        private readonly IRepositorioParametrosSistema repositorioParametrosSistema;
        private readonly IRepositorioPeriodoEscolar repositorioPeriodoEscolar;
        private readonly IRepositorioTipoCalendario repositorioTipoCalendario;

        public ComandosDiasLetivos(
            IRepositorioPeriodoEscolar repositorioPeriodoEscolar,
            IRepositorioEvento repositorioEvento,
            IRepositorioTipoCalendario repositorioTipoCalendario,
            IRepositorioParametrosSistema repositorioParametrosSistema)
        {
            this.repositorioPeriodoEscolar = repositorioPeriodoEscolar ?? throw new ArgumentNullException(nameof(repositorioPeriodoEscolar));
            this.repositorioEvento = repositorioEvento ?? throw new ArgumentNullException(nameof(repositorioEvento));
            this.repositorioTipoCalendario = repositorioTipoCalendario ?? throw new ArgumentNullException(nameof(repositorioTipoCalendario));
            this.repositorioParametrosSistema = repositorioParametrosSistema ?? throw new ArgumentNullException(nameof(repositorioParametrosSistema));
        }

        public DiasLetivosDto CalcularDiasLetivos(FiltroDiasLetivosDTO filtro)
        {
            bool estaAbaixo = false;

            var diasLetivosCalendario = BuscarDiasLetivos(filtro.TipoCalendarioId);
            var eventos = repositorioEvento.ObterEventosPorTipoDeCalendarioDreUe(filtro.TipoCalendarioId, filtro.DreId, filtro.UeId);
            var tipoCalendario = repositorioTipoCalendario.ObterPorId(filtro.TipoCalendarioId);

            var anoLetivo = tipoCalendario.AnoLetivo;

            List<DateTime> diasEventosNaoLetivos = new List<DateTime>();
            List<DateTime> diasEventosLetivos = new List<DateTime>();

            diasEventosNaoLetivos = ObterDias(eventos, diasEventosNaoLetivos, Dominio.EventoLetivo.Nao);
            diasEventosLetivos = ObterDias(eventos, diasEventosLetivos, Dominio.EventoLetivo.Sim);

            diasLetivosCalendario.AddRange(diasEventosLetivos.Except(diasLetivosCalendario));

            diasEventosNaoLetivos = diasEventosNaoLetivos.Where(w => !diasEventosLetivos.Contains(w)).ToList();

            var diasLetivos = diasLetivosCalendario.Count() - diasEventosNaoLetivos.Count();
            var diasLetivosPermitidos = Convert.ToInt32(tipoCalendario.Modalidade == Dominio.ModalidadeTipoCalendario.EJA ?
                repositorioParametrosSistema.ObterValorPorNomeAno(ChaveDiasLetivosEja, anoLetivo) :
                repositorioParametrosSistema.ObterValorPorNomeAno(ChaveDiasLetivosFundMedio, anoLetivo));

            estaAbaixo = diasLetivos < diasLetivosPermitidos;

            return new DiasLetivosDto
            {
                Dias = diasLetivos,
                EstaAbaixoPermitido = estaAbaixo
            };
        }

        public bool EhDiaUtil(DateTime data)
        {
            return data.DayOfWeek != DayOfWeek.Saturday && data.DayOfWeek != DayOfWeek.Sunday;
        }

        private List<DateTime> BuscarDiasLetivos(long tipoCalendarioId)
        {
            List<DateTime> dias = new List<DateTime>();
            var periodoEscolar = repositorioPeriodoEscolar.ObterPorTipoCalendario(tipoCalendarioId);
            periodoEscolar
                .ToList()
                .ForEach(x => dias
                    .AddRange(
                        Enumerable
                        .Range(0, 1 + (x.PeriodoFim - x.PeriodoInicio).Days)
                        .Select(y => x.PeriodoInicio.AddDays(y))
                        .Where(w => EhDiaUtil(w))
                        .ToList())
            );

            return dias;
        }

        private List<DateTime> ObterDias(IEnumerable<Dominio.Evento> eventos, List<DateTime> dias, Dominio.EventoLetivo eventoTipo)
        {
            eventos
                            .Where(w => w.Letivo == eventoTipo)
                            .ToList()
                            .ForEach(x => dias
                                .AddRange(
                                    Enumerable
                                    .Range(0, 1 + (x.DataFim - x.DataInicio).Days)
                                    .Select(y => x.DataInicio.AddDays(y))
                            ));
            return dias.Distinct().ToList();
        }
    }
}