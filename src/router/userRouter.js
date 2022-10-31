const { Router } = require('express');
// const { check } = require('express-validator');


const router = Router();




const { userSave, userList, buscarUsuario, editUsuario, login } = require('../controller/userController')

router.post('/login', login);
router.post('/', userSave);
router.get('/',  userList);
router.get('/:id',  buscarUsuario);
router.put('/:id',  editUsuario);

module.exports = router;