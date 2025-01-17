import axios from 'axios';
import urlBase from './variaveis';
import { store } from '~/redux';
import history from '~/servicos/history';
import { URL_LOGIN } from '~/constantes/url';
import { Deslogar } from '~/redux/modulos/usuario/actions';
import { getObjetoStorageUsuario} from '~/servicos/servico-navegacao';

let url = '';

urlBase().then(resposta => (url = resposta.data));

const api = axios.create({
  baseURL: url,
});

api.interceptors.request.use(async config => {
  const token = store.getState().usuario.token;

  if (!url) {
    url = await urlBase();
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  config.baseURL = url;

  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    const autenticacao = error.response && error.response.config.url.includes(
      '/api/v1/autenticacao'
    );

    if (error.response && error.response.status === 401 && !autenticacao) {
      const path = window.location.pathname;

      store.dispatch(Deslogar());

      history.push(`${URL_LOGIN}/${btoa(path)}`);

      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

export default api;
