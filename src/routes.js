import { Router } from 'express';
import { GetController } from './controllers/GetController.js';
import { PostController } from './controllers/PostController.js';

const router = Router();

const getController = new GetController;
const postController = new PostController;

router.get("/contas", getController.listAccounts);
router.post("/contas", postController.createAccount);

export { router };