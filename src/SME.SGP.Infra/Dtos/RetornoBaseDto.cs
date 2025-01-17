﻿using System.Collections.Generic;

namespace SME.SGP.Infra
{
    public class RetornoBaseDto
    {
        public RetornoBaseDto()
        {
            Mensagens = new List<string>();
        }

        public RetornoBaseDto(string mensagem)
        {
            Mensagens = new List<string>() { mensagem };
        }

        public List<string> Mensagens { get; set; }
    }
}