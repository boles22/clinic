const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const mongooseConnection = require('../app');
const genAuthToken = require('../utils/genAuthToken');
const Patient = require('../models/patient');


describe('Patient Routes', () => {
  let patientId;
  let token;

  beforeAll(async () => {
    // Wait for the connection to be established before running tests
    process.env.PORT = 8081; // Use a different port for this test suite

    await mongooseConnection;

    const existingPatient = await Patient.findOne({ email: 'testpatient@example.com' });

    // If the patient doesn't exist, create a new one
    if (!existingPatient) {
      // Create a test patient
      const testPatient = new Patient({
        name: 'Test Patient',
        email: 'testpatient@example.com',
        password: 'testpassword',
        bio: 'test bio',
        image: 'test image',
        specialization: '652a38a0098c57ba13276466'
      });
      await testPatient.save();
    }

    // Get the patient ID and generate an auth token for testing
    const patient = await Patient.findOne({ email: 'testpatient@example.com' });
    patientId = patient._id.toString();
    console.log('patientId',patientId);
    const role = 'patient';
    token = genAuthToken(patient, role);
  });

  afterAll(async () => {
    // Disconnect from the mock MongoDB database
    await mongoose.disconnect();
  });

  describe('GET /patients/:patientId', () => {
    test('it should return a patient by ID', async () => {
      const response = await request(app)
        .get(`/patients/get-patient-by-id/${patientId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('patient');
    });
  });

  describe('PUT /patients/update-patient', () => {
    test('it should update a patient', async () => {
      const updatedName = 'Updated Patient Name';
      const specializationId = '652a38a0098c57ba13276466'
      const response = await request(app)
        .put(`/patients/update-patient`)
        .set('Authorization', `Bearer ${token}`)
        .send({ name: updatedName, specializationId: specializationId });
      expect(response.status).toBe(200);
      expect(response.body.patient.name).toBe(updatedName);
    });
  });

  describe('DELETE /patients/:patientId', () => {
    test('it should delete a patient', async () => {
      const response = await request(app)
        .delete(`/patients/${patientId}`)
        .set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Patient deleted successfully.');
    });
  });

});
