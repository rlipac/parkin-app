const { Router } = require('express');
// const { check } = require('express-validator');

// jswtoken

const { checkAuth } = require('../middleware/atuthenticar')
const { crearCategoria, listarCategorias } = require('../controller/categoriaController')

// roouter


const router = Router();




 router.post('/', checkAuth,  crearCategoria);
  router.get('/', checkAuth, listarCategorias);
// router.get('/:id', checkAuth,  buscarVhiecle);
// router.put('/:id', checkAuth,  editVehicle);
// router.delete('/:id', checkAuth,  deleteVehicle);

module.exports = router;