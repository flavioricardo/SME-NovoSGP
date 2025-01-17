﻿using System.Collections.Generic;
using System.Threading.Tasks;

namespace SME.SGP.Dominio.Interfaces
{
    public interface IRepositorioBase<T> where T : EntidadeBase
    {
        IEnumerable<T> Listar();

        T ObterPorId(long id);

        void Remover(long id);

        void Remover(T entidade);

        long Salvar(T entidade);

        Task<long> SalvarAsync(T entidade);
    }
}