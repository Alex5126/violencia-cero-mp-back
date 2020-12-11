import {Router} from "express";

const router = Router();

import { addUser,updateElement,sendRecoveryCode,validCode, getUsersApp, perfil, getUsersPanel, deleteUserPanel } from "../controllers/usersadm.controller";
import { deleteUserApp} from "../controllers/usersapp.controller";

//router.route('/usuario/:id').get(perfil);

router.route('/').get(perfil);
router.route('/:id').put(updateElement);
router.route('/usersapp').get(getUsersApp);
router.route('/userspanel').get(getUsersPanel);
router.route('/userspanel/:id').delete(deleteUserPanel);
router.route('/usersapp/:id').delete(deleteUserApp);

export default router;
