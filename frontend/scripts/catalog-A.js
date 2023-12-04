// Function to remove event listeners
function removeEventListeners(element) {
  const newElement = element.cloneNode(true);
  element.parentNode.replaceChild(newElement, element);
  return newElement;
}
async function fetchData() {
  try {
     const response = await axios.get("http://localhost:3000/catalogdata");
     const catalogs = response.data;
 
     let tableBody = document.getElementById("tableBody");
     tableBody.innerHTML = "";
 
     catalogs.forEach(catalog => {
       let row = tableBody.insertRow();
       row.insertCell().innerText = catalog._id;
       row.insertCell().innerText = catalog.nama;
       row.insertCell().innerText = catalog.desk;
       row.insertCell().innerText = catalog.harga;
      // Create a new cell for the buttons
      let buttonCell = row.insertCell();
         // Create an "Add" button for each row
       let addButton = document.createElement("button", "btn","btn-warning");
       addButton.classList.add("btn","btn-warning");
       addButton.innerText = "update";
       addButton.id = "addBtn";
       buttonCell.appendChild(addButton);
       addButton.setAttribute("data-bs-toggle", "modal"); // Add this line
       addButton.setAttribute("data-bs-target", "#updateModal")
       addButton.addEventListener("click", function () {
         // Get catalog item data and populate the update modal form
         const updateModal = document.getElementById("updateModal");
         const updateForm = document.getElementById("updateForm");
         updateModal.style.display = "block";
   
         // Extract catalog data for the selected row
         const cells = this.parentElement.parentElement.cells;
         const id = cells[0].innerText;
         const nama = cells[1].innerText;
         const desk = cells[2].innerText;
         const harga = cells[3].innerText;
   
         // Populate the update form with the catalog data
         document.getElementById("updateId").innerText = id;
         document.getElementById("updateNama").value = nama;
         document.getElementById("updateDesk").value = desk;
         document.getElementById("updateHarga").value = harga;
   
         // Event listener for the update form submission
         updateForm.onsubmit = async (event) => {
            // Get catalog item data and populate the update modal form
         const updateModal = document.getElementById("updateModal");
         updateModal.style.display = "block"; // Display the update modal
           event.preventDefault();
   
           // Get updated data from the form
           const updatedNama = document.getElementById("updateNama").value;
           const updatedDesk = document.getElementById("updateDesk").value;
           const updatedHarga = document.getElementById("updateHarga").value;
   
           try {
             // Make a PUT request to update the catalog item
             await axios.put(`http://localhost:3000/catalogdata/${id}`, {
               nama: updatedNama,
               desk: updatedDesk,
               harga: updatedHarga,
             });
   
             // Display a success alert and close the update modal
             alert("Catalog item successfully updated!");
             updateModal.style.display = "none";
   
             // Reload the table data
             fetchData();
           } catch (error) {
             console.error("Error updating catalog item:", error);
             alert("Failed to update catalog item. Please try again.");
           }
         };
       });
       // Event listener for Save Changes button in the Update Modal
  document.getElementById("updateSave").addEventListener("click", async function () {
  try {
  // Get the updated values from the modal fields
  const updateId = document.getElementById("updateId").innerText; // Assuming there is an element with the ID "updateId" to store the catalog item ID
  const updatedNama = document.getElementById("updateNama").value;
  const updatedDesk = document.getElementById("updateDesk").value;
  const updatedHarga = document.getElementById("updateHarga").value;
   
  // Prepare the data object with updated catalog values
  const updatedCatalog = {
       nama: updatedNama,
       desk: updatedDesk,
       harga: updatedHarga
  };
   
  // Send a PUT request to update the catalog item
  await axios.put(`http://localhost:3000/catalogdata/${updateId}`, updatedCatalog);
     
  alert("Catalog item successfully updated!");
  updateModal.style.display = "none";
  // Remove the modal backdrop manually
  const modalBackdrops = document.getElementsByClassName("modal-backdrop");
  while (modalBackdrops.length > 0) {
    modalBackdrops[0].parentNode.removeChild(modalBackdrops[0]);
  }
     
  // Fetch and refresh the updated data
  fetchData();
  } catch (error) {
  console.error("Error updating catalog:", error);
  }
  });
       // Add some spacing between the buttons
       buttonCell.appendChild(document.createTextNode("   |   "));
   
       let deleteButton = document.createElement("button");
       deleteButton.classList.add("btn", "btn-danger");
       deleteButton.innerText = "Delete";
       deleteButton.addEventListener("click", async function () {
         try {
           // Extract the ID from the row and handle delete
           let id = this.parentElement.parentElement.cells[0].innerText;
           await handleDeleteButtonClick(id);
         } catch (error) {
           console.error("Error deleting catalog:", error);
         }
       });
       buttonCell.appendChild(deleteButton);
  });
  } catch (error) {
  console.error("Error fetching data:", error);
  }
  }
   
  async function handleDeleteButtonClick(id) {
  try {
  await axios.delete(`http://localhost:3000/catalogdata/${id}`);
  fetchData(); // Reload the table after deletion
  } catch (error) {
  console.error("Error deleting catalog:", error);
  }
  }
   
  fetchData(); // Call the function to populate the table