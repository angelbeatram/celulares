var express = require('express');
var router = express.Router();
var csv=require('csvtojson');
/* GET home page. */

// Ruta GET para la página inicial
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Bienvenido', message: 'Digite su IMEI' });
});


// Ruta POST para procesar el formulario
router.post('/submit', function(req, res, next) {
  // Obtener el IMEI enviado desde el formulario
  const imei = req.body.imei;

  // Leer el archivo CSV y buscar el IMEI
  csv()
      .fromFile('ruta/al/archivo.csv') // Reemplaza 'ruta/al/archivo.csv' con la ruta real de tu archivo CSV
      .then((jsonObj) => {
        // Buscar la fila correspondiente al IMEI
        const rowData = jsonObj.find(row => row.IMEI === imei);

        if (rowData) {
          // Si se encuentra la fila, extraer los datos relevantes
          const marca = rowData.Marca;
          const modelo = rowData.Modelo;
          const estado = rowData.Estado;

          // Renderizar la vista con los datos obtenidos
          res.render('index', {
            title: 'Bienvenido',
            message: 'Digite su IMEI',
            marca: marca,
            modelo: modelo,
            estado: estado
          });
        } else {
          // Si no se encuentra el IMEI en el CSV, mostrar un mensaje de error
          res.render('index', {
            title: 'Error',
            message: 'IMEI no encontrado en el archivo CSV'
          });
        }
      })
      .catch(err => {
        // Manejar cualquier error que pueda ocurrir durante la lectura del CSV
        console.error('Error al leer el archivo CSV:', err);
        res.render('index', {
          title: 'Error',
          message: 'Error al leer el archivo CSV'
        });
      });
});


module.exports = router;
