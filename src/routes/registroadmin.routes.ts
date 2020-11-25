import {Router} from "express";

const router = Router();

import { addUser,updateElement,sendRecoveryCode,validCode, getUsersApp, updatePasswordRecovery, login } from "../controllers/usersadm.controller";


//router.route('/usuario/:id').get(perfil);
router.route('/').post(addUser);
//router.route('/:id').put(updateElement);
router.route('/login').post( login );
router.route('/codigo').post(sendRecoveryCode);
router.route('/valida-codigo').post(validCode);
router.route('/actualiza-passw/:id').put(updatePasswordRecovery);

export default router;
