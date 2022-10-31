const colors = require('colors/safe');// colorea la consola
const { response, request } = require('express');
const moment = require('moment');

moment.locale('es');
moment().format();


//



// model 
const Vehicle = require('../models/Vehicle.js');
const Estancia = require('../models/Estancia.js');
const ReciboMes = require('../models/ReciboMes.js');
//helper
const { formatearFecha, formatearFecha2 } = require('../helpers/formatearFecha')

const listarEstancias = async (req, res) => {


    try {
        const hora = new Date();
        console.log('listando estancias', hora)
        const estancias = await Estancia.find().populate('categoria').where('cancelado').equals(false)
        res.status(200).json({ estancias })
    } catch (error) {

    }
}

const ingresoVehiculo = async (req, res) => {
    console.log(colors.white('ingeso vehiculos'));

    //? importe coibrada a cada vehiculo
    try {

        const { placa, categoria = "631b8a14ea90c049cd3da7a3" } = req.body;

        const vehiculo = await Vehicle.findOne({ placa: placa }).populate('categoria').where('estado').equals(true)
        console.log('vehiculo', vehiculo)

        if (vehiculo) {
            const categoria = vehiculo.categoria

            const newEstancia = new Estancia({
                placa: placa,
                ingreso: new Date(),
                categoria: categoria._id

            });

            const estancia = await Estancia.findOne({ placa: placa }).where('salida').equals(null)
            //   .where('ingreso').equals(`${newEstancia.ingreso}`)
            if (estancia) {
                console.log('estancia existe: ', estancia)
                return res.status(300).json({ msg: `la placa: ${placa} esta registrada  y con salida pendiente ` })
            }
            await newEstancia.save()
            console.log('creando estancia, ', newEstancia);
            return res.status(200).json(newEstancia)


        }
        console.log('crear estancia externa')
        const estancia = await Estancia.findOne({ placa: placa }).where('salida').equals(null)
            .where('cancelado').equals(false);
        if (estancia) {
            console.log('estancia existe externa: ', estancia)
            return res.status(300).json({ msg: `la palca ${placa} ya esta registrado,  con salida pendiente` })
        }
        const newEstancia = new Estancia({
            placa: placa,
            ingreso: new Date(),
            categoria: categoria

        });
        await (await newEstancia.save()).populate('categoria')//para hacer populatea categoria
        console.log('creando estancia, ', newEstancia);
        return res.status(200).json(newEstancia)



    } catch (error) {
        console.log(colors.red.bgWhite(error));
    } finally {
        res.end()
    }


}


//?probar otra vez
//     const fechaIngreso = {

//         anio: estancia.ingreso.getYear(), 
//         mes: estancia.ingreso.getMonth() + 1, 
//         dia: estancia.ingreso.getDate(), 
//         hora: estancia.ingreso.getHours(),
//         minuto: estancia.ingreso.getMinutes(), 
//         segundos: estancia.ingreso.getSeconds(),
//     }
//     const fechaSalida = {

//         anio: horaSalida.getYear(), 
//         mes: horaSalida.getMonth() + 1, 
//         dia: horaSalida.getDate(), 
//         hora: horaSalida.getHours(), 
//         minuto: horaSalida.getMinutes(),
//         segundos: horaSalida.getSeconds(),
//  }

// const mes = parseInt(fechaSalida.mes) - parseInt(fechaIngreso.mes);
// if(mes > 0){
//    return console.log('calculr diferencia mes')
// }
// const dia = parseInt(fechaSalida.dia) - parseInt(fechaIngreso.dia);
// if(dia > 0){
//     const horas =  (parseInt(dia * 24) - fechaIngreso.hora) + fechaSalida.hora;//total de horas - hora de ingreso + hora salida
//     const minutosDia = parseInt(60 - fechaIngreso.minuto) + fechaSalida.minuto;
//     const minutos = (horas * 60) + minutosDia;
//      return console.log('calculr diferencia dia',dia , horas, minutosDia, ' ', minutos)
// }
// const horas =  fechaSalida.hora - fechaIngreso.hora ;//total de horas - hora de ingreso + hora salida
// const minutosDia = parseInt(60 - fechaIngreso.minuto) + fechaSalida.minuto;
// const minutos = (horas * 60) + minutosDia;
// // actualisando estancia

