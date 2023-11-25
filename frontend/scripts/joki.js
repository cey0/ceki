window.addEventListener("DOMContentLoaded", () => {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const catalogId = urlParams.get('id');

  console.log("Catalog ID:", catalogId);

  axios.get(`http://localhost:3000/catalogdata/${catalogId}`)
    .then(response => {
      console.log("Catalog Data:", response.data);
      const { nama, harga } = response.data;
  
      // Isi nilai dari catalog ke dalam input "Nama" dan "Harga"
      document.getElementById("Nama").value = nama;
      document.getElementById("harga").value = harga;
    })
    .catch(error => {
      console.error("Error fetching catalog data:", error);
    });
});