import {Router} from "express";

const router = Router();

import { profile } from "../controllers/auth.controller";
import { addUser,login } from "../controllers/registration.controller";

// router.route('/register').post
//     ( addUser );

router.route('/login').post
    ( login );

// router.route('/profile').get
//     ( profile );

export default router;