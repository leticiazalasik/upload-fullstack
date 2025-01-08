import React, { useState, useCallback } from 'react'; // Importa hooks do React para gerenciamento de estado e funções de callback
import { FileUploadState, UploadResponse } from '../types/upload.types'; // Importa tipos personalizados para o estado do upload e a resposta da API
import { validateFile } from '../utils/fileValidation'; // Importa a função de validação de arquivos

// Interface para armazenar os arquivos enviados
interface UploadedFile {
  filename: string; // Nome do arquivo enviado
  size: number; // Tamanho do arquivo em bytes
  uploadedAt: Date; // Data em que o arquivo foi enviado
}

const FileUpload: React.FC = () => {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null, // Arquivo que será enviado
    status: '', // Status da operação (ex: erro, sucesso)
    progress: 0 // Progresso do upload
  });

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]); // Armazena a lista de arquivos enviados

  // Função que lida com a mudança de arquivo selecionado (via input)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) { // Se um arquivo for selecionado
      const file = e.target.files[0]; // Pega o arquivo selecionado
      const validation = validateFile(file); // Valida o arquivo usando a função importada

      if (!validation.isValid) { // Se o arquivo não for válido
        setUploadState({
          ...uploadState,
          file: null, // Limpa o arquivo
          status: validation.message // Exibe a mensagem de erro
        });
      } else {
        setUploadState({
          ...uploadState,
          file: file, // Salva o arquivo selecionado
          status: 'Arquivo selecionado' // Exibe mensagem de sucesso
        });
      }
    }
  };

  // Função que lida com o evento de drag and drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Evita o comportamento padrão do navegador
    if (e.dataTransfer.files && e.dataTransfer.files[0]) { // Se um arquivo for solto
      const file = e.dataTransfer.files[0]; // Pega o arquivo soltado
      const validation = validateFile(file); // Valida o arquivo usando a função importada

      if (!validation.isValid) { // Se o arquivo não for válido
        setUploadState({
          ...uploadState,
          file: null, // Limpa o arquivo
          status: validation.message // Exibe a mensagem de erro
        });
      } else {
        setUploadState({
          ...uploadState,
          file: file, // Salva o arquivo
          status: 'Arquivo selecionado' // Exibe mensagem de sucesso
        });
      }
    }
  };

  // Função para fazer o upload do arquivo
  const handleUpload = useCallback(async () => {
    if (!uploadState.file) { // Se não houver arquivo para enviar
      setUploadState(prev => ({
        ...prev,
        status: 'Por favor, selecione um arquivo' // Exibe mensagem de erro
      }));
      return;
    }

    const formData = new FormData(); // Cria um FormData para enviar o arquivo
    formData.append('file', uploadState.file); // Adiciona o arquivo ao FormData

    const xhr = new XMLHttpRequest(); // Cria uma requisição XMLHttpRequest

    xhr.upload.onprogress = (event) => { // Define o progresso do upload
      const progress = (event.loaded / event.total) * 100; // Calcula a porcentagem de progresso
      setUploadState(prev => ({
        ...prev,
        progress, // Atualiza o progresso
        status: `Enviando: ${Math.round(progress)}%` // Exibe a porcentagem
      }));
    };

    xhr.onload = () => { // Quando a requisição for concluída com sucesso
      if (xhr.status === 201) { // Se o status da resposta for 201 (sucesso)
        const response: UploadResponse = JSON.parse(xhr.response); // Pega a resposta do servidor
        // Adiciona o arquivo enviado à lista de arquivos
        setUploadedFiles(prevFiles => [
          ...prevFiles,
          {
            filename: uploadState.file!.name, // Nome do arquivo
            size: uploadState.file!.size, // Tamanho do arquivo
            uploadedAt: new Date() // Data do envio
          }
        ]);
        setUploadState(prev => ({
          ...prev,
          status: response.message, // Exibe a mensagem de sucesso
          progress: 100 // Marca o progresso como 100%
        }));
      } else {
        setUploadState(prev => ({
          ...prev,
          status: 'Erro ao enviar arquivo', // Se houver erro, exibe a mensagem de erro
          progress: 0 // Zera o progresso
        }));
      }
    };

    xhr.onerror = () => { // Se ocorrer um erro durante o envio
      setUploadState(prev => ({
        ...prev,
        status: 'Erro na conexão', // Exibe a mensagem de erro
        progress: 0 // Zera o progresso
      }));
    };

    xhr.open('POST', 'http://localhost:3000/upload'); // Define a URL para onde o arquivo será enviado
    xhr.send(formData); // Envia o FormData com o arquivo
  }, [uploadState.file]); // Dependência de 'uploadState.file', para refazer a função sempre que o arquivo mudar

  return (
    <div className="max-w-xl mx-auto p-6"> {/* Container principal */}
      <div className="bg-white rounded-lg shadow-md p-6"> {/* Caixa de upload */}
        <h2 className="text-2xl font-bold mb-6 text-gray-800"> {/* Título */}
          Upload de Arquivo
        </h2>
        
        <div className="mb-4"> {/* Seção de seleção de arquivo */}
          <label className="block text-gray-700 mb-2"> {/* Label do input */}
            Selecione um arquivo:
          </label>
          <input
            type="file" // Campo de input para selecionar um arquivo
            onChange={handleFileChange} // Chama a função handleFileChange quando o arquivo é selecionado
            className="block w-full text-gray-700 bg-gray-100 rounded-lg cursor-pointer" // Estilos para o input
          />
        </div>

        {/* Seção de Drag and Drop */}
        <div
          className="bg-gray-100 border-2 border-gray-300 p-4 rounded-lg mb-4" // Estilos para a área de drag and drop
          onDrop={handleDrop} // Chama a função handleDrop quando um arquivo é solto
          onDragOver={(e) => e.preventDefault()} // Previne o comportamento padrão de drag
        >
          <p>Arraste e solte um arquivo aqui</p>
        </div>

        <button
          onClick={handleUpload} // Chama a função handleUpload quando o botão é clicado
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full mb-4"
        >
          Enviar Arquivo
        </button>

        {uploadState.progress > 0 && ( // Exibe a barra de progresso se houver progresso
          <div className="mb-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${uploadState.progress}%` }} // Define a largura da barra de progresso
              ></div>
            </div>
          </div>
        )}

        {uploadState.status && ( // Exibe o status de upload (sucesso ou erro)
          <p className={`text-center ${
            uploadState.status.includes('sucesso') 
              ? 'text-green-600' 
              : uploadState.status.includes('Erro') 
                ? 'text-red-600' 
                : 'text-blue-600'
          }`}>
            {uploadState.status}
          </p>
        )}

        {/* Lista de arquivos enviados */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-700">Arquivos Enviados</h3>
          {uploadedFiles.length > 0 ? ( // Se houver arquivos enviados
            <ul className="mt-4">
              {uploadedFiles.map((file, index) => ( // Exibe cada arquivo enviado
                <li key={index} className="mb-2">
                  <span className="font-bold">{file.filename}</span> - 
                  <span>{(file.size / 1024).toFixed(2)} KB</span> - 
                  <span>{file.uploadedAt.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Nenhum arquivo enviado ainda.</p> // Exibe uma mensagem se não houver arquivos enviados
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUpload;
