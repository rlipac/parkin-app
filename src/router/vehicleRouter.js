const { Router } = require('express');
// const { check } = require('express-validator');

// jswtoken

const { checkAuth } = require('../middleware/atuthenticar')
const { vehicleList,
    vehicleSave,
    buscarVhiecle,
    editVehicle,
    deleteVehicle
} = require('../controller/vehicleController')

// roouter


const router = Router();




router.get('/', checkAuth,  vehicleList);
router.post('/', checkAuth, vehicleSave);
router.post('/buscar', checkAuth,  buscarVhiecle);
router.put('/:id', checkAuth,  editVehicle);
router.delete('/:id', checkAuth,  deleteVehicle);

module.exports = router;