const salidaYCobro = async (req, res) => {
    console.log(colors.white('ingeso vehiculos'));
    try {
        const { placa } = req.body;
        const estancia = await Estancia.findOne({ placa: placa }).populate('categoria')
            .where('cancelado').equals(false)

        console.log('linea 140', estancia)
        if (estancia) {
            const { nombre, costoPorMinuto } = estancia.categoria;

            const horaSalida = new Date();
            console.log(` ingreso: ${moment(estancia.ingreso).format('LLLL')}, sal: ${moment(horaSalida).format('LLLL')}`)

            // calcular tiepo de estancia 
            const milisegundos = parseInt(horaSalida.getTime()) - parseInt(estancia.ingreso.getTime());
            const minutos = Math.ceil((milisegundos / 1000) / 60);
            console.log(colors.blue(milisegundos, minutos))
            //fin

            // actualizando estancia
            estancia.salida = horaSalida;
            estancia.minutos = minutos;
            estancia.cancelado = true;
            // calcular total a a pagar
            estancia.totalApagar = parseFloat(minutos * costoPorMinuto).toFixed(2);
            const recibo = await Estancia.findByIdAndUpdate(estancia._id, estancia, { new: true }).populate('categoria', '-_id nombre costoPorMinuto')

            const vehiculo = await Vehicle.findOne({ placa: placa })

            if (vehiculo) {
                const { categoria } = recibo;
                if (categoria.nombre === 'RESIDENTE') {
                    console.log('calculando Residente')
                    const salida = parseInt(((horaSalida.getTime() / 1000) / 60)/60);
                    const entrada = 721//parseInt(((vehiculo.fechaDeAlta.getTime() / 1000) / 60)/60); // 
                    const diferenciaTiempo = salida - entrada;
                    if (diferenciaTiempo > 720.001) {
                        console.log('calculado recibo del mes...')
                        vehiculo.estancias.push(recibo);
                        vehiculo.minutoAcumulados = vehiculo.minutoAcumulados + minutos;
                        console.log(colors.cyan(vehiculo));
                        console.log(colors.blue.bgYellow(recibo))
                        const vehiculoUpdate = await Vehicle.findByIdAndUpdate(vehiculo._id, vehiculo, { new: true }).populate('estancias', 'minutos totalApagar')
                        const reciboMes = new ReciboMes({
                            vehiculo: vehiculoUpdate._id,
                            totalMes: parseFloat(vehiculoUpdate.minutoAcumulados * costoPorMinuto).toFixed(2)
                        })
                        await reciboMes.save();
                        console.log('total del Mes: ', reciboMes)
                       

                    }
                    return res.status(200).json({ msg: 'recibo RESIDENTE', recibo })
                }
                console.log('linea 166 :-> ', vehiculo._id)
                vehiculo.estancias.push(recibo);
                vehiculo.minutoAcumulados = vehiculo.minutoAcumulados + minutos;
                const vehiculoUpdate = await Vehicle.findByIdAndUpdate(vehiculo._id, vehiculo, { new: true }).populate('estancias', 'minutos totalApagar')
                console.log(colors.cyan(recibo, 'ok', vehiculoUpdate))
                return res.status(200).json({ msg: 'recibo oficial', recibo })

            } 
            return res.status(200).json({ msg: 'recibo externo', recibo })
            

        } else {
            console.log('no existe estancia')
            return res.status(300).json({ msg: `la placa ${placa} no registra ingreso reciente` })
        }


    } catch (error) {
        console.log(colors.red(error));
        return res.status(400).json({ msg: ` error typo: ${error}` })
    } finally {
        res.end()
    }


}

module.exports = {
    ingresoVehiculo,
    salidaYCobro,
    listarEstancias
}