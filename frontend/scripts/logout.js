// Function to delete a cookie by name
function deleteCookie(name) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  }
  
  document.getElementById('logoutbtn').addEventListener('click', async () => {
    try {
      const response = await axios.get('http://localhost:3000/logout'); // Assuming the logout endpoint is '/logout'
      console.log(response.data); // Log the response data (optional)
      
      // Delete the cookie named 'yourCookieName'
      deleteCookie('yourCookieName');
  
      window.location.href = "./login.html";
    } catch (error) {
      console.error(error); // Log any errors that occur during the logout process
      // Handle errors or display a message to the user
    }
  });
  
// Menggunakan Axios untuk membuat permintaan GET ke rute /dashboard
document.addEventListener('DOMContentLoaded', async () => {
    try {
      const response = await axios.get('http://localhost:3000/dashboard'); // Sesuaikan dengan URL server Anda
      console.log(response.data); // Log the response data (optional)
      // Handle the response data as needed
    } catch (error) {
      console.error(error); // Log any errors that occur during the request
      // Handle errors or display a message to the user
    }
  });