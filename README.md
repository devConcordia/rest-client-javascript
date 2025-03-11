
# REST Client 

Esse projeto é uma API para consumir um serviço REST com Javascript.

> [!WARN] 
> Atentis-se as questões de CORS e lembre-se, dependendo de sua aplicação, a chave do serviço que estiver consumindo pode ficar exposta ao realizar requisições diretas do browser.

> [!NOTE]
> Esse projeto utiliza o [Forge](https://github.com/digitalbazaar/forge) para as operações de criptografia.

## Uso Básico

```javascript

import api from "./path/to/source/index.mjs";


const rest = new api.RestClient( "https://domain" );

```

Para realizar uma requisição, pode utilizar o metodo `rest.request( method, path, data, callbackHandler )`.

```javascript

function callbackHandler(response) { ... }

/// GET, POST, PUT, PATCH, DELETE
const method = "GET";
const path = "/path";
const data = null;

rest.request( method, path, data, callbackHandler );

```

O parâmetro `callbackHandler` é invocado com os dados da resposta do servidor.
Pode ser `NULL` quando há falhas na requisição, como por exemplo falhas de conexão e CORS.

Para simplificação das requsições, pode ser realizados:

```javascript

rest.get( path, callbackHandler );
rest.delete( path, callbackHandler );

rest.post( path, data, callbackHandler );
rest.put( path, data, callbackHandler );
rest.patch( path, data, callbackHandler );

```

### Authorization

Para adicionar o Authorization na requisição, use o metodo `rest.setAuth( auth )`,
em que `auth` deve ter sido inciado com algum das classes `api.auth.Basic`, `api.auth.Bearer` ou `api.auth.JsonWebToken`.

```javascript

///
const auth = new api.auth.JsonWebToken(
	{ alg: 'RS256', ... }, 				/// header
	{ sub: 'user name', ... }, 			/// payload
	key  								/// privateKey
);

///
rest.setAuth( auth );

```
> [!NOTE] 
> A classe `JsonWebToken` adiciona e atualiza (a cada 5 minutos) os campo `iat` (*issued at*, emitiodo em) e `exp` (*expiration time*, expira em) no `payload`.

