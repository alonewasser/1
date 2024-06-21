import express from 'express';
import { Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import { registerValidation, loginValidation, taskCreateValidation } from './validation.js';
import checkAuth from './utils/checkAuth.js';
import { validationResult } from 'express-validator';
import  { register } from './controllers/UserController.js';
import  { login } from './controllers/UserController.js';
import handleValidationErrors from './utils/handleValidationErrors.js';
import { UserController, taskController} from './controllers/index.js'
const app = express ();
import cors from 'cors';
app.use(bodyParser.json());
app.use(express.json());
app.use(cors());


import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();







app.get('/', (req, res) => {

});


app.post('/auth/register', registerValidation ,handleValidationErrors, register);
app.post('/auth/login', loginValidation ,handleValidationErrors, login);
app.get('/auth/me', checkAuth, taskController.getMe)
app.post('/task', checkAuth, taskCreateValidation, handleValidationErrors, taskController.create);
app.delete('/task/:id', taskController.remove);
app.patch('/task/:id', taskCreateValidation ,handleValidationErrors, taskController.updateDescription);



app.listen(5000, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server Started');
});
async function main() {
    try {
      await prisma.$connect();
      console.log('Connected to the database');
  
    } catch (error) {
      console.error('Error connecting to the database:', error);
    } finally {
      await prisma.$disconnect();
    }
  }
  main();
  