// Fungsi untuk mengambil data dari database
async function fetchcatalog(){
  try {
    const response = await axios.get("http://localhost:3000/catalogdata");
    return response.data;
  } catch(error) {
    console.error("error ngambil data:", error);
    return [];
  }
}

// Fungsi untuk mengatur format mata uang
function formatCurrency(amount) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);
}

// Fungsi untuk menampilkan katalog
async function tampilcatalog() {
  const catalogs = await fetchcatalog();

  catalogs.forEach((catalog, index) => {
    const catTotal = document.querySelector(".catalog");

    // Membuat elemen untuk setiap katalog
    const catalogI = document.createElement("div");
    catalogI.classList.add("catalog-card");

    const catalogN = document.createElement("h4");
    catalogN.textContent = catalog.nama; // Menampilkan nama katalog
    catalogN.classList.add("catalog-item");

    const catalogP = document.createElement("p");
    catalogP.textContent = formatCurrency(catalog.harga); // Menampilkan harga katalog

    // Membuat elemen untuk setiap modal
    const modal = document.createElement("div");
    modal.classList.add("modal", "fade");
    modal.setAttribute("id", `modal${catalog.id}-${index}`); // ID modal unik berdasarkan indeks
    modal.setAttribute("tabindex", "-1");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", `modalLabel${catalog.id}-${index}`);
    modal.setAttribute("aria-hidden", "true");

    // Struktur elemen modal
    const modalDialog = document.createElement("div");
    modalDialog.classList.add("modal-dialog", "modal-dialog-centered");
    modalDialog.setAttribute("role", "document");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");


    const modalTitle = document.createElement("h5");
    modalTitle.classList.add("modal-title");
    modalTitle.setAttribute("id", `modalLabel${catalog.id}-${index}`);
    modalTitle.textContent = catalog.nama; // Judul modal dari nama katalog

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body","text-center" );
    modalBody.innerHTML = `
      <h6> paket: ${catalog.nama}</h6>
      <p>Description: ${catalog.desk}</p>
      <p>Price: ${formatCurrency(catalog.harga)}</p>
    `; // Menampilkan nama, tugas, dan harga dalam badan modal

    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");

    const closeButton = document.createElement("button");
    closeButton.classList.add("btn", "btn-danger");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("data-bs-dismiss", "modal");
    closeButton.textContent = "Close";

    const BuyB = document.createElement("button");
    BuyB.classList.add("btn", "btn-primary");
    BuyB.setAttribute("type", "button");
    BuyB.setAttribute("data-bs-dismiss", "modal");
    BuyB.setAttribute("data-catalog-id", catalog.id);
    BuyB.textContent = "Buy";

    modalHeader.appendChild(modalTitle);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalFooter.appendChild(BuyB);
    modalFooter.appendChild(closeButton);
    modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    document.body.appendChild(modal);

    // Tombol "Buy" untuk menampilkan modal
    const catalogB = document.createElement("button", "btn" );
    catalogB.textContent = "Select";
    catalogB.classList.add("btn","btn-primary");
    catalogB.setAttribute("data-bs-toggle", "modal");
    catalogB.setAttribute("data-bs-target", `#modal${catalog.id}-${index}`); // Target modal berdasarkan indeks

    // Mengatur struktur konten katalog di halaman
    catalogI.appendChild(catalogN);
    catalogI.appendChild(catalogP);
    catalogI.appendChild(catalogB);
    catTotal.appendChild(catalogI);

    // Event listener saat tombol "Buy" diklik
    catalogB.addEventListener("click", () => {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    });
    BuyB.addEventListener("click", (event) => {
      const selectedCatalogId = catalog._id; // Assuming _id is the correct identifier
      if (selectedCatalogId) {
        // Debugging: Log the selectedCatalogId to ensure it's not undefined
        console.log("Selected Catalog ID:", selectedCatalogId);
    
        // Redirect to pembayaran.html only if the selectedCatalogId is valid
        window.location.href = `pembayaran.html?id=${selectedCatalogId}`;
      } else {
        console.error("No valid ID found for the selected catalog.");
        // Handle the situation where the ID is not available or invalid
      }
    });
    

    // Event listener saat modal tertutup
    modal.addEventListener("hidden.bs.modal", () => {
      document.body.classList.remove("modal-open");
      const modalBackdrop = document.querySelector(".modal-backdrop");
      if (modalBackdrop) {
        modalBackdrop.parentNode.removeChild(modalBackdrop);
      }
    });
  });
}

// Menjalankan fungsi tampilcatalog saat halaman dimuat
window.addEventListener("load", tampilcatalog);
