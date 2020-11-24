import {Router} from "express";

const router = Router();

import { getElement,updateElement,addElement,deleteElement,getList } from "../controllers/centros.controller";


router.route('/').get(getList);
router.route('/:id').get(getElement);
router.route('/').post(addElement);
router.route('/:id').put(updateElement);
router.route('/:id').delete(deleteElement);

export default router;
