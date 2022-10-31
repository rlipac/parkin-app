const { Router } = require('express');
// const { check } = require('express-validator');

// jswtoken

const { checkAuth } = require('../middleware/atuthenticar')
const { ingresoVehiculo,
        salidaYCobro,
        listarEstancias
} = require('../controller/estanciaController')

// roouter


const router = Router();




 router.post('/', checkAuth,  ingresoVehiculo);
 router.post('/salida', checkAuth, salidaYCobro);
 router.get('/', checkAuth, listarEstancias);
// router.put('/:id', checkAuth,  editVehicle);
// router.delete('/:id', checkAuth,  deleteVehicle);

module.exports = router;