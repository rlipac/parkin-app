const  colors = require('colors/safe');// colorea la consola

const { response, request } = require('express');

//model
const Vehicle = require('../models/Vehicle')

const vehicleList = async (req, res)=>{
    console.log(colors.black.bgBrightYellow('Listando Vehicle'));
   try {
        const vehicles = await Vehicle.find().populate('categoria', ' nombre')
                                             .populate('creador', '-_id email');
        console.log(colors.white(vehicles.length))
        const total = vehicles.length
        return res.status(200).json({
            msg:`Lista de vehiculos`,
            total_vehicles: total,
            vehicles
        })
   } catch (error) {
    console.log(colors.red(error));
    return res.status(400).json({
        msg: `error typo ${error}`
    })
   }

}
const vehicleSave = async (req, res)=>{
    console.log(colors.black.bgBrightYellow('Creando Vehicle'));
     try {
        const idCreador = req.usuario._id;
        const { creador, placa,...data } = req.body;
        const vehiculoExiste = await Vehicle.findOne({ placa: placa });
        if(vehiculoExiste){
            return res.status(400).json({ msg:`el vehiculo ${placa}, existe`})
        } 
        const vehicle = new Vehicle({ 
            ...data,
            placa: placa,
            creador: idCreador.toString()

        })  
       const vehicloNuevo = await ( await vehicle.save()).populate('categoria', '-_id nombre')
                                                      
                                    
        res.status(200).json(vehicloNuevo)
     } catch (error) {
        console.log(colors.red(error));
     }finally{
        res.end()
     }
   
}
const buscarVhiecle = async (req, res)=>{
    console.log(colors.black.bgWhite('buscar vehiculo'))
    try {
        const { placa } = req.body;
        //validaciones
        if(/^[^$%&?!|<>#]*$/.test(placa)) {//valida que no exisata caracteres especiales
          
            const ExpRegNunPlaca= /^[a-z0-9-]{5,8}$/;//letras y numeros de 6 hasta 8 digitos
             const NomUsuarioValida=placa;//Cadena de Nombres de Usuario
             const NomUsuarioinvalida=placa;//Cadena de Nombres de Usuario
             
             //Evaluación de Cadena Valida de Nombres de Usuario
             if(NomUsuarioValida.match(ExpRegNunPlaca)!=null)
                return console.log("Nombres de Usuario Válida");
             
             //Evaluación de Cadena Invalida de Nombres de Usuario  
             if(NomUsuarioinvalida.match(ExpRegNunPlaca)==null)
                return console.log("Nombres de Usuario Invalida");
           }else{
             return console.log('INVALIDO')
           }

        const vehiculo = await Vehicle.findOne({placa:placa}).populate('categoria', '-_id nombre')
                                                             .populate('creador', '-_idemail role')
                                                             .populate('estancias', ' minutos')                                                   
      if(!vehiculo){
        return res.status(200).json({msg: `vehiculo de placa ${placa} no registrado`})
      }
       console.log(colors.green.bgWhite(vehiculo));
     return res.status(200).json({msg: 'buscandon vehiculo', vehiculo});
    } catch (error) {
        console.log(colors.black.bgWhite('error: ', error))
        return res.status(200).json({msg: `error: ${error}`});
    }finally{
        res.end()
    }
    
}
const editVehicle = async (req, res)=>{
    
}
const deleteVehicle = async (req, res)=>{
    
}

module.exports ={
    vehicleList,
    vehicleSave,
    buscarVhiecle,
    editVehicle,
    deleteVehicle
}