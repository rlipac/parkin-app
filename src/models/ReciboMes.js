//FechaServicio,  horallegada, hora salida,  minutos, precio x minuto,  anulacion


const { Schema, model} = require('mongoose')
const timestamps = require('mongoose-timestamp')

const ReciboMesSchema = ({
    fecha:{
        type:Date,
        default: new Date()
    },
    vehiculo:{
        type:Schema.Types.ObjectId,
        ref:'Vehicle',
        required:[true, 'tiene que haber id Vehiculo']
    },
    totalMes:{
        type:Number,
    },
    cancelado:{
        type:Boolean,
        default:false
    },
    estado:{
        type:Boolean,
        default:true
    }
}
);


module.exports = model( 'ReciboMes',  ReciboMesSchema);