

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('tugasForm');

  // Fetch catalog data based on the ID from the URL
  // Assuming the ID is in the URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const catalogId = urlParams.get('id');
  console.log("Catalog ID:", catalogId);

  // Fetch data based on the catalogId
  axios.get(`http://localhost:3000/catalogdata/${catalogId}`)
    .then(function (response) {
      const catalogData = response.data; // Assuming the response contains catalog data

      // Fill the form fields with data from the catalog
      document.getElementById('Nama').value = catalogData.nama;
      document.getElementById('harga').value = catalogData.harga;
      // Populate other fields if needed
    })
    .catch(function (error) {
      console.error('Error fetching catalog data:', error);
      // Handle errors if the catalog data couldn't be retrieved
    });

  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get form data
    const tugas = document.getElementById('tugas').value;
    const TugasDetail = document.getElementById('TugasDetail').value;
    const tingkat = document.getElementById('tingkat').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const nama = document.getElementById('Nama').value;
    const harga = document.getElementById('harga').value;

    // Prepare the data to send
    const formData = {
      tugas,
      TugasDetail,
      tingkat,
      firstName,
      lastName,
      email,
      phone,
      nama,
      harga
    };

    try {
      // Send form data to the server to save it
      const response = await axios.post('http://localhost:3000/addjoki', formData);

      // Extract the transaction token from the response
      const transactionToken = response.data.task.transaction;

      // Assuming 'snap' is initialized properly elsewhere in your code
      // Open the Midtrans Snap popup with the retrieved transaction token
      snap.pay(transactionToken)
        .then((result) => {
          console.log('Payment successful:', result);
          // Perform actions after successful payment, if needed
        })
        .catch((error) => {
          console.error('Payment failed:', error);
          // Handle errors occurring during payment initiation
          alert('Payment initiation failed. Please try again.');
        });

      // Display a success message or perform any other actions as needed
      alert('Data saved successfully. Redirecting to payment...');
    } catch (error) {
      console.error('Error:', error);
      // Handle errors if data saving or payment initiation fails
      
    }
  });
});
