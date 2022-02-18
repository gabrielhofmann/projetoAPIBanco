import { Router } from 'express';
import { GetController } from './controllers/GetController.js';
import { PostController } from './controllers/PostController.js';
import { TransactionsController } from './controllers/TransactionsController.js';

const router = Router();

const getController = new GetController;
const postController = new PostController;
const transactionsController = new TransactionsController;

router.get("/contas", getController.listAccounts);
router.post("/contas", postController.createAccount);
router.put("/contas/:id", transactionsController.updateAccount);

export { router };