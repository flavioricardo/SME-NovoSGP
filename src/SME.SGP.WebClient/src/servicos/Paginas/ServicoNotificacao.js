import { erros, erro, sucesso } from '~/servicos/alertas';
import api from '~/servicos/api';
import {
  naoLidas,
  notificacoesLista,
} from '~/redux/modulos/notificacoes/actions';
import { store } from '~/redux';

class ServicoNotificacao {
  excluir = async (notificacoesId, callback) => {
    api
      .delete('v1/notificacoes/', {
        data: notificacoesId,
      })
      .then(resposta => {
        if (resposta.data) {
          resposta.data.forEach(resultado => {
            if (resultado.sucesso) {
              sucesso(resultado.mensagem);
            } else {
              erro(resultado.mensagem);
            }
          });
        }
        if (callback) callback();
      })
      .catch(listaErros => erros(listaErros));
  };

  marcarComoLida = (idsNotificacoes, callback) => {
    api
      .put('v1/notificacoes/status/lida', idsNotificacoes)
      .then(resposta => {
        if (resposta.data) {
          resposta.data.forEach(resultado => {
            if (resultado.sucesso) {
              sucesso(resultado.mensagem);
            } else {
              erro(resultado.mensagem);
            }
          });
        }
        if (callback) callback();
      })
      .catch(listaErros => erros(listaErros));
  };

  buscaNotificacoesPorAnoRf = async (ano, rf) => {
    await api
      .get(`v1/notificacoes/resumo?anoLetivo=${ano}&usuarioRf=${rf}`)
      .then(res => {
        if (res.data) {
          store.dispatch(naoLidas(res.data.quantidadeNaoLidas));
          store.dispatch(notificacoesLista(res.data.notificacoes));
        }
      });
  };
}

export default new ServicoNotificacao();
