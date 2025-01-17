﻿using Microsoft.AspNetCore.Mvc;
using SME.SGP.Api.Filtros;
using SME.SGP.Aplicacao;
using SME.SGP.Infra;
using System.Threading.Tasks;

namespace SME.SGP.Api.Controllers
{
    [ApiController]
    [Route("api/v1/planos/anual")]
    [ValidaDto]
    public class PlanoAnualController : ControllerBase
    {
        [HttpPost("migrar")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        [Permissao(Permissao.PA_I, Permissao.PA_A, Policy = "Bearer")]
        public async Task<IActionResult> Migrar(MigrarPlanoAnualDto migrarPlanoAnualDto, [FromServices]IComandosPlanoAnual comandosPlanoAnual)
        {
            await comandosPlanoAnual.Migrar(migrarPlanoAnualDto);
            return Ok();
        }

        [HttpPost("obter")]
        [ProducesResponseType(typeof(PlanoAnualCompletoDto), 200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        [Permissao(Permissao.PA_C, Policy = "Bearer")]
        public async Task<IActionResult> Obter(FiltroPlanoAnualDto filtroPlanoAnualDto, [FromServices]IConsultasPlanoAnual consultasPlanoAnual)
        {
            return Ok(await consultasPlanoAnual.ObterPorEscolaTurmaAnoEBimestre(filtroPlanoAnualDto));
        }

        [HttpPost("obter/expandido")]
        [ProducesResponseType(typeof(PlanoAnualCompletoDto), 200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        [Permissao(Permissao.PA_C, Policy = "Bearer")]
        public async Task<IActionResult> ObterExpandido(FiltroPlanoAnualBimestreExpandidoDto filtroPlanoAnualDto, [FromServices]IConsultasPlanoAnual consultasPlanoAnual)
        {
            return Ok(await consultasPlanoAnual.ObterBimestreExpandido(filtroPlanoAnualDto));
        }

        [HttpPost]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        [Permissao(Permissao.PA_I, Permissao.PA_A, Policy = "Bearer")]
        public IActionResult Post(PlanoAnualDto planoAnualDto, [FromServices]IComandosPlanoAnual comandosPlanoAnual)
        {
            comandosPlanoAnual.Salvar(planoAnualDto);
            return Ok();
        }

        [HttpPost("validar-existente")]
        [ProducesResponseType(typeof(bool), 200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        [Permissao(Permissao.PA_C, Policy = "Bearer")]
        public IActionResult ValidarPlanoAnualExistente(FiltroPlanoAnualDto filtroPlanoAnualDto, [FromServices]IConsultasPlanoAnual consultasPlanoAnual)
        {
            return Ok(consultasPlanoAnual.ValidarPlanoAnualExistente(filtroPlanoAnualDto));
        }
    }
}