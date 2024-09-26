import { Router } from 'express';

import Checklist from '../../db/models/ChecklistModel';
import { getHttpStatusCode } from '../../utils/statusCode';
import { authMiddleware } from '../middlewares';

const checklistRouter = Router();
checklistRouter.use(authMiddleware);

checklistRouter.get('/', async (req, res) => {
  const user = (req as any).authUser;
  const searchQuery = req.query.searchQuery as string;
  const { val: checklist, err } = await Checklist.findAllWithCreatorDetails(user.id, searchQuery);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.json(checklist);
  }
});

checklistRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);
  const user = (req as any).authUser;
  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  const { val: checklist, err } = await Checklist.findWithCreatorDetails(id, user.id);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    const showFull = req.query.full;
    if (showFull !== '1') {
      return res.json(checklist);
    }
    const { val: checklistFull, err } = await checklist!.get_full(user.id);
    if (err) {
      const status = getHttpStatusCode(err);
      return res.status(status).json({ error: err.message });
    } else {
      return res.json(checklistFull);
    }
  }
});

checklistRouter.post('/', async (req, res) => {
  const user = (req as any).authUser;
  const creator_id = req.body.creator_id;
  if (user.id !== creator_id) {
    return res.status(409).json({ error: "Can't create checklist for other users" });
  }
  const { val: checklist, err } = await Checklist.create(req.body);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.json(checklist);
  }
});

checklistRouter.post('/enroll', async (req, res) => {
  const user_id = req.body.user_id;
  const checklist_id = req.body.checklist_id;
  const { val: user_checklist, err } = await Checklist.enroll(user_id, checklist_id);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res
      .status(200)
      .json({ message: `${user_id} succesfully enrolled in checklist: ${checklist_id}` });
  }
});

checklistRouter.put('/:id', async (req, res) => {
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

  // TODO: validate if id is the creator id
  // need to fetch the checklist first, and then call checklist.update

  const { val: checklist, err } = await Checklist.update(id, req.body);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.json(checklist);
  }
});

checklistRouter.delete('/:id', async (req, res) => {
  // TODO: check if id is the creator id, (and logged in)
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  const { err } = await Checklist.delete(id);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.status(200).json({ message: `checklist with ID '${id}' deleted` });
  }
});

export default checklistRouter;
