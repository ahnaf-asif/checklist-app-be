import { Router } from 'express';

import User from '../../db/models/UserModel';
import { getHttpStatusCode } from '../../utils/statusCode';
import DbModel from '../../db/models/DbModel';

const router = Router();
router.get('/', async (_req, res) => {
  const { val: users, err } = await User.findAll();
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.json(users);
  }
});

router.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  const { val: user, err } = await User.find(id);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.json(user);
  }
});

router.post('/', async (req, res) => {
  const { val: user, err } = await User.create(req.body);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.json(user);
  }
});

router.put('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  if (req.body.id) {
    if (req.body.id !== id) {
      res.status(400).json({
        error: `ID in the body '${req.body.id}' does not match ID in the URL '${id}'. omit the id field or use the correct ID`
      });
      return;
    }
    //omit the id field
    delete req.body.id;
  }

  const { val: user, err } = await User.update(id, req.body);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.json(user);
  }
});

router.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  const { err } = await User.delete(id);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.json({ message: `User with ID '${id}' deleted if it existed` });
  }
});

export default router;
