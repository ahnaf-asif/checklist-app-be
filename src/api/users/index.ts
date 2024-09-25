import { Router } from 'express';
import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken';

import User from '../../db/models/UserModel';
import { getHttpStatusCode } from '../../utils/statusCode';
import { authMiddleware } from '../middlewares';

const userRouter = Router();
userRouter.get('/', authMiddleware, async (req, res) => {
  const authUser = (req as any).authUser;

  const { val: users, err } = await User.findAllUsers(authUser.id);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.json(users);
  }
});

userRouter.get('/:id', authMiddleware, async (req, res) => {
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

userRouter.delete('/:id', authMiddleware, async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  const authUser = (req as any).authUser;

  if (id !== authUser.id) {
    res.status(403).json({ error: `You are not authorized to delete this user` });
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

userRouter.get('/:id/friends', authMiddleware, async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  const { val: user, err } = await User.find(id);
  if (err || !user) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err ? err.message : 'User not found' });
    return;
  }

  const { val: friends, err: errFriends } = await user.findFriends();
  if (errFriends) {
    const status = getHttpStatusCode(errFriends);
    res.status(status).json({ error: errFriends.message });
  } else {
    res.json(friends);
  }
});

userRouter.post('/:user_id/friends/:friend_id', authMiddleware, async (req, res) => {
  const user_id = Number(req.params.user_id);
  const friend_id = Number(req.params.friend_id);
  const authUser = (req as any).authUser;

  if (isNaN(user_id) || isNaN(friend_id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.user_id} or ${req.params.friend_id}` });
    return;
  }

  if (user_id !== authUser.id) {
    res.status(403).json({ error: `You are not authorized to add a friend to this user` });
    return;
  }

  const { val: user, err } = await User.find(user_id);
  if (err || !user) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err ? err.message : 'User not found' });
    return;
  }

  const { val: friend, err: errFriend } = await User.find(friend_id);
  if (errFriend || !friend) {
    const status = getHttpStatusCode(errFriend);
    res.status(status).json({ error: errFriend ? errFriend.message : 'Friend not found' });
    return;
  }

  const { err: errAddFriend } = await user.addFriend(friend.id);
  if (errAddFriend) {
    const status = getHttpStatusCode(errAddFriend);
    res.status(status).json({ error: errAddFriend.message });
  } else {
    res.status(201).json({ message: `Successfully added ${friend.username} as a friend.` });
  }
});

userRouter.delete('/:user_id/friends/:friend_id', authMiddleware, async (req, res) => {
  const user_id = Number(req.params.user_id);
  const friend_id = Number(req.params.friend_id);
  const authUser = (req as any).authUser;

  if (isNaN(user_id) || isNaN(friend_id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.user_id} or ${req.params.friend_id}` });
    return;
  }

  if (user_id !== authUser.id) {
    res.status(403).json({ error: `You are not authorized to delete a friend from this user` });
    return;
  }

  const { val: user, err } = await User.find(user_id);
  if (err || !user) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err ? err.message : 'User not found' });
    return;
  }

  const { val: friend, err: errFriend } = await User.find(friend_id);
  if (errFriend || !friend) {
    const status = getHttpStatusCode(errFriend);
    res.status(status).json({ error: errFriend ? errFriend.message : 'Friend not found' });
    return;
  }

  const { err: errDeleteFriend } = await user.unFriend(friend.id);
  if (errDeleteFriend) {
    const status = getHttpStatusCode(errDeleteFriend);
    res.status(status).json({ error: errDeleteFriend.message });
  } else {
    res.status(200).json({ message: `Successfully deleted ${friend.username} from friends.` });
  }
});

export default userRouter;
