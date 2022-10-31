const  colors = require('colors/safe');// colorea la consola
const { response, request } = require('express');
// Model
const Categoria = require('../models/Categoria');

const crearCategoria = async (req, res)=>{
   
    try {
        console.log('crear categoia');
        const { ...data } = req.body;
        const categoria = new Categoria(data);
        categoriaExiste = await Categoria.findOne({nombre:data.nombre})
        if(categoriaExiste){
            return res.status(300).json({msg:`la categoria ${categoriaExiste.nombre} ya existe`})
        }
       const nuevaCategoria = await categoria.save()

        res.status(200).json({ msg: `Creando categoria`,
                               nuevaCategoria
                            })
    } catch (error) {
        console.log(error);
        res.status(400).json({ msg: `Creando categoria`})
    }finally{
        res.end()
    }
} 

const listarCategorias = async (req, res)=>{
    try {
        console.log('listar categorias')
       const  categorias = await Categoria.find()
       res.status(200).json(categorias)
        
    } catch (error) {
        console.log(error)
    }finally{
        res.end()
    }
}
module.exports ={
    crearCategoria,
    listarCategorias
}