import { Router } from 'express';
import { APIController } from './controllers/APIController.js';

const router = Router();

const apiController = new APIController;

router.get("/contas", apiController.listAccounts);
router.post("/contas", apiController.createAccount);
router.put("/contas/:id", apiController.updateAccount);
router.delete("/contas/:id", apiController.deleteAccount);
router.post("/transacoes/depositar", apiController.depositValue);
router.post("/transacoes/sacar", apiController.withdrawValue);

export { router };