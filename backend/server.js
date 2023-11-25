const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const userM = require('./models/userM');
const session = require('express-session');
const path = require('path');
const catalog = require("./models/catalogM")
const multer = require('multer');
const jokiM = require("./models/jokiM");
const pembayaranM = require("./models/pembayaranM")
const axios = require('axios');

const app = express();

app.use(express.json());
app.use(cors());

// Gunakan express-session
app.use(session({
  secret: 'gabolehliat', // Ganti dengan string rahasia yang lebih aman untuk digunakan
  cookie: {maxAge: 3600000},
  resave: false,
  saveUninitialized: false
}));

mongoose.connect("mongodb+srv://nadra:nadra@cluster0.vy16fhl.mongodb.net/Cluster0retryWrites=true&w=majority").then(() => {
  console.log("Connected to MongoDB");
  app.listen(3000, () => {
    console.log(`Node API is running on http://localhost:${3000}`);
  });
}).catch((e) => {
  console.log(e);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Menentukan lokasi file statis
app.use(express.static(path.join(__dirname , '../frontend'), {
  setHeaders: (res, filepath) => {
    if (filepath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-type, Accept"
  );
  next();
});
// Middleware untuk memeriksa apakah ada sesi pengguna atau tidak
const checkSession = (req, res, next) => {
  if (!req.session || !req.session.isLoggedIn) {
    return res.redirect('/login.html'); // Arahkan ke halaman login jika tidak ada sesi
  }
  next(); // Lanjutkan ke rute berikutnya jika sesi ada
};
// Route untuk register
app.post("/signup", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check apakah username sudah ada
    const exist = await userM.findOne({ username });

    if (exist) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Buat user baru menggunakan data dari form
    const newUser = new userM({
      username,
      password
    });

    const user = await newUser.save();
    res.status(200).json({ message: "User successfully added", user });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route untuk mengambil semua data user
app.get("/users", async (req, res) => {
  try {
    const users = await userM.find(); // Mengambil semua data user dari database

    if (!users || users.length === 0) {
      return res.status(404).json({ message: "No users found" });
    }

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route untuk login
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Cari user berdasarkan username
    const user = await userM.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "Username not found" });
    }

    // Verifikasi password (disarankan menggunakan metode hash dan salt untuk menyimpan dan memeriksa password)
    // Contoh dengan asumsi menyimpan password dalam plaintext (disarankan menggunakan hash dan salt)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Simpan informasi login di sesi
    req.session.isLoggedIn = true;
    req.session.user = user; // Simpan informasi user di sesi jika diperlukan

    // Jika verifikasi berhasil, arahkan ke halaman dashboard
    res.redirect("/dashboard");
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy((err) => {
      if (err) {
        console.error("Error destroying session:", err);
        return res.status(500).json({ error: "Failed to logout" });
      }
      console.log("Session destroyed successfully");
      // Hapus cookie yang berkaitan dengan sesi pada sisi klien
      res.clearCookie('connect.sid'); // Menghapus cookie sesi, connect.sid adalah nama default

      // Tambahkan header untuk memastikan tidak ada caching
      res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate');
      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');

      res.redirect("/login.html");
    });
  } else {
    // Jika sesi tidak tersedia, lanjutkan ke proses logout
    res.redirect("/login.html");
  }
});

// Route for handling the login page
app.get("/login", (req, res) => {
  // Redirect to the login.html file in the static directory
  res.redirect('/login');
});

// Route untuk mengakses dashboard
app.get('/dashboard',checkSession, (req, res) => {
  if (req.session.isLoggedIn) {
    // Jika pengguna sudah login (sesi ada), arahkan ke halaman dashboard
    res.sendFile(path.join(__dirname, '/../frontend/dashboard.html'));
  } else {
    // Jika pengguna belum login, arahkan ke halaman login
    res.redirect('/login');
  }
});

// Mengambil data dari database dan mengirimkan sebagai respons JSON
app.get("/catalogdata", async (req, res) => {
  try {
    const catalogs = await catalog.find();
    res.json(catalogs);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route untuk register
app.post("/catalogdata", async (req, res) => {
  try {
    const { nama,desk,harga } = req.body;

    // Buat user baru menggunakan data dari form
    const newCat = new catalog({
      nama,
      desk,
      harga
    });

    const Cat = await newCat.save();
    res.status(200).json({ message: "catalog successfully added", Cat });
  } catch (error) {
    console.error("Error creating catalog:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
// Menambahkan endpoint untuk mengambil data katalog berdasarkan ID
app.get("/catalogdata/:id", async (req, res) => {
  try {
    const catalogId = req.params.id;
    const catalogItem = await catalog.findById(catalogId);

    if (!catalogItem) {
      return res.status(404).json({ message: "Catalog item not found" });
    }

    res.status(200).json(catalogItem);
  } catch (error) {
    console.error("Error fetching catalog item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route untuk menambahkan tugas baru
app.post("/addTugas", async (req, res) => {
  try {
    const { tugas, TugasDetail, Nama, tingkat, catalogId } = req.body;

    // Buat tugas baru menggunakan data dari form
    const newTugas = new jokiM({
      tugas,
      TugasDetail,
      Nama,
      tingkat,
      catalogId // Anda akan menyimpan ObjectId untuk mengacu ke katalog tertentu di sini
    });

    const addedTugas = await newTugas.save();
    res.status(200).json({ message: "Tugas successfully added", addedTugas });
  } catch (error) {
    console.error("Error creating tugas:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Route untuk mendapatkan data tugas yang mencakup informasi dari catalog
app.get("/tugasCatalogData", async (req, res) => {
  try {
    const tugasData = await tugasM.find().populate('catalogId', 'nama harga -_id');

    if (!tugasData || tugasData.length === 0) {
      return res.status(404).json({ message: "No tugas data found" });
    }

    // Ambil data nama dan harga dari setiap tugas yang mengacu pada catalog
    const catalogDataInTugas = tugasData.map(tugas => ({
      tugas: tugas.tugas,
      TugasDetail: tugas.TugasDetail,
      Nama: tugas.Nama,
      tingkat: tugas.tingkat,
      catalog: {
        nama: tugas.catalogId ? tugas.catalogId.nama : null,
        harga: tugas.catalogId ? tugas.catalogId.harga : null
      }
    }));

    res.status(200).json({ catalogDataInTugas });
  } catch (error) {
    console.error("Error fetching tugas data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
const clientId = 'e25465ea-dd6a-34a5-abc9-9f6e76655804';
const clientSecret = 'ZK5qxnQfhmUaNaLEM7C5zMrdw2UHDZY5rzO12FWd';

axios.post('https://api.yukk.me/v2/oauth/token', {
  grant_type: 'client_credentials',
  client_id: clientId,
  client_secret: clientSecret
}, {
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Access token:', response.data.access_token);
})
.catch(error => {
  console.error('Error:', error);
});
module.exports = app;
