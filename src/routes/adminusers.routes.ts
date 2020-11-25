import {Router} from "express";

const router = Router();

import { addUser,updateElement,sendRecoveryCode,validCode, getUsersApp } from "../controllers/usersadm.controller";


//router.route('/usuario/:id').get(perfil);
router.route('/usuario').post(addUser);
router.route('/usuario/:id').put(updateElement);
router.route('/codigo').post(sendRecoveryCode);
router.route('/valida-codigo').post(validCode);

router.route('/usersapp').get(getUsersApp);

export default router;
