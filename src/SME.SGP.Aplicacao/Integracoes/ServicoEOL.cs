﻿using Newtonsoft.Json;
using SME.SGP.Aplicacao.Integracoes.Respostas;
using SME.SGP.Dominio;
using SME.SGP.Dto;
using SME.SGP.Infra;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace SME.SGP.Aplicacao.Integracoes
{
    public class ServicoEOL : IServicoEOL
    {
        private readonly HttpClient httpClient;

        public ServicoEOL(HttpClient httpClient)
        {
            this.httpClient = httpClient;
        }

        public async Task<AlterarSenhaRespostaDto> AlterarSenha(string login, string novaSenha)
        {
            httpClient.DefaultRequestHeaders.Clear();

            var valoresParaEnvio = new List<KeyValuePair<string, string>> {
                { new KeyValuePair<string, string>("usuario", login) },
                { new KeyValuePair<string, string>("senha", novaSenha) }};

            var resposta = await httpClient.PostAsync($"AutenticacaoSgp/AlterarSenha", new FormUrlEncodedContent(valoresParaEnvio));

            return new AlterarSenhaRespostaDto
            {
                Mensagem = resposta.IsSuccessStatusCode ? "" : await resposta.Content.ReadAsStringAsync(),
                StatusRetorno = (int)resposta.StatusCode,
                SenhaAlterada = resposta.IsSuccessStatusCode
            };
        }

        public async Task<UsuarioEolAutenticacaoRetornoDto> Autenticar(string login, string senha)
        {
            httpClient.DefaultRequestHeaders.Clear();

            IList<KeyValuePair<string, string>> valoresParaEnvio = new List<KeyValuePair<string, string>> {
                { new KeyValuePair<string, string>("login", login) },
                { new KeyValuePair<string, string>("senha", senha) }};

            var resposta = await httpClient.PostAsync($"AutenticacaoSgp/Autenticar", new FormUrlEncodedContent(valoresParaEnvio));

            if (resposta.IsSuccessStatusCode)
            {
                var json = await resposta.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<UsuarioEolAutenticacaoRetornoDto>(json);
            }
            else return null;
        }

        public async Task<AbrangenciaRetornoEolDto> ObterAbrangencia(string login, Guid perfil)
        {
            var resposta = await httpClient.GetAsync($"funcionarios/{login}/perfis/{perfil.ToString()}/turmas");

            if (resposta.IsSuccessStatusCode)
            {
                var json = await resposta.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<AbrangenciaRetornoEolDto>(json);
            }
            return null;
        }

        public async Task<AbrangenciaRetornoEolDto> ObterAbrangenciaParaSupervisor(string[] uesIds)
        {
            var json = new StringContent(JsonConvert.SerializeObject(uesIds), Encoding.UTF8, "application/json");

            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Get,
                RequestUri = new Uri(httpClient.BaseAddress.AbsoluteUri + "funcionarios/turmas"),
                Content = json
            };

            var resposta = await httpClient.SendAsync(request);

            if (resposta.IsSuccessStatusCode)
            {
                var jsonRetorno = await resposta.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<AbrangenciaRetornoEolDto>(jsonRetorno);
            }
            else throw new NegocioException("Houve erro ao tentar obter a abrangência do Eol");
        }

        public async Task<IEnumerable<DisciplinaResposta>> ObterDisciplinasParaPlanejamento(long codigoTurma, string login, Guid perfil)
        {
            var url = $"funcionarios/{login}/perfis/{perfil}/turmas/{codigoTurma}/disciplinas/planejamento";
            return await ObterDisciplinas(url);
        }

        public async Task<IEnumerable<DisciplinaResposta>> ObterDisciplinasPorCodigoTurmaLoginEPerfil(long codigoTurma, string login, Guid perfil)
        {
            var url = $"funcionarios/{login}/perfis/{perfil}/turmas/{codigoTurma}/disciplinas";

            return await ObterDisciplinas(url);
        }

        public IEnumerable<DreRespostaEolDto> ObterDres()
        {
            var resposta = httpClient.GetAsync("dres").Result;
            if (resposta.IsSuccessStatusCode)
            {
                var json = resposta.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<IEnumerable<DreRespostaEolDto>>(json);
            }
            return null;
        }

        public IEnumerable<EscolasRetornoDto> ObterEscolasPorCodigo(string[] codigoUes)
        {
            httpClient.DefaultRequestHeaders.Clear();

            var resposta = httpClient.PostAsync("escolas", new StringContent(JsonConvert.SerializeObject(codigoUes), Encoding.UTF8, "application/json-patch+json")).Result;
            if (resposta.IsSuccessStatusCode)
            {
                var json = resposta.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<IEnumerable<EscolasRetornoDto>>(json);
            }
            return null;
        }

        public IEnumerable<EscolasRetornoDto> ObterEscolasPorDre(string dreId)
        {
            httpClient.DefaultRequestHeaders.Clear();

            var resposta = httpClient.GetAsync($"DREs/{dreId}/escolas").Result;
            if (resposta.IsSuccessStatusCode)
            {
                var json = resposta.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<IEnumerable<EscolasRetornoDto>>(json);
            }
            return null;
        }

        public IEnumerable<UsuarioEolRetornoDto> ObterFuncionariosPorCargoUe(string ueId, long cargoId)
        {
            var resposta = httpClient.GetAsync($"escolas/{ueId}/funcionarios/cargos/{cargoId}").Result;
            if (resposta.IsSuccessStatusCode)
            {
                var json = resposta.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<IEnumerable<UsuarioEolRetornoDto>>(json);
            }
            return null;
        }

        public async Task<IEnumerable<UsuarioEolRetornoDto>> ObterFuncionariosPorUe(BuscaFuncionariosFiltroDto buscaFuncionariosFiltroDto)
        {
            var jsonParaPost = new StringContent(JsonConvert.SerializeObject(buscaFuncionariosFiltroDto), UnicodeEncoding.UTF8, "application/json");

            var resposta = await httpClient.PostAsync("funcionarios/", jsonParaPost);

            if (resposta.IsSuccessStatusCode)
            {
                var json = await resposta.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<IEnumerable<UsuarioEolRetornoDto>>(json);
            }

            return null;
        }

        public IEnumerable<ProfessorTurmaReposta> ObterListaTurmasPorProfessor(string codigoRf)
        {
            var resposta = httpClient.GetAsync($"professores/{codigoRf}/turmas").Result;
            if (resposta.IsSuccessStatusCode)
            {
                var json = resposta.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<IEnumerable<ProfessorTurmaReposta>>(json);
            }
            return null;
        }

        public async Task<MeusDadosDto> ObterMeusDados(string login)
        {
            var url = $"AutenticacaoSgp/{login}/dados";
            var resposta = await httpClient.GetAsync(url);

            if (!resposta.IsSuccessStatusCode)
            {
                throw new NegocioException("Não foi possível obter os dados do usuário");
            }
            var json = await resposta.Content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<MeusDadosDto>(json);
        }

        public async Task<UsuarioEolAutenticacaoRetornoDto> ObterPerfisPorLogin(string login)
        {
            var resposta = await httpClient.GetAsync($"autenticacaoSgp/CarregarPerfisPorLogin/{login}");

            if (resposta.IsSuccessStatusCode)
            {
                var json = await resposta.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<UsuarioEolAutenticacaoRetornoDto>(json);
            }
            return null;
        }

        public async Task<int[]> ObterPermissoesPorPerfil(Guid perfilGuid)
        {
            var resposta = await httpClient.GetAsync($"autenticacaoSgp/CarregarPermissoesPorPerfil/{perfilGuid}");

            if (resposta.IsSuccessStatusCode)
            {
                var json = await resposta.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<int[]>(json);
            }
            return null;
        }

        public IEnumerable<SupervisoresRetornoDto> ObterSupervisoresPorCodigo(string[] codigoSupervisores)
        {
            var resposta = httpClient.PostAsync("funcionarios/supervisores", new StringContent(JsonConvert.SerializeObject(codigoSupervisores), Encoding.UTF8, "application/json-patch+json")).Result;
            if (resposta.IsSuccessStatusCode)
            {
                var json = resposta.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<IEnumerable<SupervisoresRetornoDto>>(json);
            }
            return null;
        }

        public IEnumerable<SupervisoresRetornoDto> ObterSupervisoresPorDre(string dreId)
        {
            var resposta = httpClient.GetAsync($"dres/{dreId}/supervisores").Result;
            if (resposta.IsSuccessStatusCode)
            {
                var json = resposta.Content.ReadAsStringAsync().Result;
                return JsonConvert.DeserializeObject<IEnumerable<SupervisoresRetornoDto>>(json);
            }
            return null;
        }

        public async Task<IEnumerable<TurmaDto>> ObterTurmasAtribuidasAoProfessorPorEscolaEAnoLetivo(string rfProfessor, string codigoEscola, int anoLetivo)
        {
            var resposta = await httpClient.GetAsync($"professores/{rfProfessor}/escolas/{codigoEscola}/turmas/anos_letivos/{anoLetivo}");

            if (resposta.IsSuccessStatusCode)
            {
                var json = await resposta.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<IEnumerable<TurmaDto>>(json);
            }
            return null;
        }

        public async Task ReiniciarSenha(string codigoRf)
        {
            httpClient.DefaultRequestHeaders.Clear();

            IList<KeyValuePair<string, string>> valoresParaEnvio = new List<KeyValuePair<string, string>> {
                { new KeyValuePair<string, string>("login", codigoRf) }};

            var resposta = await httpClient.PostAsync($"AutenticacaoSgp/ReiniciarSenha", new FormUrlEncodedContent(valoresParaEnvio));

            if (!resposta.IsSuccessStatusCode)
                throw new NegocioException("Não foi possível reiniciar a senha deste usuário");
        }

        private async Task<IEnumerable<DisciplinaResposta>> ObterDisciplinas(string url)
        {
            var resposta = await httpClient.GetAsync(url);

            if (resposta.IsSuccessStatusCode)
            {
                var json = await resposta.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<IEnumerable<DisciplinaResposta>>(json);
            }
            return null;
        }
    }
}