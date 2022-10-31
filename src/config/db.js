const  colors = require('colors/safe');
const mongoose = require('mongoose');


const conexionBD = async()=>{
  try {
    mongoose.connect(process.env.URL_DB_LOCAL);
    console.log(colors.white.bgGreen('se conecto'));
  } catch (error) {
    console.log(colors.red('No conecto', error));
  }
}
module.exports={ 
  conexionBD
}

