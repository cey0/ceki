const signupForm = document.getElementById("signup-form");
        
        // Tambahkan event listener untuk form submission
        signupForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Menghentikan perilaku bawaan form submission
        
            // Ambil nilai dari input form
            const username = document.getElementById("username").value;
            const password = document.getElementById("password").value;
        
            // Data objek dari form
            const formData = {
                username,
                password
            };
        
            try {
                // Kirim permintaan POST ke endpoint signup di backend
                const response = await axios.post("http://localhost:3000/signup", formData);
                
                // Tanggapi respons dari server
                alert("Signup berhasil");
            } catch (error) {
                console.error("Signup gagal:", error.response.data);
                // Tampilkan pesan error jika terjadi kesalahan pada signup
                alert("Signup gagal: " + error.response.data.error);
            }
        });