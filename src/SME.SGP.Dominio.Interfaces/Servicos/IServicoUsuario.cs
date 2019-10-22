﻿using SME.SGP.Infra;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SME.SGP.Dominio.Interfaces
{
    public interface IServicoUsuario
    {
        Task AlterarEmailUsuarioPorLogin(string login, string novoEmail);

        Task AlterarEmailUsuarioPorRfOuInclui(string codigoRf, string novoEmail);

        string ObterClaim(string nomeClaim);

        string ObterLoginAtual();

        IEnumerable<Permissao> ObterPermissoes();

        string ObterRf();

        Usuario ObterUsuarioPorCodigoRfLoginOuAdiciona(string codigoRf, string login = "");

        Task PodeModificarPerfil(string perfilParaModificar, string login);
    }
}