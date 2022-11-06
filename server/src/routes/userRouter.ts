import {Router} from 'express';

import {userRegister} from '../controllers/userController'

const router = Router();

/* GET users listing. */
router.post('/user-register', userRegister)

export default router;
