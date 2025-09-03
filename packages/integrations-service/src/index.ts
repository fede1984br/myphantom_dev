import express, { Request, Response } from 'express';

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.get('/integrations', (req: Request, res: Response) => {
  res.json({ message: 'This is the integrations service' });
});

app.listen(port, () => {
  console.log(`Integrations service running on port ${port}`);
});
