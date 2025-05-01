import express from 'express';
import loginRoutes from './routes/httpRoutes.js';
import cookieParser from 'cookie-parser';
import addSession from './middleware/addSession.js';
import cors from 'cors'
const app = express();

app.use(cors({
    origin:'https://TU_FRONTEND.vercel.app',
    credentials: true,
}))

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.get("*", addSession);

// Rutas HTTP
app.use('/', loginRoutes);

export default app;
