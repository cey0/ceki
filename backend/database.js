mongoose.connect("mongodb+srv://nadra:nadra@cluster0.vy16fhl.mongodb.net/Cluster0retryWrites=true&w=majority").then(() => {
  console.log("Connected to MongoDB");
  app.listen(3000, () => {
    console.log(`Node API is running on http://localhost:${3000}`);
  });
}).catch((e) => {
  console.log(e);
});