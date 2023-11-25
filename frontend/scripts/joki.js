async function getCatalogById(catalogId) {
    try {
      const response = await axios.get(`http://localhost:3000/catalog/${catalogId}`);
      return response.data;
    } catch(error) {
      console.error('Error fetching catalog by ID:', error);
      return null;
    }
  }
  
  window.onload = () => {
    fetch('/tugas') // Meminta data katalog dari endpoint yang sesuai
      .then(response => response.json())
      .then(data => {
        if (data) {
          // Mengisi nilai pada elemen input yang disembunyikan
          document.getElementById('tipeInput').value = data.tipePaket;
          document.getElementById('hargaInput').value = data.harga;
        }
      })
      .catch(error => console.error('Error:', error));
  };

