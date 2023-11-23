const loginForm = document.getElementById("login-form");
// Tambahkan event listener untuk form submission
loginForm.addEventListener("submit", async (event) => {
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
        // Kirim permintaan POST ke endpoint login di backend
        const response = await axios.post("http://localhost:3000/login", formData);

        // Tanggapi respons dari server
        alert("login berhasil");

        // Jika login berhasil, pindahkan ke dashboard.html
        window.location.href = "./dashboard.html";
    } catch (error) {
        console.error("login gagal:", error.response.data);
        // Tampilkan pesan error jika terjadi kesalahan pada login
        alert("login gagal: " + error.response.data.error);
    }
});
