import { downloadCSV } from './csvDownloader.js';

export function displayTable({ headers, rows }, output) {
  if (rows.length === 0) return;

  const tableContainer = document.createElement('div');
  tableContainer.className = 'table-responsive';

  const table = document.createElement('table');
  table.className = 'table table-bordered';

  // Renderiza o cabeçalho da tabela
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  headers.forEach((header) => {
    const th = document.createElement('th');
    th.textContent = header;
    headerRow.appendChild(th);
  });
  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Renderiza o corpo da tabela
  const tbody = document.createElement('tbody');
  rows.forEach((row, rowIndex) => {
    const tr = document.createElement('tr');
    headers.forEach((header) => {
      const td = document.createElement('td');
      const input = document.createElement('input');
      input.type = 'text';
      input.value = row[header];
      input.className = 'form-control';
      input.dataset.row = rowIndex;
      input.dataset.column = header;

      input.addEventListener('input', (event) => {
        const { row, column } = event.target.dataset;
        rows[row][column] = event.target.value;
      });

      td.appendChild(input);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  tableContainer.appendChild(table);

  // Cria o botão para baixar o CSV modificado
  const downloadButton = document.createElement('button');
  downloadButton.className = 'btn btn-primary mb-3';
  downloadButton.textContent = 'Baixar CSV Modificado';
  downloadButton.addEventListener('click', () => downloadCSV(headers, rows));

  output.innerHTML = ''; // Limpa o contêiner de saída
  output.appendChild(downloadButton);
  output.appendChild(tableContainer);
}
