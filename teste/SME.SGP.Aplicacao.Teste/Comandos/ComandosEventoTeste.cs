﻿using Moq;
using SME.SGP.Dominio.Interfaces;
using Xunit;

namespace SME.SGP.Aplicacao.Teste.Comandos
{
    public class ComandosEventoTeste
    {
        private readonly Mock<IRepositorioEvento> repositorioEvento;
        private ComandosEvento comandosEvento;
        private Mock<IServicoEvento> servicoEvento;

        public ComandosEventoTeste()
        {
            repositorioEvento = new Mock<IRepositorioEvento>();
            servicoEvento = new Mock<IServicoEvento>();
            comandosEvento = new ComandosEvento(repositorioEvento.Object, servicoEvento.Object);
        }

        [Fact]
        public void Deve_Excluir_Eventos()
        {
            //ARRANGE
            var evento1 = new Dominio.Evento() { Id = 1 };
            repositorioEvento.Setup(a => a.ObterPorId(1)).Returns(evento1);

            //ACT
            comandosEvento.Excluir(new long[] { 1 });

            //ASSERT
            repositorioEvento.Verify(a => a.ObterPorId(evento1.Id), Times.Once);
            repositorioEvento.Verify(a => a.Salvar(evento1), Times.Once);
        }
    }
}