import {Router} from "express";

const router = Router();

import { getList,getElement,addElement,updateElement,getHistory } from "../controllers/denuncia.controller";


router.route('/').get
    (getList );
router.route('/:id').get
    (getElement);
router.route('/').post
    (addElement);
router.route('/:id').put
    (updateElement);
router.route('/history').post
    (getHistory);

export default router;