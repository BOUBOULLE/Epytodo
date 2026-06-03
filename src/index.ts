import 'dotenv/config';
import express from 'express';
import authRouter from './routes/auth/auth';
import userRouter from './routes/user/user';
import todoRouter from './routes/todos/todos';
import { notFound } from './middleware/notFound';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/', authRouter);
app.use('/user', userRouter);
app.use('/users', userRouter);
app.use('/todos', todoRouter);
app.use(notFound);

app.listen(port, () => {
    console.log(`server running on port ${port}`);
});
