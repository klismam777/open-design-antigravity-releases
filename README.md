# Open Design Antigravity — Windows Releases

Canal público de instaladores e atualizações do fork privado Open Design Antigravity.

Este repositório não contém o código-fonte do produto nem dados de usuários. Ele publica somente:

- o instalador Windows x64;
- o checksum SHA-256 do instalador;
- `metadata.json`, consumido pela tela **Sobre → Verificar novamente**;
- o workflow responsável por reproduzir a publicação a partir de uma tag autorizada do repositório privado.

## Atualização estável

O aplicativo consulta:

`https://github.com/klismam777/open-design-antigravity-releases/releases/latest/download/metadata.json`

Tags de origem aceitas seguem o formato `antigravity-vX.Y.Z`. O workflow publica a versão correspondente como `vX.Y.Z` neste repositório.

## Segurança

- O acesso ao código privado usa uma deploy key exclusiva e somente leitura.
- O workflow não executa em pull requests.
- Toda tag é validada antes da compilação.
- O instalador atual não possui assinatura de código comercial; o checksum publicado permite verificar sua integridade.

O Open Design e este canal de distribuição preservam a licença Apache-2.0 e as atribuições do projeto original.

