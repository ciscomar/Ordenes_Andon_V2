const express = require('express');
const router = express.Router();
const routesController = require('./routesController')

//Routes

router.get('/', routesController.index_GET);
router.get('/login/:id', routesController.login);
router.get('/crear_andon/login', routesController.crear_andon_GET);
router.post('/crear_andon', routesController.crear_andon_POST);
router.post('/guardar_andon', routesController.guardar_andon_POST);
router.get('/andons', routesController.andons_GET);
router.post('/cerrar_andon', routesController.cerrar_andon_POST);
router.post('/cerrar_andon2', routesController.cerrar_andon2_POST);
router.post('/cambio_andon/:id', routesController.cambio_andon_POST);
router.post('/historial', routesController.historial_POST);
router.post('/revisar/:id', routesController.revisar_POST);
router.get('/dashboard', routesController.dashboard_GET);
router.post('/dashboard_view', routesController.dashboard_POST);
router.post('/alta_escalamiento', routesController.alta_escalamiento_POST);
router.post('/alta_escalamiento2', routesController.alta_escalamiento2_POST);
router.post('/guardar_escalamiento', routesController.guardar_escalamiento_POST);

router.get('*', (req, res) => {
  res.send('404 Page not found');
});
module.exports = router;