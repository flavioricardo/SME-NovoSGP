﻿using SME.SGP.Dto;
using System.Collections.Generic;

namespace SME.SGP.Aplicacao
{
    public interface IConsultasCiclo
    {
        IEnumerable<CicloDto> Listar(FiltroCicloDto filtroCicloDto);

        CicloDto Selecionar(int ano);
    }
}