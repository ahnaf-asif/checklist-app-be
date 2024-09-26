import { Router } from 'express';
import { authMiddleware } from '../middlewares';
import Group from '../../db/models/GroupModel';
import { query } from '../../db';

const groupRouter = Router();
groupRouter.use(authMiddleware);

groupRouter.get('/', async (req, res) => {
  const authUser = (req as any).authUser;
  const { val: groups, err } = await Group.findGroups(authUser.id);
  if (err) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(200).json(groups);
  }
});

groupRouter.get('/:id', async (req, res) => {
  const authUser = (req as any).authUser;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  const { val: group, err } = await Group.findGroup(authUser.id, id);
  if (err) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(200).json(group);
  }
});

groupRouter.get('/:id/members', async (req, res) => {
  const authUser = (req as any).authUser;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }
  const { val: groups, err } = await Group.findGroupMembers(id);
  if (err) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(200).json(groups);
  }
});

groupRouter.post('/', async (req, res) => {
  const authUser = (req as any).authUser;
  const { name, description } = req.body;
  if (!name || !description) {
    res.status(400).json({ error: 'Name and description are required' });
    return;
  }

  const { val: group, err } = await Group.createGroup(authUser.id, {
    name,
    description,
    creator_id: authUser.id
  });
  if (err) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(201).json(group);
  }
});

groupRouter.delete('/:id', async (req, res) => {
  const authUser = (req as any).authUser;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  const { val: currentGroup, err: error } = (await Group.findGroup(authUser.id, id)) as any;

  if (authUser.username !== currentGroup.creator_username) {
    res.status(403).json({ error: `You are not authorized to delete this group` });
    return;
  }

  const { val: group, err } = await Group.deleteGroup(id);
  if (err) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(200).json(group);
  }
});

groupRouter.post('/:id/join', async (req, res) => {
  const authUser = (req as any).authUser;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  const { val: group, err } = await Group.addGroupMember(id, authUser.id);
  if (err) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(200).json(group);
  }
});

groupRouter.post('/:id/leave', async (req, res) => {
  const authUser = (req as any).authUser;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  const { val: group, err } = await Group.removeGroupMember(id, authUser.id);
  if (err) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(200).json(group);
  }
});

groupRouter.get('/created/:id', async (req, res) => {
  const authUser = (req as any).authUser;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  if (id !== authUser.id) {
    res.status(403).json({ error: `You are not authorized to view this group` });
    return;
  }

  const { val: groups, err } = await Group.findCreatedGroups(authUser.id);
  if (err) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(200).json(groups);
  }
});

groupRouter.get('/enrolled/:id', async (req, res) => {
  const authUser = (req as any).authUser;
  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  if (id !== authUser.id) {
    res.status(403).json({ error: `You are not authorized to view this group` });
    return;
  }

  const { val: groups, err } = await Group.findEnrolledGroups(authUser.id);
  if (err) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(200).json(groups);
  }
});

export default groupRouter;
