import { Router } from 'express';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

import User from '../../db/models/UserModel';
import { getHttpStatusCode } from '../../utils/statusCode';

const userRouter = Router();
userRouter.get('/', async (_req, res) => {
  const { val: users, err } = await User.findAll();
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.json(users);
  }
});

userRouter.get('/:id', async (req, res) => {
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

userRouter.post('/signup', async (req, res) => {
  req.body.password = await argon2.hash(req.body.password);
  const { val: user, err } = await User.create(req.body);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else if (user === undefined) {
    res.status(500).json({ error: 'Internal Server Error' });
    return;
  } else {
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
        name: user.name
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h'
      }
    );

    res.status(201).json({ token });
  }
});

userRouter.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const { val: users, err } = await User.findBy({ username });

  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: 'please enter a valid username and password' });
    return;
  }

  if (users === undefined) {
    res.status(401).json({ error: 'please enter a valid username and password' });
    return;
  }

  try {
    const user = users[0];

    if (await argon2.verify(user.password, password)) {
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          email: user.email,
          name: user.name
        },
        process.env.JWT_SECRET as string,
        {
          expiresIn: '1h'
        }
      );

      res.status(200).json({ token });
    } else {
      res.status(401).json({ error: 'please enter a valid username and password' });
    }
  } catch (err) {
    res.status(401).json({ error: 'please enter a valid username and password' });
  }
});

userRouter.put('/:id', async (req, res) => {
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

userRouter.delete('/:id', async (req, res) => {
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
    res.json({ error: `User with ID '${id}' deleted if it existed` });
  }
});

export default userRouter;
