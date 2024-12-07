export function parseFile(content) {
    const lines = content.split('\n').filter((line) => line.trim() !== ''); // Remove linhas vazias
    let headers = lines[0].split(':').map((header) => header.trim()); // Extrai os cabeçalhos
  
    // Garante que os cabeçalhos sejam únicos
    const seenHeaders = new Map();
    headers = headers.map((header) => {
      const count = seenHeaders.get(header) || 0;
      seenHeaders.set(header, count + 1);
      return count > 0 ? `${header}_${count}` : header;
    });
  
    // Cria objetos baseados nos cabeçalhos e nas linhas subsequentes
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
  