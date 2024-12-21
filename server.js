const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { MongoClient } = require("mongodb");

// Initialize Express app
const app = express();

// Set up CORS
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// MongoDB connection
mongoose
  .connect("mongodb+srv://chat:1234@chatbot.62ejg.mongodb.net/HospitalData")
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("MongoDB connection failed:", error));

// Define the schemas
const patientSchema = new mongoose.Schema({
  id: String, // Ensure the `id` field exists for consistency
  PatientName: String,
  ContactInfo: String,
  Age: Number,
  Gender: String,
  Disease: String,
  DoctorID: String,
  DoctorName: String,
  Admitted: String,
  AdmitDate: String,
  DischargeDate: String,
  NumAppointments: Number,
});

const doctorSchema = new mongoose.Schema({
  id: String,
  Name: String,
  Specialization: String,
  ContactInfo: String,
  PatientCount: Number,
  PatientNames: [String],
  ExperienceYears: Number,
});

const nurseSchema = new mongoose.Schema({
  id: String,
  Name: String,
  ContactInfo: String,
  Ward: String,
  YearsOfExperience: Number,
});

const medicineSchema = new mongoose.Schema({
  id: String,
  MedicineName: String,
  Manufacturer: String,
  ExpiryDate: Date,
  Price: Number,
  Stock: Number,
});

const doctorAtdSchema = new mongoose.Schema({
  doctorId: String,
});

// Define the models
const PatientData = mongoose.model("PatientData", patientSchema);
const DoctorData = mongoose.model("DoctorData", doctorSchema);
const NurseData = mongoose.model("NurseData", nurseSchema);
const MedicineData = mongoose.model("MedicineData", medicineSchema);
const doctoratdData = mongoose.model("DoctorAtd", doctorAtdSchema);
// Collection mapping for dynamic access
const collectionMap = {
  PatientData: PatientData,
  DoctorData: DoctorData,
  NurseData: NurseData,
  MedicineData: MedicineData,
};

// Add data to a collection
app.post("/api/add", async (req, res) => {
  const { collectionName, ...data } = req.body;
  console.log(collectionName);
  const Model = collectionMap[collectionName];
  if (!Model) return res.status(400).json({ error: "Invalid collection name" });

  try {
    const url = `mongodb+srv://chat:1234@chatbot.62ejg.mongodb.net/`;
    const client = new MongoClient(url);
    const database = client.db("HospitalData");
    const collection = database.collection(collectionName);
    const result = await collection.insertOne(data);

    const newData = new Model(data);
    await newData.save();
    res.json({ message: "Data added successfully", data: result });
  } catch (error) {
    console.error("Error:", error);
    //res.status(500).json({ error: "An error occurred" });
  }
});

// Read data by ID from a collection
app.post("/api/read", async (req, res) => {
  const { collectionName, id } = req.body;
  const url = `mongodb+srv://chat:1234@chatbot.62ejg.mongodb.net/`;
  const client = new MongoClient(url);
  const database = client.db("HospitalData");
  const collection = database.collection(collectionName);
  const Model = collectionMap[collectionName];
  if (!Model || !id) return res.status(400).json({ error: "Invalid input" });

  try {
    const documents = await collection.find({ id: id }).toArray();
    console.log(documents);
    if (!documents) return res.status(404).json({ error: "Data not found" });
    res.json({ documents });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while fetching data" });
  }
});

// Update data in a collection
app.post("/api/update", async (req, res) => {
  const { collectionName, id, update } = req.body;
  const url = `mongodb+srv://chat:1234@chatbot.62ejg.mongodb.net/`;
  const client = new MongoClient(url);
  const database = client.db("HospitalData");
  const collection = database.collection(collectionName);

  const Model = collectionMap[collectionName];
  if (!Model || !id || !update)
    return res.status(400).json({ error: "Invalid input" });

  try {
    const result = await collection.updateOne({ id: id }, { $set: update });
    if (!result) {
      return res.json({ message: "updates are", data: result });
    }

    const updatedData = await Model.findOneAndUpdate({ id }, update, {
      new: true,
    });
    if (!updatedData) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data updated successfully", data: updatedData });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Delete data by ID from a collection
app.post("/api/delete", async (req, res) => {
  const { collectionName, id } = req.body;
  const url = `mongodb+srv://chat:1234@chatbot.62ejg.mongodb.net/`;
  const client = new MongoClient(url);
  const database = client.db("HospitalData");
  const collection = database.collection(collectionName);
  const Model = collectionMap[collectionName];
  try{
    const result = await collection.deleteOne({ id: id });
    console.log(result.message);
  }catch(error){
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred while deleting data" });
  }

  if (!Model || !id) return res.status(400).json({ error: "Invalid input" });

  try {
    const deletedData = await Model.findOneAndDelete({ id });
    if (!deletedData) return res.status(404).json({ error: "Data not found" });
    res.json({ message: "Data deleted successfully" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.post('/submit-attendance', async(req, res)=>{
  const {doctorId} = req.body;
  const url = `mongodb+srv://chat:1234@chatbot.62ejg.mongodb.net/`;
  const client = new MongoClient(url);
  const database = client.db("HospitalData");
  const collection = database.collection("DoctorAtd");
  console.log("Reached collection");

  try{
    const result = await collection.insertOne({"id":doctorId});
    console.log(result);
    res.json({message: 'Doctor marked as attended successfully'});
  }catch (error) {
    res.status(500).json({mssage:"Error saving doctor attendence"});
  }
})

app.get("/total-attendance", async (req, res) => {
  const url = `mongodb+srv://chat:1234@chatbot.62ejg.mongodb.net/`;
  const client = new MongoClient(url);
  const database = client.db("HospitalData");
  const collection = database.collection("DoctorAtd");
  console.log("Reached total");

  try {
    const atdCount = await collection.countDocuments({});
    console.log(atdCount);
    res.status(200).json({ atdCount });
  } catch (atdCount) {
    res.status(500).json({ message: "Error fetching total doctor attendence" });
  }
});

// Start the server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
