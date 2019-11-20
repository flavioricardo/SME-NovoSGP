﻿using System.Collections.Generic;
using System.Threading.Tasks;

namespace SME.SGP.Dominio.Interfaces
{
    public interface IRepositorioObjetivoAprendizagemAula : IRepositorioBase<ObjetivoAprendizagemAula>
    {
        Task<IEnumerable<ObjetivoAprendizagemAula>> ObterObjetivosPlanoAula(long planoAulaId);
    }
}
