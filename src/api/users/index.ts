import { Router } from 'express';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

import User from '../../db/models/UserModel';
import { getHttpStatusCode } from '../../utils/statusCode';
import { authMiddleware } from '../middlewares';

const userRouter = Router();
userRouter.get('/', authMiddleware, async (_req, res) => {
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
    res.status(403).json({ error: err.message });
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
    res.status(403).json({ error: 'please enter a valid username and password' });
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
      res.status(403).json({ error: 'please enter a valid username and password' });
    }
  } catch (err) {
    res.status(403).json({ error: 'please enter a valid username and password' });
  }
});

userRouter.put('/:id', authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const authUser = (req as any).authUser;

  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  if (id !== authUser.id) {
    res.status(403).json({ error: `You are not authorized to update this user` });
    return;
  }

  if (req.body.id) {
    if (req.body.id !== id) {
      res.status(400).json({
        error: `ID in the body '${req.body.id}' does not match ID in the URL '${id}'. omit the id field or use the correct ID`
      });
      return;
    }
    delete req.body.id;
  }

  const { val: userData, err: errData } = await User.find(id);

  if (errData) {
    const status = getHttpStatusCode(errData);
    res.status(status).json({ error: errData?.message });
    return;
  }

  const currentUser = userData as User;

  if (!(await argon2.verify(currentUser.password, req.body?.password as string))) {
    res.status(403).json({ error: 'password is incorrect' });
    return;
  }

  req.body.password = await argon2.hash(req.body.password);

  const { val: user, err } = await User.update(id, req.body);

  const updatedUser = user as User;

  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err?.message });
  } else {
    const token = jwt.sign(
      {
        id: updatedUser.id,
        username: updatedUser.username,
        email: updatedUser.email,
        name: updatedUser.name
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: '1h'
      }
    );
    res.status(200).json({ token });
  }
});

userRouter.put('/:id/password', authMiddleware, async (req, res) => {
  const id = Number(req.params.id);
  const authUser = (req as any).authUser;

  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  if (id !== authUser.id) {
    res.status(403).json({ error: `You are not authorized to update this user` });
    return;
  }

  if (req.body.id) {
    if (req.body.id !== id) {
      res.status(400).json({
        error: `ID in the body '${req.body.id}' does not match ID in the URL '${id}'. omit the id field or use the correct ID`
      });
      return;
    }
    delete req.body.id;
  }

  const { val: userData, err: errData } = await User.find(id);

  if (errData) {
    const status = getHttpStatusCode(errData);
    res.status(status).json({ error: errData?.message });
    return;
  }

  const currentUser = userData as User;

  if (!(await argon2.verify(currentUser.password, req.body?.password as string))) {
    res.status(403).json({ error: 'password is incorrect' });
    return;
  }

  req.body.password = await argon2.hash(req.body.newPassword);

  const { val: user, err } = await User.update(id, { password: req.body.password });

  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err?.message });
  } else {
    res.status(200).json({ message: 'Password updated successfully' });
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
    res.status(200).json({ message: `User with ID '${id}' deleted if it existed` });
  }
});

export default userRouter;
