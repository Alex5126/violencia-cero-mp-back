import {Router} from "express";

const router = Router();

import { profile } from "../controllers/auth.controller";
import { addUser,login, perfil, updateElement } from "../controllers/usersapp.controller";


router.route('/:id').get(perfil);
router.route('/:id').put(updateElement);

export default router;