using Dapper;
using SME.SGP.Dados.Contexto;
using SME.SGP.Infra;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SME.SGP.Dados.Repositorios
{
    public class RepositorioCalendarioProfessor
    {
        private readonly ISgpContext database;

        public RepositorioCalendarioProfessor(ISgpContext database)
        {
            this.database = database;
        }

        public async Task<IEnumerable<AulasPorTurmaDisciplinaDto>> ObterEventosEAulasPorCalendarioEDia(long tipoCalendarioId, DateTime data)
        {
            var query = @"";

            return await database.Conexao.QueryAsync<AulasPorTurmaDisciplinaDto>(query, new
            {
                tipoCalendarioId,
                data
            });
        }
    }
}