// src/utils/fileValidation.ts

// Define a interface 'FileValidation' que é usada para tipar o retorno da função de validação.
// 'isValid' indica se o arquivo é válido ou não, e 'message' fornece uma mensagem de status.
export interface FileValidation {
  isValid: boolean;  // Indica se o arquivo é válido (true) ou não (false).
  message: string;   // Mensagem que explica o motivo da validade do arquivo.
}

// Função que valida um arquivo com base no seu tipo e tamanho.
export const validateFile = (file: File): FileValidation => {
  // Define o tamanho máximo do arquivo permitido como 5MB (5 * 1024 * 1024 bytes).
  const MAX_SIZE = 5 * 1024 * 1024; // 5MB
  
  // Define os tipos de arquivos permitidos. No caso, apenas imagens JPEG, PNG e documentos PDF.
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

  // Verifica se o tipo de arquivo não está na lista de tipos permitidos.
  // Se o tipo do arquivo for inválido, retorna um objeto com 'isValid' como false e a mensagem de erro.
  if (!ALLOWED_TYPES.includes(file.type)) {
      return {
          isValid: false,  // Indica que o arquivo não é válido.
          message: 'Tipo de arquivo não permitido'  // Mensagem explicando o erro.
      };
  }

  // Verifica se o tamanho do arquivo excede o tamanho máximo permitido (5MB).
  // Se o arquivo for maior que 5MB, retorna um objeto com 'isValid' como false e a mensagem de erro.
  if (file.size > MAX_SIZE) {
      return {
          isValid: false,  // Indica que o arquivo não é válido.
          message: 'Arquivo muito grande (máximo 5MB)'  // Mensagem explicando o erro.
      };
  }

  // Se o arquivo passar nas validações (tipo e tamanho), retorna que o arquivo é válido.
  return {
      isValid: true,  // Indica que o arquivo é válido.
      message: 'Arquivo válido'  // Mensagem informando que o arquivo é válido.
  };
};
