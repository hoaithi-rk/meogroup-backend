const dotenv = require('dotenv');
dotenv.config({path: './.env'});

const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000;
const userRoutes = require('./routes/user_routes')



const connectDB = require('./config/db.js');
connectDB();

// ejs
app.set('views', './views');
app.set('view engine', 'ejs');

app.use(express.json());
app.use(cors());

// routes 
app.use('/api/v1/users', userRoutes);


// test
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})