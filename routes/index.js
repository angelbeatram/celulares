const express = require('express');
const router = express.Router();
const csv = require('csvtojson');
const fs = require('fs');


// Definir variables globales en index.js
global.PROVEEDOR = 'movistar';
global.OMV = 'virgin mobile';
global.LAC = 1832;
global.REGION = 7;
global.numero = '';

router.get('/', (req, res) => {
    res.render('index.hbs', {
        PROVEEDOR: PROVEEDOR,
        OMV: OMV,
        LAC: LAC
    });
});

const jsonFilePath = './public/csv/datos.json';

// Función para leer el archivo CSV y convertirlo a JSON
function leerArchivoJSON() {
    try {
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (error) {
        console.error('Error al leer el archivo JSON:', error);
        return [];
    }
}

leerArchivoJSON()

router.post('/submit-abonado', async (req, res) => {
    const numeroAbonado = req.body.abonado;
    numero = numeroAbonado;
    try {
        // Leer el archivo CSV y convertirlo a JSON utilizando la función existente
        const abonados = await leerArchivoJSON();

        // Buscar el número de abonado en el JSON obtenido
        const abonadoEncontrado = abonados.find(abonado => abonado.ABONADO === parseInt(numeroAbonado));

        if (abonadoEncontrado) {
            // Si el abonado existe, redirigir a la página 'operador'
            res.redirect(`/operador/${numeroAbonado}`);
        } else {
            // Si el abonado no existe, mostrar un mensaje de error
            res.render('index.hbs', {
                PROVEEDOR: PROVEEDOR,
                OMV: OMV,
                LAC: LAC,
                error: 'El número de abonado ingresado no existe. Por favor, inténtalo de nuevo.'
            });
        }
    } catch (error) {
        console.error('Error al procesar el número de abonado:', error);
        res.render('index.hbs', {
            PROVEEDOR: PROVEEDOR,
            OMV: OMV,
            LAC: LAC,
            error: 'Ocurrió un error al procesar el número de abonado. Por favor, inténtalo de nuevo.'
        });
    }
});

router.get('/operador/:numeroAbonado', async (req, res) => {
    const numeroAbonado = req.params.numeroAbonado;

    var datos = {
        PROVEEDOR: PROVEEDOR,
        OMV: OMV,
        LAC: LAC,
        numeroAbonado: numeroAbonado,
        region: REGION
    };
    res.render('operador', {
        operador1: true,
        PROVEEDOR: PROVEEDOR,
        OMV: OMV,
        LAC: LAC,
        numeroAbonado: numeroAbonado,
        region: REGION
    });

});
module.exports = router;

router.post('/operador', async (req, res) => {
    // Obtener el operador u OMV ingresado por el
    // usuario desde el cuerpo de la solicitud POST
    const omvIngresado = req.body.omv;

    const omvIngresadoLower = omvIngresado.toLowerCase();

    console.log(omvIngresadoLower);
    var datos = {
        PROVEEDOR: PROVEEDOR,
        OMV: OMV,
        LAC: LAC,
        region: REGION
    };

    // Verificar si el operador ingresado es igual al nuestro
    if (omvIngresadoLower === OMV) {
        // Si el OMV es el mismo que el nuestro, pedir la región
        res.render('operador', {
            PROVEEDOR: PROVEEDOR,
            OMV: OMV,
            LAC: LAC,
            numeroAbonado: numero,
            pedirRegion: true,
            operador1: false
        });
        const regionIngresado = req.body.region1;
        if (regionIngresadoLower === REGION) {
            res.render('operador', {
                PROVEEDOR: PROVEEDOR,
                OMV: OMV,
                LAC: LAC,
                numeroAbonado: numero,
                pedirRegion: false,
                operador1: false,
                cobertura
            });

        }
    }


});