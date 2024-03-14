![Logo Nagare](https://i.ibb.co/r3jmyPm/image.png)


# Nagare APP

Este projeto visa criar uma ferramenta de gerenciamento de projetos, oferecendo uma plataforma flexível para organizar tarefas em quadros e listas, proporcionando uma experiência de gerenciamento de projetos intuitiva e colaborativa.


## Planejamento do projeto

Afim de um desenvolvimento mais ágil usando a metodologia SCRUM e levando em consideração a ideia do "Dev em T", o projeto foi desenhado no **Figma** e planejado no **Trello**.

Acesse o mockup do projeto no **Figma** [neste link](https://www.figma.com/file/wJQpWsDcl19kgiepqDVW5C/Nagare-team-library?type=design&node-id=0-1&mode=design&t=2RUVoI9kZc8TO4qw-0).

Acesse o gerenciamento do projeto no estilo **SCRUM** no **Trello** [neste link](https://trello.com/b/DbrVKQYL/nagare).


## Aviso importante

Este repositório é somente a parte do front-end do projeto. Para funcionar do modo esperado, deve-se executar também a API que se encontra neste repositório: https://github.com/leopholdo/nagare-kanban-api


## Funcionalidades

- **Registro de usuários** persistindo os dados em banco ou memória.
- **Criptografia de password** com BCrypt.
- **Validações de dados de usuários** em camadas diferentes.
- **Autenticação de usuários**.
- **Comunicação com API** de forma anônima e autenticada via Bearer token.
- **Implementação de uma API segura** por CORS, autenticação e autorização com JWT e Bearer.
- **Reautenticação** automática de tokens expirados.
- **Quadros e listas dinâmicas** para gerenciar projetos e organizar tarefas em listas personalizadas.
- **Personalização de quadros** com diferentes imagens e cores.
- **Cartões de tarefas** com funcionalidades diversas, como adicionar descrição, comentários, etiquetas, checklists, data de entrega, entre outras coisas.
- **Arrastar e soltar** cartões entre listas e ajustar as ordens das listas facilmente.
- **Colaboração em equipe** com a possibilidade de atribuir membros à tarefas.


## Tecnologias utilizada

**Front-end:** VueJS, Vuetify, Pinia, Marked, Vue Draggable Plus (SortableJS) e Vue Advanced Cropper.

**Back-end:** ASP.NET Core 8, Swagger UI, Entity Framework Core, BCrypt, e Authentication JwtBearer.

**Banco de dados:** PostgreSQL.


## Como usar

1. **Configuração do ambiente:**
- Clone e configure o repositório da API [que se encontra neste link](https://github.com/leopholdo/nagare-kanban-api);
- Clone este repositório;
- Instale as dependências necessárias:

**NPM**
```
npm install
```

**YARN**
```
 yarn install
```

3. **Execução do Projeto:**
- Execute o projeto com o comando:
**NPM**
```
npm run dev
```

**YARN**
```
 yarn dev
```
- Abra o navegador e acesse a aplicação pelo endereço http://localhost:5001


## Contribuindo

Contribuições são sempre bem-vindas!

Se você encontrar algum problema ou tiver sugestões, sinta-se à vontade para abrir uma [issue](https://github.com/leopholdo/nagare-kanban/issues/new) ou enviar um [pull request](https://github.com/leopholdo/nagare-kanban/pulls).