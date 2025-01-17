# SME-NovoSGP-Api
Este projeto visa servir de backend com recursos Rest para o novo projeto SGP.

------------



Configuração inicial de ambiente de desenvolvimento

**1- Instalar Docker**

##### BASE DE DADOS

Para ter a base de dados disponível para desenvolvimento, executar o comando docker na **raiz da solução**
Obs.: Lembrar de atualizar a solução via git para receber as últimas atualizações
```
docker-compose -f .\docker-compose.database.yml up
```

Com este comando, a base de dados estará disponível, com todos os scripts já aplicados.

###### Variáveis de ambiente
> Informações sensíveis como string de conexão deverão ser mantidas em variáveis de ambiente. 

-  Adicionar nas variáveis de ambiente

	Caso o acesso ao banco sejá por debbug de codigo (VS)	
		- *Nome da variável:* ConnectionStrings__SGP-Postgres
		- *Valor da variável:*  User ID=postgres;Password=postgres;Host=localhost;Port=5432;Database=sgp_db;Pooling=true;
		
	Caso o acesso ao banco seja pelo Docker do backend	
		- *Nome da variável:* ConnectionStrings__SGP-Postgres
		- *Valor da variável:*  User ID=postgres;Password=postgres;Host=sme-db;Port=5432;Database=sgp_db;Pooling=true;
	     
   - *Nome da variável:* Sentry__DSN
   - *Valor da variável:*  {Obter através dos canais de comunicação};

   - *Nome da variável:* ConnectionStrings__SGP-Redis
   - *Valor da variável:*  localhost

   - *Nome da variável:* JwtTokenSettings__IssuerSigningKey
   - *Valor da variável:*  2A3B40C8D2215897C5EF1CC6D7D8469C687D17FDF85E675B6EBD9FBA26615B93805556652B9DDFD96CA9565C8D42EA83EF44CAC3B79AF64B343461B52FBB62EA

