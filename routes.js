const express = require('express');
const router = express.Router();
const routesController = require('./routesController')

//Routes

router.get('/', routesController.index_GET);
router.get('/login/:id', routesController.login);
router.get('/crear_orden/login', routesController.crear_orden_GET);
router.post('/crear_orden', routesController.crear_orden_POST);
router.post('/crear_orden2', routesController.crear_orden2_POST);
router.post('/guardar_orden', routesController.guardar_orden_POST);
router.get('/ordenes', routesController.ordenes_GET);
router.post('/cerrar_orden', routesController.cerrar_orden_POST);
router.post('/cerrar_orden2', routesController.cerrar_orden2_POST);
router.post('/cambio_orden/:id', routesController.cambio_orden_POST);
router.post('/historial', routesController.historial_POST);
router.post('/revisar/:id', routesController.revisar_POST);
router.get('/dashboard', routesController.dashboard_GET);
router.post('/dashboard_view', routesController.dashboard_POST);

router.get('*', (req, res) => {
  res.send('404 Page not found');
});
module.exports = router;