require('dotenv').config();
const  colors = require('colors/safe');
const express = require('express');
// const bodyParser = require('body-parser');
const cors = require('cors');
//const dotenv = require('dotenv'); // llamas a la funcion config

//bd
const { conexionBD } = require('./config/db')
// rutas
const userRouter = require('./router/userRouter')
const vehicleRouter = require('./router/vehicleRouter')
const estaciaRouter = require('./router/estaciaRouter');
const CategoriaRouter = require('./router/categoriaRouter');


const app = express();

// middlewares

 // para leer el body
app.use(express.json());
// app.use(bodyParser.urlencoded({extended: true}));

// conexion BD
conexionBD();

// configuracion cors
app.use(cors())


// Routing activa las rutas
app.use("/API/users/",  userRouter );
app.use("/API/vehicle/",  vehicleRouter );
app.use("/API/estancia/",  estaciaRouter );
app.use("/API/categoria/",  CategoriaRouter);

const port = 4200;

app.listen(port, () =>{
    try {
        console.log(colors.black.bgGreen(`server corriendo en el puerto: , ${port}`));
    } catch (error) {
        console.log(colors.brightRed(error));
    }
    
})