import express from 'express';

const app = express();
app.use(express.json());

app.get('/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(Number(port), () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${port}`);
  });
}

export default app;
