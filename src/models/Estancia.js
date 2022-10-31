//FechaServicio,  horallegada, hora salida,  minutos, precio x minuto,  anulacion


const { Schema, model} = require('mongoose')

const EstanciaSchema =({
    ingreso:{
        type:Date,
        default: new Date(),
        required:[true, 'Hora Ingreso Obligatoria']
    },
    placa:{
        type:String
    },
    salida:{
        type:Date,
        default:null
    },
    minutos:{
        type:Number,
        default:null
       
    },
    totalApagar:{
        type:Number,
        default:null
    },
    categoria:{
        type:Schema.Types.ObjectId,
        ref:'Categoria'
    },
    cancelado:{
        type:Boolean,
        default:false
    },
    estado:{
        type:Boolean,
        default:true
    }
});


module.exports = model( 'Estancia',  EstanciaSchema);