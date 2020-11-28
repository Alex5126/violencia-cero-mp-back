import {Router} from "express";

const router = Router();

import { getList,getElement,addElement,updateElement, deleteElement } from "../controllers/procedures.controller";


router.route('/').get
    (getList );
router.route('/:id').get
    (getElement);
router.route('/').post
    (addElement);
router.route('/:id').put
    (updateElement);
router.route('/:id').delete
    (deleteElement);

export default router;