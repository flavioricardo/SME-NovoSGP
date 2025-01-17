﻿using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Configuration;
using Sentry;
using SME.SGP.Dominio;

namespace SME.SGP.Api.Middlewares
{
    public class FiltroExcecoesAttribute : ExceptionFilterAttribute
    {
        public readonly string sentryDSN;

        public FiltroExcecoesAttribute(IConfiguration configuration)
        {
            if (configuration == null)
            {
                throw new System.ArgumentNullException(nameof(configuration));
            }
            sentryDSN = configuration.GetValue<string>("Sentry:DSN");
        }

        public override void OnException(ExceptionContext context)
        {
            using (SentrySdk.Init(sentryDSN))
            {
                SentrySdk.CaptureException(context.Exception);
            }

            context.Result = context.Exception is NegocioException
                ? new ResultadoBaseResult(context.Exception.Message, ((NegocioException)context.Exception).StatusCode)
                : new ResultadoBaseResult("Ocorreu um erro interno. Favor contatar o suporte.", 500);

            base.OnException(context);
        }
    }
}