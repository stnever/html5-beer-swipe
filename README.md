# html5-beer-swipe

Para instalar:

```
$ git clone https://github.com/stnever/html5-beer-swipe.git
$ npm i
```

## Dev server

```
$ npm run dev
```

Isto sobe um mini servidor HTTP na porta 8080, e observa os arquivos .js, disparando o bundle (via `microbundle`/`rollup`), 
que empacota os arquivos .js debaixo do diretório `/dist`. Para acessar, use a URL `http://localhost:8080`.

## Gerando build

Para gerar a build, use o comando `npm run build`. Isto não faz watch nos arquivos, apenas gera o bundle.
