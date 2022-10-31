
const  colors = require('colors/safe');// colorea la consola

const { response, request } = require('express');
//model
const User = require('../models/User');
//token
const { generarJWT } = require('../helpers/generarJWT')

const Usuario = require('../models/User')

const craerAdmin = async ()=>{
    console.log(colors.black.bgBrightYellow('Creando Admin'));
  
    try {

        const data = {
            nombre:process.env.NOMBRE_USUARIO,
            apellidos:process.env.APELLIDO_USUARIO,
            email:process.env.SUPER_USUARIO,
            password:process.env.PASSWORD_ADMIN,
            role:'ADMIN_ROLE',
            token:'',
            estado:true
        }
        const usuarioExiste = await Usuario.findOne({email:data.email})
        if(usuarioExiste){
           
           return console.log(colors.red(`el usuario con el ${usuarioExiste.email} ya existe` ));
        }
        const usuario = new Usuario(data)
        await usuario.save();
       
        console.log(colors.black.bgCyan(data));
    } catch (error) {
        console.log(colors.brightRed(error));
       
    }
}
craerAdmin();

const login = async (req, res)=>{
    console.log(colors.black.bgBrightYellow('Login Usuario'));

    try {
        const { email, password } = req.body;
        const usuario = await Usuario.findOne({ email:email})
        if(!usuario)return res.status(400).json({ msg:`el usuarui ${email} no existe`})
        if(!usuario.estado) return res.status(400).json({ msg:`el usuario ${email} esta desabhilitado`})
        if(await usuario.compararPassword(password)){
            res.status(200).json({
                msg:`usuario ${email} logueado correactamente`,
                _id:usuario._id,
                email:usuario.email,
                role:usuario.role,
                token:generarJWT(usuario._id)

            })
        }
    } catch (error) {
        console.log(colors.brightRed(error));
        res.status(200).json({
            msg:`error typo: ${error} t`,
            
        })
    }
}


const userSave = async (req, res)=>{
    console.log(colors.black.bgBrightYellow('creando  usuarios'));

    try {   
         const data = req.body;
         // validacion
         const ExpRegPassFuerte=/(?=(.*[0-9]))(?=.*[\!@#$%^&*()\\[\]{}\-_+=|:;"'<>,./?])(?=.*[a-z])(?=(.*[A-Z]))(?=(.*)).{8,}/;
 
        const PassFuerteValida=data.password;//Cadena de Contraseña Fuerte
        const PassFuerteinvalida=data.password;//Cadena de Contraseña Fuerte
        
        //Evaluación de Cadena Valida de Contraseña Fuerte
        if(PassFuerteValida.match(ExpRegPassFuerte)!=null){
            console.log("Contraseña Fuerte Válida");
        }   
           
        //Evaluación de Cadena Invalida de Contraseña Fuerte  
        if(PassFuerteinvalida.match(ExpRegPassFuerte)==null){
            
           return console.log("Contraseña Fuerte Invalida");
        }
         const usuarioExiste = await Usuario.findOne({email:data.email})
         const isValidarEmail =(email)=>{
            return  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/.test(email);
               
          }
         isValidarEmail(email)
         if( isValidarEmail(email) === false){
            return res.status(400).json({msg:`el email ${email} no es valido`})
         }
           
         if(usuarioExiste){
            
            console.log(colors.red(`el usuario con el ${usuarioExiste.email} ya existe` ));
            return res.status(300).json({
                msg:`el usuario con el ${usuarioExiste.email} ya existe`
            })
         }
         const usuario = new Usuario(data)
         await usuario.save();
        
        console.log(colors.black.bgCyan(data));
         return res.status(200).json({
            msg:`usuario agregado correctamente`,
            usuario
        })

        // res.status(200).json({
        //     msg:'hola POST'
        // })
    } catch (error) {
        console.log(colors.brightRed(error));
        
        
    }
}

const userList = async ( req, res)=>{
    console.log(colors.black.bgBrightYellow('listar usuarios'));
try {
    const usuarios = await Usuario.find()
    res.status(200).json({
        msg:'lista de uaurios',
        usuarios
    })
    
} catch (error) {
    console.log(colors.brightRed(error));
}
   
}

const buscarUsuario = async ( req, res)=>{
    console.log(colors.black.bgBrightYellow('Buscar usuario'));
    try {
        const { id } = req.params;
        console.log(colors.black.bgWhite(id));
        const usuario = await Usuario.findById(id);
        if(!usuario) return res.status(400).json({msg:`el usuario con el ${id} no existe`});
        return res.status(200).json({msg: 'Usuario encontrado', usuario});
    } catch (error) {
        console.log(colors.brightRed(error));
        res.status(401).json({ msg: error })
    } finally{
        res.end()
    }
        
}

const editUsuario= async ( req, res)=>{
    console.log(colors.black.bgBrightYellow('Editar Usuario'));

    try{
        const { id } = req.params;
        const { ...data  } = req.body;
        const usuarioUdate = await Usuario.findByIdAndUpdate(id, data, {new:true});// recibe la nueva data y la actualiza
        if(!usuarioUdate) return res.status(400).json({msg:`el usuario con el ${id} no existe`});
       res.status(200).json({msg:'usuarioactualizado correcxtamente', usuarioUdate}) 
    }catch(error){
        console.log(colors.brightRed(error));
    }finally{
        res.end()
    }
}



module.exports = {
    userList,
    userSave,
    buscarUsuario,
    editUsuario,
    login
   
}