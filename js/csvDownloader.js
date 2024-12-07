export function downloadCSV(headers, rows) {
    const csvContent = [
      headers.join(':'), // Adiciona os cabeçalhos como a primeira linha
      ...rows.map((row) => headers.map((header) => row[header]).join(':')), // Adiciona as linhas de dados
    ].join('\n');
  
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob); // Cria uma URL temporária para o arquivo
    link.download = 'modified_data.csv'; // Define o nome do arquivo para download
    link.click(); // Dispara o download
  }
  