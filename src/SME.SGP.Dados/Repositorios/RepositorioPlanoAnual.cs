﻿using Dapper;
using SME.SGP.Dados.Contexto;
using SME.SGP.Dominio;
using SME.SGP.Dominio.Interfaces;
using SME.SGP.Infra;
using System.Linq;
using System.Text;

namespace SME.SGP.Dados.Repositorios
{
    public class RepositorioPlanoAnual : RepositorioBase<PlanoAnual>, IRepositorioPlanoAnual
    {
        public RepositorioPlanoAnual(ISgpContext conexao) : base(conexao)
        {
        }

        public PlanoAnualCompletoDto ObterPlanoAnualCompletoPorAnoEscolaBimestreETurma(int ano, string escolaId, long turmaId, int bimestre, long componenteCurricularEolId)
        {
            StringBuilder query = new StringBuilder();

            query.AppendLine("select");
            query.AppendLine("	pa.ano as AnoLetivo, pa.*, pa.migrado, ");
            query.AppendLine("	string_agg(distinct cast(oap.objetivo_aprendizagem_jurema_id as text), ',') as ObjetivosAprendizagemPlano");
            query.AppendLine("from");
            query.AppendLine("	plano_anual pa");
            query.AppendLine("left join objetivo_aprendizagem_plano oap on");
            query.AppendLine("	pa.id = oap.plano_id");
            query.AppendLine("where");
            query.AppendLine("	pa.ano = @ano");
            query.AppendLine("	and pa.bimestre = @bimestre");
            query.AppendLine("	and pa.escola_id = @escolaId");
            query.AppendLine("	and pa.turma_id = @turmaId");
            query.AppendLine("	and pa.componente_curricular_eol_id = @componenteCurricularEolId");
            query.AppendLine("group by");
            query.AppendLine("	pa.id");

            return database.Conexao.Query<PlanoAnualCompletoDto>(query.ToString(), new { ano, escolaId, turmaId, bimestre, componenteCurricularEolId }).SingleOrDefault();
        }

        public PlanoAnual ObterPlanoAnualSimplificadoPorAnoEscolaBimestreETurma(int ano, string escolaId, long turmaId, int bimestre, long disciplinaId)
        {
            StringBuilder query = new StringBuilder();

            query.AppendLine("select");
            query.AppendLine("id, escola_id, turma_id, ano, bimestre, componente_curricular_eol_id, descricao, migrado,");
            query.AppendLine("criado_em, alterado_em, criado_por, alterado_por, criado_rf, alterado_rf");
            query.AppendLine("from plano_anual");
            query.AppendLine("where");
            query.AppendLine("ano = @ano and");
            query.AppendLine("escola_id = @escolaId and");
            query.AppendLine("bimestre = @bimestre and");
            query.AppendLine("turma_id = @turmaId and");
            query.AppendLine("componente_curricular_eol_id = @disciplinaId");

            return database.Conexao.Query<PlanoAnual>(query.ToString(),
                new
                {
                    ano,
                    escolaId,
                    turmaId,
                    bimestre,
                    disciplinaId
                }).SingleOrDefault();
        }

        public bool ValidarPlanoExistentePorAnoEscolaTurmaEBimestre(int ano, string escolaId, long turmaId, int bimestre, long componenteCurricularEolId)
        {
            var query = @"select
	                            1
                            from
	                            plano_anual
                            where
	                            ano = @ano
	                            and escola_id = @escolaId
	                            and bimestre = @bimestre
	                            and turma_id = @turmaId
	                            and componente_curricular_eol_id = @componenteCurricularEolId";

            return database.Conexao.Query<bool>(query, new { ano, escolaId, turmaId, bimestre, componenteCurricularEolId }).SingleOrDefault();
        }
    }
}