﻿using SME.SGP.Dominio;
using System.ComponentModel.DataAnnotations;

namespace SME.SGP.Infra
{
    public class FiltroPlanoAnualBimestreExpandidoDto
    {
        [Required(ErrorMessage = "O ano deve ser informado")]
        public int AnoLetivo { get; set; }

        [Range(1, long.MaxValue, ErrorMessage = "A disciplina deve ser informada")]
        public long ComponenteCurricularEolId { get; set; }

        [Required(ErrorMessage = "A escola deve ser informada")]
        public string EscolaId { get; set; }

        [EnumeradoRequirido(ErrorMessage = "É obrigatorio informar o tipo de modalidade")]
        public Modalidade ModalidadePlanoAnual { get; set; }

        [Required(ErrorMessage = "A turma deve ser informada")]
        public int TurmaId { get; set; }
    }
}