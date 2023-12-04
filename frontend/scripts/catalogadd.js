// Select the "Save" button in the modal
const saveButton = document.getElementById("save");

// Add an event listener to the "Save" button
saveButton.addEventListener("click", async () => {
  try {
    // Get the form input values
    const nama = document.getElementById("nama").value;
    const desk = document.getElementById("desk").value;
    const harga = document.getElementById("harga").value;

    // Create an object with the form data
    const formData = {
      nama,
      desk,
      harga
    };

    // Make a POST request to send the form data to the server
    await axios.post("http://localhost:3000/catalogdata", formData);

    // Display the success alert after successfully saving the data
    const saveSuccess = document.getElementById("saveSuccess");
    saveSuccess.classList.remove("d-none");

    // Optionally, you can clear the form input fields after saving the data
    document.getElementById("form").reset();

    // Close the modal after saving
    const modal = new bootstrap.Modal(document.getElementById("exampleModal"));
    modal.hide();

    // Refresh the table data after adding new data
    await fetchData();
  } catch (error) {
    console.error("Error adding catalog:", error);
  }
});
