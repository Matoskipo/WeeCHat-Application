import {Router} from 'express';

import {userRegister,userLogin} from '../controllers/userController'

const router = Router();

/* GET users listing. */
router.post('/user-register', userRegister)
router.post('/user-login', userLogin)

export default router;
