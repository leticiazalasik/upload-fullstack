import { 
  Controller,         // Importa o decorador Controller, que define a classe como um controlador no NestJS.
  Post,               // Importa o decorador Post, que mapeia a função como um manipulador de requisições HTTP POST.
  UseInterceptors,    // Importa o decorador UseInterceptors, que permite usar interceptadores para manipular a requisição.
  UploadedFile,       // Importa o decorador UploadedFile, que indica que um arquivo será enviado via POST.
  BadRequestException // Importa a exceção BadRequestException, que é usada para lançar erros de requisição malfeita.
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';  // Importa o FileInterceptor, que é utilizado para interceptar e processar arquivos enviados via POST.
import { createWriteStream } from 'fs';                      // Importa o createWriteStream, usado para gravar um arquivo no sistema de arquivos.
import { join } from 'path';                                  // Importa o join, que é utilizado para construir caminhos de arquivos de forma segura e cruzada entre sistemas operacionais.
import { UploadResponse } from '../interfaces/upload.interface'; // Importa a interface UploadResponse que define a estrutura de resposta após o upload.

@Controller('upload') // Define o controlador para a rota 'upload'.
export class UploadController {
@Post() // Define que o método a seguir será chamado para requisições POST.
@UseInterceptors(FileInterceptor('file')) // Aplica o interceptor FileInterceptor para processar o arquivo enviado, pegando o campo 'file' do corpo da requisição.
async uploadFile(
  @UploadedFile() file: Express.Multer.File // O decorador @UploadedFile pega o arquivo enviado e o passa como parâmetro para o método 'uploadFile'.
): Promise<UploadResponse> {  // Define o tipo de retorno esperado para a função, que é uma Promise de UploadResponse.
  
  if (!file) {  // Verifica se não foi enviado nenhum arquivo na requisição.
    throw new BadRequestException('Nenhum arquivo enviado');  // Se não houver arquivo, lança uma exceção 400 com a mensagem 'Nenhum arquivo enviado'.
  }

  try {
    // Definindo o caminho onde o arquivo será salvo no servidor.
    const uploadPath = join(__dirname, '..', '..', 'uploads');  // Usa o join para concatenar o caminho onde os arquivos serão armazenados (a pasta 'uploads' localizada no diretório raiz do projeto).
    
    // Cria um fluxo de escrita para o arquivo no caminho de upload.
    const writeStream = createWriteStream(
      join(uploadPath, file.originalname)  // Define o nome do arquivo usando o nome original do arquivo enviado.
    );
    
    writeStream.write(file.buffer); // Escreve o conteúdo do arquivo (em buffer) no arquivo destino.
    writeStream.end(); // Finaliza a gravação do arquivo.

    // Retorna um objeto com a resposta de sucesso, incluindo o nome do arquivo, tamanho e tipo de mídia.
    return {
      message: 'Arquivo enviado com sucesso',  // Mensagem de sucesso após o upload.
      filename: file.originalname,            // Nome do arquivo original.
      size: file.size,                        // Tamanho do arquivo enviado.
      type: file.mimetype                     // Tipo MIME do arquivo (por exemplo, 'image/jpeg').
    };

  } catch (error) {
    // Se ocorrer algum erro durante o processamento ou gravação do arquivo, lança uma exceção 400.
    throw new BadRequestException('Erro ao processar arquivo');
  }
}
}
