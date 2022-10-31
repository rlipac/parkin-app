//FechaServicio,  horallegada, hora salida,  minutos, precio x minuto,  anulacion


const { Schema, model} = require('mongoose')

const CategoriaSchema =({
    nombre:{
        type:String, required:[true, 'Nombre de categoria requerido'], unique:true
    },
    costoPorMinuto:{
        type:Number, required:[true,"Ingrese costo"]
    },
    estado:{
        type:Boolean,
        default: true
    }
});


module.exports = model( 'Categoria',  CategoriaSchema);