import { parseFile } from './fileParser.js';
import { displayTable } from './tableRenderer.js';

document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput'); // Campo de upload de arquivo
  const fileUploadForm = document.getElementById('fileUploadForm'); // Formulário de upload
  const output = document.getElementById('output'); // Contêiner de saída

  // Adiciona o evento de envio no formulário
  fileUploadForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Previne o comportamento padrão do formulário

    if (fileInput.files.length === 0) {
      output.textContent = 'Nenhum arquivo selecionado. Por favor, envie um arquivo.';
      return;
    }

    const file = fileInput.files[0];
    const text = await file.text(); // Lê o conteúdo do arquivo
    const parsedData = parseFile(text); // Analisa o conteúdo do arquivo

    displayTable(parsedData, output); // Exibe os dados na tabela
  });
});
