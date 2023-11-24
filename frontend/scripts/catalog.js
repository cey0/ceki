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
//untuk format harga
function formatCurrency(amount) {
	return new Intl.NumberFormat("id-ID", {
		style: "currency",
		currency: "IDR",
	}).format(amount);
}

async function tampilcatalog() {
  const catalogs = await fetchcatalog();

  catalogs.forEach((catalog) => {
    const catTotal = document.querySelector(".catalog");

    const catalogI = document.createElement("div");
    catalogI.classList.add("catalog-card");

    const catalogN = document.createElement("h4");
    catalogN.textContent = catalog.nama;
    catalogN.classList.add("catalog-item");

    const catalogP = document.createElement("p");
    catalogP.textContent = formatCurrency(catalog.harga);

    const catalogB = document.createElement("button");
    catalogB.textContent = "Buy";
    catalogB.classList.add("buy");
    catalogB.setAttribute("data-bs-toggle", "modal");
    catalogB.setAttribute("data-bs-target", `#modal${catalog.id}`);

    catalogI.appendChild(catalogN);
    catalogI.appendChild(catalogP);
    catalogI.appendChild(catalogB);
    catTotal.appendChild(catalogI);

    // Create Bootstrap modal for each catalog item
    const modal = document.createElement("div");
    modal.classList.add("modal", "fade");
    modal.setAttribute("id", `modal${catalog.id}`);
    modal.setAttribute("tabindex", "-1");
    modal.setAttribute("role", "dialog");
    modal.setAttribute("aria-labelledby", `modalLabel${catalog.id}`);
    modal.setAttribute("aria-hidden", "true");

    const modalDialog = document.createElement("div");
    modalDialog.classList.add("modal-dialog", "modal-dialog-centered");
    modalDialog.setAttribute("role", "document");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalHeader = document.createElement("div");
    modalHeader.classList.add("modal-header");

    const modalTitle = document.createElement("h5");
    modalTitle.classList.add("modal-title");
    modalTitle.setAttribute("id", `modalLabel${catalog.id}`);
    modalTitle.textContent = catalog.nama;

    const modalBody = document.createElement("div");
    modalBody.classList.add("modal-body");
    modalBody.textContent = `Price: ${formatCurrency(catalog.harga)}`; // Displaying price in modal body

    const modalFooter = document.createElement("div");
    modalFooter.classList.add("modal-footer");

    const closeButton = document.createElement("button");
    closeButton.classList.add("btn", "btn-secondary");
    closeButton.setAttribute("type", "button");
    closeButton.setAttribute("data-bs-dismiss", "modal"); // Use data-bs-dismiss to close the modal
    closeButton.textContent = "Close";

    modalHeader.appendChild(modalTitle);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalFooter.appendChild(closeButton);
    modalContent.appendChild(modalFooter);
    modalDialog.appendChild(modalContent);
    modal.appendChild(modalDialog);

    document.body.appendChild(modal);

    // Event listener to display modal upon button click
    catalogB.addEventListener("click", () => {
      const bsModal = new bootstrap.Modal(modal);
      bsModal.show();
    });
    // Remove modal backdrop on modal close
    modal.addEventListener("hidden.bs.modal", () => {
    document.body.classList.remove("modal-open");
    const modalBackdrop = document.querySelector(".modal-backdrop");
    if (modalBackdrop) {
      modalBackdrop.parentNode.removeChild(modalBackdrop);
    }
  });
  });
}

window.addEventListener("load", tampilcatalog);




