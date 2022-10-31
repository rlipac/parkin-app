// placa, marca(opcional), modelo(opcion), typoVehiculi(residente, oficial, no residente)

const { Schema, model} = require('mongoose')

const VehicleSchema =({
    placa:{
        type:String, unique:[true, 'esta placa ya esta registrada'], required:[true, 'La placa es oblicatoria'],
    },
    fechaDeAlta:{
        type: Date,
        default: new Date(),
        required:true
    },
    fechaDeBaja:{
        type: Date
    },
    marca:{
        type:String
    },
    modelo:{
        type:String
    },
    minutoAcumulados:{
        type:Number,
        default:0
    },
    estancias: [ // es un array de objetos porque pueden aver varios colaboradores
        {
            type:Schema.Types.ObjectId, // id de estancia
            ref: "Estancia", // Modelo Estancia

        }
    ],
    categoria:{
        type:Schema.Types.ObjectId,
        ref:'Categoria',
        required:[true, 'id categoria requerido']
    },
    creador:{
        type:Schema.Types.ObjectId,
        ref:'Usuario',
        required:[true, 'tiene que haber usuario creador']
    },
    estado:{
        type:Boolean, required: true, default:true
    }
})


module.exports = model( 'Vehicle',  VehicleSchema);