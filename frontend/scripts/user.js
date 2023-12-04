// Modify the fetchData function to fetch user data
async function fetchUserData() {
    try {
      const response = await axios.get("http://localhost:3000/users");
      const users = response.data.users;
  
      let userTableBody = document.getElementById("userTableBody");
      userTableBody.innerHTML = "";
  
      users.forEach(user => {
        let row = userTableBody.insertRow();
        row.insertCell().innerText = user._id; // Replace with the appropriate user ID property
        row.insertCell().innerText = user.username; // Replace with the appropriate username property
        row.insertCell().innerText = user.password; // Replace with the appropriate password property
        row.insertCell().innerText = user.role; // Replace with the appropriate role property
  
        // Similarly, add action buttons for users (if needed)
        let buttonCell = row.insertCell();
        let editButton = document.createElement("button");
        // Customize edit button properties and event listeners here
  
        let deleteButton = document.createElement("button");
        // Customize delete button properties and event listeners here
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }
  
  // Call the fetchUserData function to populate the user table
  fetchUserData();
  