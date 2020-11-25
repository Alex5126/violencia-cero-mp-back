import {Router} from "express";

const router = Router();

import { addUser,perfil,updateElement,sendRecoveryCode,validCode, login, updatePasswordRecovery } from "../controllers/usersapp.controller";


router.route('/login').post( login );
router.route('/registro').post(addUser);
router.route('/codigo').post(sendRecoveryCode);
router.route('/valida-codigo').post(validCode);
router.route('/actualiza-passw/:id').put(updatePasswordRecovery);

export default router;
