import express from 'express';

import diagnoseService from '../services/diagnoses';


const diagnoseRouter = express.Router();

diagnoseRouter.get('/', (_req, res) => {
  res.json(diagnoseService.getEntries())
});

export default diagnoseRouter;