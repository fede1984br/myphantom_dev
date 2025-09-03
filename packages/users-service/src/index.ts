import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3001;

app.use(express.json());

app.get('/users', (req: Request, res: Response) => {
  res.json({ message: 'This is the users service' });
});

app.listen(port, () => {
  console.log(`Users service running on port ${port}`);
});
