﻿using Microsoft.AspNetCore.Http;
using SME.SGP.Dominio;
using SME.SGP.Dominio.Entidades;
using SME.SGP.Dominio.Interfaces;
using SME.SGP.Dto;
using SME.SGP.Infra;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public class ConsultasEvento : ConsultasBase, IConsultasEvento
    {
        private readonly IRepositorioEvento repositorioEvento;

        public ConsultasEvento(IRepositorioEvento repositorioEvento,
                               IHttpContextAccessor httpContext) : base(httpContext)
        {
            this.repositorioEvento = repositorioEvento ?? throw new System.ArgumentNullException(nameof(repositorioEvento));
        }

        public async Task<PaginacaoResultadoDto<EventoCompletoDto>> Listar(FiltroEventosDto filtroEventosDto)
        {
            return MapearParaDtoComPaginacao(await repositorioEvento
                .Listar(filtroEventosDto.TipoCalendarioId,
                        filtroEventosDto.TipoEventoId,
                        filtroEventosDto.NomeEvento,
                        filtroEventosDto.DataInicio,
                        filtroEventosDto.DataFim,
                        Paginacao,
                        filtroEventosDto.DreId,
                        filtroEventosDto.UeId));
        }

        public Task<IEnumerable<CalendarioEventosNoDiaRetornoDto>> ObterEventosPorDia(CalendarioEventosFiltroDto calendarioEventosMesesFiltro, int mes, int dia)
        {
            return repositorioEvento.ObterEventosPorDia(calendarioEventosMesesFiltro, mes, dia);
        }

        public EventoCompletoDto ObterPorId(long id)
        {
            return MapearParaDto(repositorioEvento.ObterPorId(id));
        }

        public async Task<IEnumerable<CalendarioTipoEventoPorDiaDto>> ObterQuantidadeDeEventosPorDia(CalendarioEventosFiltroDto calendarioEventosMesesFiltro, int mes)
        {
            var listaQuery = await repositorioEvento.ObterQuantidadeDeEventosPorDia(calendarioEventosMesesFiltro, mes);
            List<CalendarioTipoEventoPorDiaDto> listaRetorno = new List<CalendarioTipoEventoPorDiaDto>();

            if (listaQuery.Any())
            {
                var listaDiasEventos = listaQuery.GroupBy(a => a.Dia).ToList();

                listaDiasEventos.ForEach(a =>
                {
                    var tipoEventos = a.Take(3).Select(b => b.TipoEvento).ToList();
                    listaRetorno.Add(new CalendarioTipoEventoPorDiaDto()
                    {
                        Dia = a.Key,
                        TiposEvento = tipoEventos.ToArray(),
                        QuantidadeDeEventos = a.Count()
                    });
                });
            }

            return listaRetorno;
        }

        public Task<IEnumerable<CalendarioEventosMesesDto>> ObterQuantidadeDeEventosPorMeses(CalendarioEventosFiltroDto calendarioEventosMesesFiltro)
        {
            return repositorioEvento.ObterQuantidadeDeEventosPorMeses(calendarioEventosMesesFiltro);
        }

        private IEnumerable<EventoCompletoDto> MapearEventosParaDto(IEnumerable<Evento> items)
        {
            return items?.Select(c => MapearParaDto(c));
        }

        private EventoCompletoDto MapearParaDto(Evento evento)
        {
            return evento == null ? null : new EventoCompletoDto
            {
                DataFim = evento.DataFim,
                DataInicio = evento.DataInicio,
                Descricao = evento.Descricao,
                DreId = evento.DreId,
                FeriadoId = evento.FeriadoId,
                Id = evento.Id,
                Letivo = evento.Letivo,
                Nome = evento.Nome,
                TipoCalendarioId = evento.TipoCalendarioId,
                TipoEventoId = evento.TipoEventoId,
                UeId = evento.UeId,
                AlteradoEm = evento.AlteradoEm,
                AlteradoPor = evento.AlteradoPor,
                AlteradoRF = evento.AlteradoRF,
                CriadoEm = evento.CriadoEm,
                CriadoPor = evento.CriadoPor,
                CriadoRF = evento.CriadoRF,
                TipoEvento = MapearTipoEvento(evento.TipoEvento),
                Migrado = evento.Migrado
            };
        }

        private PaginacaoResultadoDto<EventoCompletoDto> MapearParaDtoComPaginacao(PaginacaoResultadoDto<Evento> eventosPaginados)
        {
            if (eventosPaginados == null)
            {
                eventosPaginados = new PaginacaoResultadoDto<Evento>();
            }
            return new PaginacaoResultadoDto<EventoCompletoDto>
            {
                Items = MapearEventosParaDto(eventosPaginados.Items),
                TotalPaginas = eventosPaginados.TotalPaginas,
                TotalRegistros = eventosPaginados.TotalRegistros
            };
        }

        private EventoTipoDto MapearTipoEvento(EventoTipo tipoEvento)
        {
            return tipoEvento == null ? null : new EventoTipoDto
            {
                Descricao = tipoEvento.Descricao,
                Id = tipoEvento.Id,
                TipoData = tipoEvento.TipoData
            };
        }
    }
}