# upload-fullstack

Praticar a criação de uma aplicação web moderna para upload de arquivos com front e back-end para estudo de Streams.
O createWriteStream, da biblioteca fs, cria um fluxo de escrita que permite gravar um arquivo de maneira eficiente no sistema de arquivos. Isso é importante, pois os arquivos podem ser grandes e a escrita direta no disco usando streams evita sobrecarregar a memória do servidor ao lidar com arquivos de grandes dimensões.

O objetivo principal é que os arquivos sejam adicionados e serão salvos na pasta de uploads. Além disso há algumas funcionalidades extras que melhoram e experiência:

#### :small_blue_diamond: Validação de arquivos: valida se existe um arquivo, tamanho do arquivo e tipos.  

#### :small_blue_diamond: "Arrastar arquivos": Drag permite que o usuário arraste um item (geralmente um arquivo ou objeto) de um local e o solte em outro, facilitando a interação e Drop responsável pelo soltar o arquivo em um local onde será processsado. 

#### :small_blue_diamond: Lista de arquivos enviados: Cria uma lista no front-end com o nome e o tamnho de todos os arquivos que foram enviados naquela sessão. 

#### :small_blue_diamond: Barra de status de progresso: Barra que é preenchida conforme ocorre o carregamento do arquivo. 


 
## 👨‍💻 Tecnologias Utilizadas:

TypeScript
NestJS
Tailwind 
CSS
React 
NestJS
