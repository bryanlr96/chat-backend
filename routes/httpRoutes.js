import express from 'express';
import { HttpController } from '../controllers/httpController.js';
const router = express.Router();

//ruta para regargar
router.get('/reload', HttpController.reload)

//peticion para el login
router.post("/login", HttpController.login)

//peticion para el registro
router.post("/register", HttpController.register)

//peticion para el logout
router.post('/logout', HttpController.logout)

//Si intentan entrar en otra url son reenviados al login
router.use(HttpController.redirectLogint);

export default router;
