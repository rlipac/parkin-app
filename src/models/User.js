const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');


const UsuarioSchema = Schema({
    nombre: {
        type: String, require: true, trim: true
    },
    apellidos:{ 
        type: String, require: true, trim: true
    },
    email:{
        type:String, require:true, unique:true, trim:true
    },
    password:{
        type:String, require:true
    },
    role:{
        type:String,
        required: [ true, 'Definir Rol es obligatorio'],
        default: 'USER_ROLE',
        emun: [  'ADMIN_ROLE', 'USER_ROLE' ]
      },
    token:{
        type:String
    },
    estado:{
        type:Boolean, require:true, default:false
    }

},{
    timestamps: true 
});

 // encriptar contraseña // se ejecuta antes de guardar el usaurio
UsuarioSchema.pre('save', async function(next){
    if(!this.isModified('password')){
        return next(); 
    } // si el password no ha sido modificado, seguir con el siguiente Midleware // si ya esta hasheado sigue de largo sino lo hashea
    const salt = await bcrypt.genSalt(10)// numero de vueltas para el hash
    this.password = await bcrypt.hash(this.password, salt);// this.password hace referencia al password ingresado
    next();

});

UsuarioSchema.methods.compararPassword = async  function(passwordIngresado){
    return await bcrypt.compare(passwordIngresado, this.password)

}


module.exports = model( 'Usuario', UsuarioSchema );