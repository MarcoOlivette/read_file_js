document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const fileUploadForm = document.getElementById('fileUploadForm');
  const output = document.getElementById('output');

  fileUploadForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (fileInput.files.length === 0) {
      output.textContent = 'No file selected. Please upload a file.';
      return;
    }

    const file = fileInput.files[0];
    const text = await file.text();
    const parsedData = parseFile(text);

    displayTable(parsedData);
  });

  // Function to parse the file
  function parseFile(content) {
    const lines = content.split('\n').filter((line) => line.trim() !== ''); // Remove empty lines
    let headers = lines[0].split(':').map((header) => header.trim()); // First line as headers

    // Handle duplicate headers
    const seenHeaders = new Map();
    headers = headers.map((header) => {
      const count = seenHeaders.get(header) || 0;
      seenHeaders.set(header, count + 1);
      return count > 0 ? `${header}_${count}` : header;
    });

    return {
      headers,
      rows: lines.slice(1).map((line) => {
        const values = line.split(':').map((value) => value.trim());
        return headers.reduce((acc, header, i) => {
          acc[header] = values[i] || '';
          return acc;
        }, {});
      }),
    };
  }

  // Function to display the table
  function displayTable({ headers, rows }) {
    if (rows.length === 0) return;

    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-responsive';

    const table = document.createElement('table');
    table.className = 'table table-bordered';

    // Table Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headers.forEach((header) => {
      const th = document.createElement('th');
      th.textContent = header;
      headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Table Body
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

        // Update rows dynamically when user changes input
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

    // Add Download Button
    const downloadButton = document.createElement('button');
    downloadButton.className = 'btn btn-primary mb-3';
    downloadButton.textContent = 'Download Changed CSV';
    downloadButton.addEventListener('click', () => downloadCSV(headers, rows));

    // Clear previous content and append new table
    output.innerHTML = '';
    output.appendChild(downloadButton);
    output.appendChild(tableContainer);
  }

  // Function to download the modified CSV
  function downloadCSV(headers, rows) {
    const csvContent = [
      headers.join(':'), // Header row
      ...rows.map((row) => headers.map((header) => row[header]).join(':')), // Data rows
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'modified_data.csv';
    link.click();
  }
});
