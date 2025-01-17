﻿using SME.SGP.Infra;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao
{
    public interface IConsultasSupervisor
    {
        Task<IEnumerable<SupervisorEscolasDto>> ObterPorDre(string dreId);

        IEnumerable<SupervisorDto> ObterPorDreENomeSupervisor(string supervisorNome, string dreId);

        IEnumerable<SupervisorEscolasDto> ObterPorDreESupervisor(string supervisorId, string dreId);

        IEnumerable<SupervisorEscolasDto> ObterPorDreESupervisores(string[] supervisorId, string dreId);

        SupervisorEscolasDto ObterPorUe(string ueId);
    }
}