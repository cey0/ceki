// Ambil nilai ID katalog dari URL
const urlParams = new URLSearchParams(window.location.search);
const selectedCatalogId = urlParams.get('id');

// Fungsi untuk mengambil detail katalog berdasarkan ID
async function fetchCatalogDetails(id) {
    try {
        const response = await axios.get(`http://localhost:3000/catalogdata/${id}`); // Ganti URL dengan endpoint yang sesuai
        return response.data;
    } catch(error) {
        console.error("Error fetching catalog details:", error);
        return null;
    }
}

// Fungsi untuk menampilkan detail katalog di halaman pembayaran.html
async function showCatalogDetails() {
    const catalogDetailsContainer = document.getElementById('catalogDetails');

    // Mengambil detail katalog berdasarkan ID yang diberikan di URL
    const catalogDetails = await fetchCatalogDetails(selectedCatalogId);

    if (catalogDetails) {
        // Jika data katalog ditemukan, tampilkan informasi di halaman pembayaran.html
        catalogDetailsContainer.innerHTML = `
            <h2>${catalogDetails.nama}</h2>
            <p>Description: ${catalogDetails.desk}</p>
            <p>Price: ${formatCurrency(catalogDetails.harga)}</p>
            <!-- Tambahkan elemen HTML lain yang dibutuhkan -->
        `;
    } else {
        // Jika tidak ada data katalog yang ditemukan
        catalogDetailsContainer.innerHTML = `<p>Selected catalog not found.</p>`;
    }
}

// Panggil fungsi untuk menampilkan detail katalog saat halaman dimuat
window.addEventListener('load', showCatalogDetails);