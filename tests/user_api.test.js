const bcrypt = require('bcrypt');
const User = require('../models/user');
const supertest = require('supertest');
const App = require('../App');
const api = supertest(App);
const mongoose = require('mongoose');
const { test, after } = require('node:test');
const assert = require('assert');

test('Ensimmäinen käyttäjä lisätään onnistuneesti', async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('validpassword', 10);
  const user = new User({ username: 'rootuser', passwordHash });
  await user.save();
});

test('creation fails if username is already taken', async () => {
  const newUser = {
    username: 'rootuser',
    name: 'Root User Duplicate',
    password: 'somepassword',
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400);

  console.log('Received error message:', result.body.error); // Tulosta virheilmoitus

  // Testaa, että virheilmoitus sisältää osan, joka viittaa uniikkiuden vaatimukseen
  assert(result.body.error.toLowerCase().includes('username must be unique'));
});

test('creation fails if password is too short', async () => {
  const newUser = {
    username: 'newuser',
    name: 'Short Password User',
    password: '12',
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400);

  assert(result.body.error.includes('password must be at least 3 characters long'));
});

test('creation fails if username is too short', async () => {
  const newUser = {
    username: 'ab',
    name: 'Short Username',
    password: 'validpassword',
  };

  const result = await api
    .post('/api/users')
    .send(newUser)
    .expect(400);

  assert(result.body.error.includes('username must be unique and at least 3 characters long'));
});

test('creation fails if username or password is missing', async () => {
  // Testi ilman käyttäjätunnusta
  const userWithoutUsername = {
    name: 'No Username User',
    password: 'securepassword',
  };

  const resultWithoutUsername = await api
    .post('/api/users')
    .send(userWithoutUsername)
    .expect(400);

  assert(resultWithoutUsername.body.error.includes('username must be unique and at least 3 characters long'));

  // Testi ilman salasanaa
  const userWithoutPassword = {
    username: 'missingpassword',
    name: 'No Password User',
  };

  const resultWithoutPassword = await api
    .post('/api/users')
    .send(userWithoutPassword)
    .expect(400);

  assert(resultWithoutPassword.body.error.includes('password is required'));
});

// Sulje MongoDB-yhteys testien jälkeen
after(async () => {
  await mongoose.connection.close();
});
