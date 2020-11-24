import {Router} from "express";

const router = Router();

import { getUser,addUser,getElement,updateElement } from "../controllers/registration.controller";


//router.route('/get').post(getElement);
router.route('/usuario').post(addUser);
router.route('/usuario').put(updateElement);



export default router;
