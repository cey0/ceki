const midtransClient = require('midtrans-client');
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
app.post("/signup", async (req, res) => {
  try {
     const { username, password, role } = req.body;
 
     // Check if the username already exists
     const exist = await userM.findOne({ username });
 
     if (exist) {
       return res.status(400).json({ error: "Username already exists", alert: "Username already exists! Please choose another username." });
     }
 
     // Set a default role if none is provided
     const defaultRole = role || 'user'; // Set default role to 'user' if not provided
 
     // Create a new user using form data and default role
     const newUser = new userM({
       username,
       password,
       role: defaultRole
     });
 
     const user = await newUser.save();
     res.status(200).json({ message: "User successfully added", user, alert: "Registration successful! You can now login." });
  } catch (error) {
     console.error("Error creating user:", error);
     res.status(500).json({ error: "Internal server error", alert: "Failed to register user. Please try again." });
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

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user based on the username
    const user = await userM.findOne({ username });

    if (!user) {
      return res.status(404).json({ error: "Username not found" });
    }

    // Check password (consider using more secure password handling methods)
    if (user.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Set session based on user role
    req.session.isLoggedIn = true;
    req.session.user = {
      _id: user._id,
      username: user.username,
      role: user.role // Assuming 'role' is defined in the user schema
    };

    console.log('User role:', user.role);

    // Respond with user data in JSON format
    res.status(200).json({ user: req.session.user });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get('/dashboard', checkSession, (req, res) => {
  if (req.session.user.role == "user") {
     // Jika pengguna sudah login (sesi ada), arahkan ke halaman dashboard
     res.sendFile(path.join(__dirname, '/../frontend/dashboard.html'));
  } else {
     // Jika pengguna belum login, arahkan ke halaman login
     res.redirect('/login');
  }
 });
 app.get('/admin/dashboard',checkSession, (req, res) => {
  if (req.session.user.role === "admin") {
      // Jika pengguna sudah login sebagai admin (sesi ada dan role = admin), arahkan ke halaman dashboard admin
      res.sendFile(path.join(__dirname, 'dashboard-A.html'));
  } else {
      // Jika pengguna belum login sebagai admin, arahkan ke halaman login
      res.redirect('/login');
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
app.delete("/catalogdata/:id", async (req, res) => {
  try {
     const catalogId = req.params.id;
     const deletedCatalog = await catalog.findByIdAndDelete(catalogId);
 
     if (!deletedCatalog) {
       return res.status(404).json({ message: "Catalog item not found" });
     }
 
     res.status(200).json({ message: "Catalog item successfully deleted", deletedCatalog });
  } catch (error) {
     console.error("Error deleting catalog item:", error);
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
<<<<<<< Updated upstream
// Route for updating a catalog item by ID
app.put("/catalogdata/:id", async (req, res) => {
  try {
    const catalogId = req.params.id;
    const { nama, desk, harga } = req.body;

    // Find the catalog item by ID and update its data
    const updatedCatalog = await catalog.findByIdAndUpdate(
      catalogId,
      { nama, desk, harga },
      { new: true } // Return the updated document
    );

    if (!updatedCatalog) {
      return res.status(404).json({ message: "Catalog item not found" });
    }

    res.status(200).json({ message: "Catalog item updated successfully", updatedCatalog });
  } catch (error) {
    console.error("Error updating catalog item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/addjoki", async (req, res) => {
  try {
    const {
      tugas,
      TugasDetail,
      tingkat,
      firstName,
      lastName,
      email,
      phone,
      nama,
      harga
    } = req.body;

    // Validation checks for required fields can be added here...

    const newjoki = new jokiM({
      tugas,
      TugasDetail,
      tingkat,
      firstName,
      lastName,
      email,
      phone,
      nama,
      harga
    });

    const savedjoki = await newjoki.save();

    if (!savedjoki) {
      return res.status(500).json({ message: 'Failed to save task' });
    }

    console.log('Saved joki ID:', savedjoki._id);

    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: 'SB-Mid-server-W4Ac0rt2S614rRGUwb9kwMCO'
    });

    let parameter = {
      "transaction_details": {
        "order_id": savedjoki._id,
        "gross_amount": parseInt(harga)
      },
      "customer_details": {
        "first_name": firstName,
        "last_name": lastName,
        "email": email,
        "phone": phone
      }
    };

    const transaction = await snap.createTransaction(parameter);
    const transactionToken = transaction.token;

    console.log('Transaction token created successfully:', transactionToken);

    // Update jokiM document with transaction token
    await jokiM.findByIdAndUpdate(savedjoki._id, { transaction: transactionToken });

    // Include the transaction field in the response
    res.status(201).json({ message: 'New task created successfully', task: { ...savedjoki.toObject(), transaction: transactionToken } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task or transaction', error: error.message });
  }
});

=======
app.post("/addjoki", async (req, res) => {
  try {
    const {
      tugas,
      TugasDetail,
      tingkat,
      firstName,
      lastName,
      email,
      phone,
      nama,
      harga
    } = req.body;

    // Validation checks for required fields can be added here...

    const newjoki = new jokiM({
      tugas,
      TugasDetail,
      tingkat,
      firstName,
      lastName,
      email,
      phone,
      nama,
      harga
    });

    const savedjoki = await newjoki.save();

    if (!savedjoki) {
      return res.status(500).json({ message: 'Failed to save task' });
    }

    console.log('Saved joki ID:', savedjoki._id);

    let snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: 'SB-Mid-server-W4Ac0rt2S614rRGUwb9kwMCO'
    });

    let parameter = {
      "transaction_details": {
        "order_id": savedjoki._id,
        "gross_amount": parseInt(harga)
      },
      "customer_details": {
        "first_name": firstName,
        "last_name": lastName,
        "email": email,
        "phone": phone
      }
    };

    const transaction = await snap.createTransaction(parameter);
    const transactionToken = transaction.token;

    console.log('Transaction token created successfully:', transactionToken);

    // Update jokiM document with transaction token
    await jokiM.findByIdAndUpdate(savedjoki._id, { transaction: transactionToken });

    // Include the transaction field in the response
    res.status(201).json({ message: 'New task created successfully', task: { ...savedjoki.toObject(), transaction: transactionToken } });
  } catch (error) {
    res.status(500).json({ message: 'Error creating task or transaction', error: error.message });
  }
});

>>>>>>> Stashed changes
module.exports = app;








