﻿using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SME.SGP.Aplicacao;
using SME.SGP.Dto;
using System.Threading.Tasks;

namespace SME.SGP.Api.Controllers
{
    [ApiController]
    [Route("api/v1/usuarios")]
    [Authorize("Bearer")]
    public class UsuarioController : ControllerBase
    {
        private readonly IComandosUsuario comandosUsuario;

        public UsuarioController(IComandosUsuario comandosUsuario)
        {
            this.comandosUsuario = comandosUsuario;
        }

        [Route("autenticado/email")]
        [HttpPut]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        [ProducesResponseType(typeof(RetornoBaseDto), 601)]
        public async Task<IActionResult> AlterarEmailUsuarioLogado([FromBody]AlterarEmailDto alterarEmailDto)
        {
            await comandosUsuario.AlterarEmailUsuarioLogado(alterarEmailDto.NovoEmail);
            return Ok();
        }

        [Route("imagens/perfil")]
        [HttpPost]
        public IActionResult ModificarImagem([FromBody]ImagemPerfilDto imagemPerfilDto)
        {
            return Ok("https://telegramic.org/media/avatars/stickers/52cae315e8a464eb80a3.png");
        }
    }
}