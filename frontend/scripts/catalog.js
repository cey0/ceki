// ambil data dari database
async function fetchcatalog(){
  try {
    const response = await axios.get("http://localhost:3000/catalogdata");
    return response.data;
  } catch(error) {
    console.error("error ngambil data:", error);
    return [];
  }
}

async function tampilcatalog() {
  const catalogs = await fetchcatalog();
  const catTotal = document.querySelector(".catalog"); // Memindahkan variabel ini di sini agar dapat diakses pada loop

  catalogs.forEach((catalog) => {
    const catalogN = document.createElement("h3");
    catalogN.textContent = catalog.nama; // Menggunakan properti "nama" dari respons JSON
    catalogN.classList.add("catalog-item"); // Menambahkan kelas pada setiap elemen h3

    catTotal.appendChild(catalogN); // Memindahkan ini ke dalam loop agar setiap elemen baru ditambahkan ke dalam ".catalog"
  });
}

window.addEventListener("load", tampilcatalog);
