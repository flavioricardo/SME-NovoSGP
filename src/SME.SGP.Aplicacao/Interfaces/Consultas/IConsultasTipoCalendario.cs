﻿using SME.SGP.Dominio;
using SME.SGP.Infra;
using System.Collections.Generic;

namespace SME.SGP.Aplicacao
{
    public interface IConsultasTipoCalendario
    {
        TipoCalendarioCompletoDto BuscarPorAnoLetivoEModalidade(int anoLetivo, ModalidadeTipoCalendario modalidade);

        TipoCalendarioCompletoDto BuscarPorId(long id);

        IEnumerable<TipoCalendarioDto> Listar();
    }
}