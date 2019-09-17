﻿using SME.SGP.Dominio;
using System.ComponentModel.DataAnnotations;

namespace SME.SGP.Dto
{
    public class NotificacaoDto
    {
        public int Ano { get; set; }

        [Required(ErrorMessage = "A Categoria é obrigatória.")]
        public NotificacaoCategoria Categoria { get; set; }

        public string DreId { get; set; }
        public string UeId { get; set; }

        [Required(ErrorMessage = "A Mensagem é obrigatória.")]
        [MinLength(3, ErrorMessage = "A Mensagem deve conter no mínimo 3 caracteres.")]
        public string Mensagem { get; set; }
        
        [Required(ErrorMessage = "O tipo é obrigatório.")]
        public NotificacaoTipo Tipo { get; set; }

        [Required(ErrorMessage = "O título é obrigatório.")]
        [MinLength(3, ErrorMessage = "O título deve conter no mínimo 3 caracteres.")]
        public string Titulo { get; set; }

        public string TurmaId { get; set; }

        public string UsuarioRf { get; set; }
    }
}