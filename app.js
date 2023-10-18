const path = require("path");
const fs = require("fs");

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const cors = require('cors'); // Import the cors package
const cookieParser = require('cookie-parser');

// Deployment

const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const isAuthRoutes = require('./routes/isAuth');
const doctorRoutes = require('./routes/doctor');
const patientRoutes = require('./routes/patient');
const medicalProfileRoutes = require('./routes/medicalProfile');
const appointmentRoutes = require('./routes/appointment');
const treatmentSessionRoutes = require('./routes/treatmentSession');
const specializationRoutes = require('./routes/specialization');


const MONGODB_URI = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.ehfjocc.mongodb.net/${process.env.MONGO_DEFAULT_DATABASE}`;



const app = express();

app.use(cors({
  // origin: ["http://localhost:3000","http://dashboard.localhost:3000"],
  origin: ["https://clinic-f6321.web.app"],
  methods: ["GET", "POST", "PUT"],
  credentials: true,
})); // Use cors middleware globally


const fileStorage = multer.diskStorage({
  destination: function(req, file, cb) {
      cb(null, 'images');
  },
  filename: function(req, file, cb) {
      cb(null, uuidv4() + '-' + file.originalname)
  }
});

const fileFilter = (req, file, cb) => {
  if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};


app.use(bodyParser.json()); // application/json
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single('image')
);
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  // res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});


// app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Welcome to clinic online API...');
});
//is-auth
app.use('/is-auth', isAuthRoutes);
app.use('/doctors', doctorRoutes);
app.use('/patients', patientRoutes);
app.use('/medical-profiles', medicalProfileRoutes);
app.use('/appointments', appointmentRoutes);
app.use('/treatment-sessions', treatmentSessionRoutes);
app.use('/specializations', specializationRoutes);

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));


app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

  // mongoose
  // .connect(MONGODB_URI)
  // .then((result) => {
  //   app.listen(process.env.PORT || 8080);
  // })
  // .catch((err) => {
  //   console.log(err);
  // });

// Connect to MongoDB database
mongoose
.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Connected to MongoDB');
  // Start the server after the database connection is established
  app.listen(process.env.PORT || 8080, () => {
    console.log('Server is running');
  });
})
.catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});


module.exports = app;