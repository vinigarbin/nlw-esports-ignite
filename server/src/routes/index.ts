import { response, Router } from 'express';

const routes = Router();

routes.get('/', (req, res) => {
  console.log('teste');
  res.status(200).send('teste');
});

export default routes;
