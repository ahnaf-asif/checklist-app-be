import { Router } from 'express';

import Item from '../../db/models/ItemModel';
import { getHttpStatusCode } from '../../utils/statusCode';
import { authMiddleware } from '../middlewares';
import { query } from '../../db';

const itemRouter = Router();
itemRouter.use(authMiddleware);

itemRouter.get('/', async (req, res) => {
  const { val: items, err } = await Item.findAll();
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.json(items);
  }
});

itemRouter.get('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  const { val: item, err } = await Item.find(id);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.json(item);
  }
});

itemRouter.post('/', async (req, res) => {
  req.body.category_id = Number(req.body.category_id);

  const { val: item, err } = await Item.create(req.body);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.json(item);
  }
});

itemRouter.put('/:id', async (req, res) => {
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

  const { val: item, err } = await Item.update(id, req.body);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.json(item);
  }
});

itemRouter.delete('/:id', async (req, res) => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: `Invalid ID ${req.params.id}` });
    return;
  }

  const { err } = await Item.delete(id);
  if (err) {
    const status = getHttpStatusCode(err);
    res.status(status).json({ error: err.message });
  } else {
    res.status(200).json({ message: `item with ID '${id}' deleted` });
  }
});

itemRouter.put('/increase', async (req, res) => {
  const user = (req as any).authUser;
  const item_id = req.body.item_id;

  const { val: item, err: ierr } = await Item.find(item_id);
  if (ierr) {
    const status = getHttpStatusCode(ierr);
    res.status(status).json({ error: ierr.message });
  } else {
    const { err } = await item!.increase(user.id);
    if (err) {
      const status = getHttpStatusCode(err);
      res.status(status).json({ error: err.message });
    } else {
      res.status(200);
    }
  }
});

itemRouter.put('/decrease', async (req, res) => {
  const user = (req as any).authUser;
  const item_id = req.body.item_id;

  const { val: item, err: ierr } = await Item.find(item_id);
  if (ierr) {
    const status = getHttpStatusCode(ierr);
    res.status(status).json({ error: ierr.message });
  } else {
    const { err } = await item!.decrease(user.id);
    if (err) {
      const status = getHttpStatusCode(err);
      res.status(status).json({ error: err.message });
    } else {
      res.status(200);
    }
  }
});

itemRouter.put('/change_progress/:user_id/item/:item_id', async (req: any, res: any) => {
  const user_id = Number(req.params?.user_id);
  const item_id = Number(req.params?.item_id);
  const completed_steps = Number(req.body.completed_steps);
  console.log(user_id, item_id, completed_steps);

  try {
    const resp1 = await query<any>(
      `SELECT * FROM item_progress WHERE user_id = ${user_id} AND item_id = ${item_id}`
    );
    if (resp1.rows.length == 0) {
      const resp2 = await query<any>(
        `INSERT INTO item_progress (user_id, item_id, completed_steps) VALUES (${user_id}, ${item_id}, ${completed_steps})`
      );
      res.status(200).json(resp2.rows);
      return;
    }
    const resp = await query<any>(
      `UPDATE item_progress SET completed_steps = ${completed_steps} WHERE user_id = ${user_id} AND item_id = ${item_id}`
    );
    console.log(resp.rows);
    res.status(200).json(resp.rows);
  } catch (e) {
    res.status(403).json({ error: 'error happened' });
  }
});

export default itemRouter;
