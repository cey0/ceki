// Get the login form element
const loginForm = document.getElementById('login-form');

// Event listener for form submission
loginForm.addEventListener('submit', async (event) => {
 event.preventDefault(); // Prevent the default form submission

 // Get the username and password from the form
 const username = document.getElementById('username').value;
 const password = document.getElementById('password').value;

 try {
    const response = await axios.post('http://localhost:3000/login', {
      username,
      password
    });
  
    console.log('Response data:', response.data);
  
    if (response.data && response.data.user) {
      const { role } = response.data.user;
      if (role === 'user') {
        window.location.href = 'dashboard.html';
      } else if (role === 'admin') {
        window.location.href = 'dashboard-A.html';
      } else { 
        console.error('Invalid user role:', role);
        alert('Invalid user role');
      }
    } else {
      console.error('Invalid user data received');
      alert('Invalid user data received');
    }
 } catch (error) {
    console.error('Login error:', error);
    alert('Login failed');
 }

 // Added code to show alert for successful login
 alert('Login successful');
  
});