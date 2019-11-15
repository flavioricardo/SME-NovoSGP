﻿using Dapper;
using SME.SGP.Dados.Contexto;
using SME.SGP.Dominio;
using SME.SGP.Dominio.Interfaces;
using System.Collections.Generic;

namespace SME.SGP.Dados.Repositorios
{
    public class RepositorioFrequencia : RepositorioBase<RegistroFrequencia>, IRepositorioFrequencia
    {
        public RepositorioFrequencia(ISgpContext database) : base(database)
        {
        }

        public IEnumerable<RegistroAusenciaAluno> ObterListaFrequenciaPorAula(long aulaId)
        {
            var query = @"select ra.*
                        from
	                        registro_frequencia rf
                        inner join registro_ausencia_aluno ra on
	                        rf.id = ra.registro_frequencia_id
                        inner join aula a on
	                        a.id = rf.aula_id
                        where
	                        a.id = @aulaId";

            return database.Conexao.Query<RegistroAusenciaAluno>(query, new { aulaId });
            //return database.Conexao.Query<RegistroAusenciaAluno, Aula, RegistroAusenciaAluno>(query, (registroAusenciaAluno, aula) =>
            //{
            //    registroAusenciaAluno
            //    return registroAusenciaAluno;
            //}, param: new
            //{
            //    aulaId
            //});
        }
    }
}