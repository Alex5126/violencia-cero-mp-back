import {Router} from "express";

const router = Router();

import { addUser,updateElement,sendRecoveryCode,validCode, getUsersApp, perfil } from "../controllers/usersadm.controller";


//router.route('/usuario/:id').get(perfil);

router.route('/').get(perfil);
router.route('/:id').put(updateElement);
router.route('/usersapp').get(getUsersApp);

export default router;
