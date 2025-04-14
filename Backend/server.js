const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({path:"C:/Users/com/Desktop/Javascript/React/PasswordManger/Backend/.env"});

const app = express();
app.use(cors());
app.use(express.json());
// console.log('Mongo URI:', process.env.MONGODB_URI); // 👈 Add this to debug

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

const itemRoutes = require('./Routes/itemRoutes');
app.use('/api/items', itemRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const PORT =5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));