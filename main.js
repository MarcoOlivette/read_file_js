document.addEventListener('DOMContentLoaded', () => {
  const directoryPickerBtn = document.getElementById('directoryPickerBtn');
  const fallbackDirectoryInput = document.getElementById('fallbackDirectoryInput');
  const directoryPickerFallbackText = document.getElementById('directoryPickerFallbackText');
  const output = document.getElementById('output');

  // Check for native Directory Picker support
  if (!window.showDirectoryPicker) {
    directoryPickerBtn.classList.add('d-none'); // Hide native picker button
    fallbackDirectoryInput.classList.remove('d-none'); // Show fallback input
    directoryPickerFallbackText.classList.remove('d-none');
  }

  // Native Directory Picker
  directoryPickerBtn.addEventListener('click', async () => {
    try {
      const directoryHandle = await window.showDirectoryPicker();
      const files = [];

      for await (const [name, handle] of directoryHandle.entries()) {
        if (handle.kind === 'file') {
          const file = await handle.getFile();
          const text = await file.text();
          files.push({ name, content: text });
        }
      }

      output.innerHTML = `<h5>Files in Directory:</h5><pre>${JSON.stringify(files, null, 2)}</pre>`;
    } catch (err) {
      console.error('Error accessing directory:', err);
      output.textContent = 'Failed to access the directory.';
    }
  });

  // Fallback Directory Picker
  fallbackDirectoryInput.addEventListener('change', async (event) => {
    const files = Array.from(event.target.files).map((file) => ({
      name: file.name,
      content: file.text(),
    }));

    const resolvedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        content: await file.content,
      }))
    );

    output.innerHTML = `<h5>Files in Directory (Fallback):</h5><pre>${JSON.stringify(resolvedFiles, null, 2)}</pre>`;
  });
});
