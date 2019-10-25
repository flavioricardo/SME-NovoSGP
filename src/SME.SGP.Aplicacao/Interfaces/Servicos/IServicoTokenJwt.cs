﻿using SME.SGP.Infra;
using System.Collections.Generic;

namespace SME.SGP.Aplicacao
{
    public interface IServicoTokenJwt
    {
        string GerarToken(string usuarioLogin, string codigoRf, IEnumerable<Permissao> permissionamentos, string guidPerfil);

        bool TemPerfilNoToken(string guid);
    }
}