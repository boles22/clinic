const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const mongooseConnection = require('../app');
const genAuthToken = require('../utils/genAuthToken');
const Doctor = require('../models/doctor');
const Specialization = require('../models/specialization');


describe('Doctor Routes', () => {
  let doctorId;
  let token;

  beforeAll(async () => {
    // Wait for the connection to be established before running tests
    process.env.PORT = 8082; // Use a different port for this test suite
    await mongooseConnection;

    const existingDoctor = await Doctor.findOne({ email: 'testdoctor@example.com' });

    // If the doctor doesn't exist, create a new one
    if (!existingDoctor) {
      // Create a test doctor
      const testDoctor = new Doctor({
        name: 'Test Doctor',
        email: 'testdoctor@example.com',
        password: 'testpassword',
        bio: 'test bio',
        image: 'test image',
        specialization: '652a38a0098c57ba13276466'
      });
      await testDoctor.save();
    }

    // Get the doctor ID and generate an auth token for testing
    const doctor = await Doctor.findOne({ email: 'testdoctor@example.com' });
    doctorId = doctor._id.toString();
    console.log('doctorId',doctorId);
    const role = 'doctor';
    token = genAuthToken(doctor, role);
  });

  afterAll(async () => {
    // Disconnect from the mock MongoDB database
    await mongoose.disconnect();
  });

  describe('GET /doctors/:doctorId', () => {
    test('it should return a doctor by ID', async () => {
      const response = await request(app)
        .get(`/doctors/get-doctor-by-id/${doctorId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('doctor');
    });
  });

  describe('PUT /doctors/update-doctor', () => {
    test('it should update a doctor', async () => {
      const updatedName = 'Updated Doctor Name';
      const specializationId = '652a38a0098c57ba13276466'
      const response = await request(app)
        .put(`/doctors/update-doctor`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: updatedName, specializationId: specializationId });
      expect(response.status).toBe(200);
      expect(response.body.doctor.name).toBe(updatedName);
    });
  });

  describe('DELETE /doctors/:doctorId', () => {
    test('it should delete a doctor', async () => {
      const response = await request(app)
        .delete(`/doctors/${doctorId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Doctor deleted successfully.');
    });
  });

});
