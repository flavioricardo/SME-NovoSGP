﻿using Microsoft.AspNetCore.Mvc;
using SME.SGP.Api.Filtros;
using SME.SGP.Aplicacao;
using SME.SGP.Dto;
using System.Collections.Generic;

namespace SME.SGP.Api.Controllers
{
    [ApiController]
    [Route("api/v1/supervisores")]
    [ValidaDto]
    public class SupervisorController : ControllerBase
    {
        private readonly IConsultasSupervisor consultasSupervisor;

        public SupervisorController(IConsultasSupervisor consultasSupervisor)
        {
            this.consultasSupervisor = consultasSupervisor ?? throw new System.ArgumentNullException(nameof(consultasSupervisor));
        }

        [HttpPost("atribuir-ue")]
        [ProducesResponseType(200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        public IActionResult AtribuirUE(AtribuicaoSupervisorUEDto atribuicaoSupervisorUEDto, [FromServices] IComandosSupervisor comandosSupervisor)
        {
            comandosSupervisor.AtribuirUE(atribuicaoSupervisorUEDto);
            return Ok();
        }

        [HttpGet("dre/{dreId}")]
        [ProducesResponseType(typeof(IEnumerable<SupervisorDto>), 200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        public IActionResult ObterSupervidoresPorDreENome(string dreId, [FromQuery]BuscaSupervisorPorNomeDto supervisorNome)
        {
            return Ok(consultasSupervisor.ObterPorDreENomeSupervisor(supervisorNome.Nome, dreId));
        }

        [HttpGet("dre/{dreId}/vinculo-escolas")]
        [ProducesResponseType(typeof(IEnumerable<SupervisorEscolasDto>), 200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        public IActionResult ObterSupervisoresEEscolasPorDre(string dreId)
        {
            return Ok(consultasSupervisor.ObterPorDre(dreId));
        }

        [HttpGet("{supervisorId}/dre/{dreId}")]
        [ProducesResponseType(typeof(IEnumerable<SupervisorEscolasDto>), 200)]
        [ProducesResponseType(typeof(RetornoBaseDto), 500)]
        public IActionResult ObterSupervisoresEEscolasPorSupervsiroEDre(string supervisorId, string dreId)
        {
            return Ok(consultasSupervisor.ObterPorDreESupervisor(supervisorId, dreId));
        }
    }
}