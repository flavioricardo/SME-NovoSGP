﻿using SME.SGP.Dominio;
using SME.SGP.Dominio.Interfaces;
using SME.SGP.Infra;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SME.SGP.Aplicacao.Integracoes
{
    public class ServicoPerfil : IServicoPerfil
    {
        private readonly IRepositorioPrioridadePerfil repositorioPrioridadePerfil;

        public ServicoPerfil(IRepositorioPrioridadePerfil repositorioPrioridadePerfil)
        {
            this.repositorioPrioridadePerfil = repositorioPrioridadePerfil ?? throw new ArgumentNullException(nameof(repositorioPrioridadePerfil));
        }

        public PerfisPorPrioridadeDto DefinirPerfilPrioritario(IEnumerable<Guid> perfis, Usuario usuario)
        {
            var perfisUsuario = repositorioPrioridadePerfil.ObterPerfisPorIds(perfis);

            usuario.DefinirPerfis(perfisUsuario);

            var perfisPorPrioridade = new PerfisPorPrioridadeDto
            {
                PerfilSelecionado = usuario.ObterPerfilPrioritario(),
                Perfis = MapearPerfisParaDto(perfisUsuario),
                PossuiPerfilSmeOuDre = usuario.PossuiPerfilSmeOuDre(),
                PossuiPerfilSme = usuario.PossuiPerfilSme(),
                PossuiPerfilDre = usuario.PossuiPerfilDre()
            };
            return perfisPorPrioridade;
        }

        private IList<PerfilDto> MapearPerfisParaDto(IEnumerable<PrioridadePerfil> perfisUsuario)
        {
            return perfisUsuario?.Select(c => new PerfilDto
            {
                CodigoPerfil = c.CodigoPerfil,
                NomePerfil = c.NomePerfil
            }).ToList();
        }
    }
}