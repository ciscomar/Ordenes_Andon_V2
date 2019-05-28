//Conexion a base de datos
const db = require('./public/db/conn');
const controller = {};

//Require Funciones
const funcion = require('./public/js/controllerFunctions');
const funcionE = require('./public/js/empleadosFunctions');

// Index GET
controller.index_GET = (req, res) => {
    res.render('index.ejs');

};

//GET Crear orden
controller.crear_orden_GET = (req, res) => {
    res.render('login.ejs');
};

//Login
controller.login = (req, res) => {
    loginId = req.params.id
    res.render('login.ejs', {
        data: loginId
    });
};

//POST a crear_orden despues de login primero revisa si el Gafete existe 
controller.crear_orden_POST = (req, res) => {
    numeroEmpleado = req.body.user;
    funcionE.empleadosRevisarAccess1(numeroEmpleado, (err, count) => {

        if (err) {
            res.redirect('/login/crear_orden')
        } else {

            if (count == 0) {
                res.redirect('/login/crear_orden')
            }
            else {
                funcionE.empleadosNombre(numeroEmpleado, (err, result3) => {
                    if (err) throw err;
                    funcion.controllerDepartamentos((err, result1) => {
                        if (err) throw err;
                        funcion.controllerMaquinas((err, result2) => {
                            if (err) throw err;

                            res.render('crear_orden.ejs', {
                                data: result1, data2: result2, data3: result3, data4: numeroEmpleado
                            });
                        });
                    });
                });
            }
        }
    });
};

//POST a crear_orden2 despues de crear_orden
controller.crear_orden2_POST = (req, res) => {
    departamento = (req.body.departamento);
    maquina = (req.body.maquina)
    nombreEmpleado = (req.body.empleado)
    numeroEmpleado = (req.body.gafete);

    funcion.controllerFamilia(maquina, (err, familia) => {
        if (err) throw err;

        funcion.controllerComponentes(familia, (err, result3) => {
            if (err) throw err;

            res.render('crear_orden2.ejs', {
                data: departamento, data2: maquina, data3: result3, data4: nombreEmpleado, data5: numeroEmpleado
            });
        });
    });

};

//POST a guardar_orden despues de crear orden2
controller.guardar_orden_POST = (req, res) => {


    empleado = (req.body.empleado)
    gafete = (req.body.gafete)
    departamento = (req.body.departamento)
    parteAfectada = (req.body.componente)
    maquina = (req.body.maquina)
    turno = (req.body.turno)
    grupo = (req.body.grupo)
    descripcion = (req.body.descripcion)
    archivo = (req.body.archivo)
    clave = Math.floor(Math.random() * 10000);
    tipoOrden = (req.body.tmuerto)

    funcion.controllerIdMaquina(maquina, (err, id_maquina) => {
        if (err) throw err;

        funcion.controllerFamilia(maquina, (err, familia) => {
            if (err) throw err;

            funcion.controllerIdComponente(parteAfectada, familia, (err, componente) => {
                if (err) throw err;

                funcion.controllerIdDepartamento(departamento, (err, id_dep) => {
                    if (err) throw err;

                    funcion.controllerInsertOrden(id_dep, id_maquina, componente, descripcion, gafete, empleado, turno, grupo, clave, tipoOrden, (err, result) => {
                        if (err) throw err;

                        funcion.controllerMaxIdOrden((err, result2) => {
                            id_orden = result2[0].id;
                            if (err) throw err;

                            res.render('guardar_orden.ejs', {
                                data: { departamento, maquina, turno, grupo, descripcion, clave, id_orden }
                            });
                        });
                    });
                });
            });
        })
    });

    //Enviar Correos
    funcion.controllerIdDepartamento(departamento, (err, id_depE) => {
        if (err) throw err;
        funcion.controllerMaxIdOrden((err, result5) => {
            if (err) throw err;
            id = result5[0].id + 1;
            //Enviar Correo Empleados del Creador de Orden
            funcionE.empleadosCorreo(gafete, (err, correo) => {

                to = correo;
                cc = '';
                subject = 'Nueva Orden Utra: ' + id;
                status = 'Abierta';
                color = '#b30000';
                id_orden = id;
                creador = empleado;
                gafete = gafete;
                maquina = maquina;
                descripcion = descripcion;
                fecha = new Date();
                eclave = clave;
                empleadoAtendida = '';
                fechaAtendida = '';
                accionAtendida = '';
                empleadoCerrada = '';
                fechaCerrada = '';
                accionCerrada = '';

                dataEmail = {
                    to, cc, subject, status, color, id_orden, creador, gafete, maquina, descripcion, fecha, eclave, empleadoAtendida,
                    fechaAtendida, accionAtendida, empleadoCerrada, fechaCerrada, accionCerrada
                }

                funcion.sendEmail(dataEmail);
            });

            //Enviar Correo Empleados del Departamento
            funcionE.empleadosAccess2((err, gafeteAcc) => {

                for (var i = 0; i < gafeteAcc.length; i++) {

                    funcionE.empleadosCorreoDep(gafeteAcc[i].acc_id, id_depE, (err, correo) => {

                        if (correo != '') {
                            console.log(correo[0].emp_correo)


                            to = correo[0].emp_correo;
                            cc = '';
                            subject = 'Nueva Orden Utra: ' + id;
                            status = 'Abierta';
                            color = '#b30000';
                            id_orden = id;
                            creador = empleado;
                            gafete = gafete;
                            maquina = maquina;
                            descripcion = descripcion;
                            fecha = new Date();
                            eclave = '';
                            empleadoAtendida = '';
                            fechaAtendida = '';
                            accionAtendida = '';
                            empleadoCerrada = '';
                            fechaCerrada = '';
                            accionCerrada = '';

                            dataEmail = {
                                to, cc, subject, status, color, id_orden, creador, gafete, maquina, descripcion, fecha, eclave, empleadoAtendida,
                                fechaAtendida, accionAtendida, empleadoCerrada, fechaCerrada, accionCerrada
                            }

                            funcion.sendEmail(dataEmail);

                        }
                    });
                }
            });
        });
    });
};

//Get tabla ordenes
controller.ordenes_GET = (req, res) => {

    funcion.controllerTablaOrdenes((err, result) => {
        if (err) throw err;

        funcion.controllerCountOrdenesAll('abiertas', "Abierta", (err, result2) => {
            if (err) throw err;
            funcion.controllerCountOrdenesAll('atendidas', "Atendida", (err, result3) => {
                if (err) throw err;
                funcion.controllerCountOrdenesAll('cerradas', "Cerrada", (err, result4) => {
                    if (err) throw err;

                    ordenesAbiertas = result2[0].abiertas
                    ordenesAtendidas = result3[0].atendidas
                    ordenesCerradas = result4[0].cerradas

                    res.render('ordenes.ejs', {
                        data: result, data2: { ordenesAbiertas, ordenesAtendidas, ordenesCerradas }
                    });
                });
            });
        });
    });
};

//POST  a cerrar_orden despues de login, revisa primero si el Gafete existe
controller.cerrar_orden_POST = (req, res) => {
    numeroEmpleado = req.body.user;
    const acc_ultra=2;
    funcionE.empleadosRevisarAccess2(numeroEmpleado,acc_ultra, (err, count) => {
        if (err) {
            res.redirect('/login/cerrar_orden')
        } else {

            if (count == 0) {
                res.redirect('/login/cerrar_orden')
            } else {

                funcionE.empleadosNombre(numeroEmpleado, (err, nombreEmpleado) => {
                    if (err) throw err;

                    funcion.controllerOrdenesAbiertas((err, result4) => {
                        if (err) throw err;


                        res.render('cerrar_orden.ejs', {
                            data: numeroEmpleado, data2: nombreEmpleado, data3: result4
                        });
                    });
                });
            }
        }
    });
};

//POST  cerrar_orden2 despues de cerrra_orden primero revisa si la orden existe
controller.cerrar_orden2_POST = (req, res) => {

    numeroEmpleado = req.body.numeroEmpleado;
    nombreEmpleado = req.body.nombreEmpleado;
    id_orden = req.body.id_orden;

    funcion.controllerCountOrdenes(id_orden, (err, count) => {
        if (err) {
            res.redirect('/')
        } else {

            if (count == 0) {
                res.redirect('/')
            }
            else {

                funcion.controllerStatusOrden(id_orden, (err, result2) => {
                    if (err) throw err;
                    status = result2[0].status

                    funcion.controllerClaveOrden(id_orden, (err, clave) => {
                        if (err) throw err;
                        id_clave = clave[0].clave;

                        funcion.controllerParteAfectadaOrden(id_orden, (err, result1) => {
                            if (err) throw err;
                            parteAfectada = result1[0].componente

                            res.render('cerrar_orden2.ejs', {
                                data: { numeroEmpleado, nombreEmpleado, id_orden, parteAfectada, id_clave, status }
                            });
                        });
                    });
                });
            }
        }
    });
};

//POST a cambio_orden 
controller.cambio_orden_POST = (req, res) => {

    accionTomada = req.params.id;
    nombreEmpleado = req.body.nombreEmpleado;
    numeroEmpleado = req.body.numeroEmpleado;
    id_orden = req.body.id_orden;
    current_date = req.body.current_date; //Fecha sin formato
    formatted_current_date = req.body.formatted_current_date; //Fecha con formato YYYY-MM-DD hh:mm:ss
    clave_cierre = req.body.clave_cierre;
    parteAfectada = req.body.parteAfectada;
    actividades = req.body.actividades;


    db.query(`SELECT * FROM ordenes WHERE id_orden = ${id_orden}`, function (err, result, fields) {

        ordenFecha = result[0].fecha_hora;
        var startDate = new Date(ordenFecha);//Fecha en que se creo la orden de trabajo
        var endDate = new Date(current_date);//Fecha en la que se esta tendiendo la orden de trabajo, viene de cerrar_orden2(current_date)
        var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        var usuarioAtendida = result[0].usuario_atendida;
        var accionAtendidaC = result[0].acciones_atendida;
        var tipoOrden = result[0].tipo_orden

        //Info correo
        reporto = result[0].reporto;
        maquina = result[0].maquina;
        descripcion = result[0].descripcion_problema;
        fechaAtendida = result[0].fecha_hora_atendida;
        accionesAtendida = result[0].acciones_atendida;

        funcionE.empleadosNombre(reporto, (err, nombrereporto) => {

            funcion.controllerNombreMaquina(maquina, (err, nombremaquina) => {

                //Si es de tipo correctivo actualiza segundos //////////////////////////////////////////////////////////
                if (tipoOrden == "Otra") {
                    seconds = 0
                } else {
                    seconds = seconds
                }

                if (accionTomada == "Atendida") {

                    clave_cierre = '';
                    funcion.controllerUpdateOrdenA(accionTomada, actividades, formatted_current_date, seconds, nombreEmpleado, id_orden, (err, result) => {
                        if (err) throw err;

                        res.render('cambio_orden.ejs', {
                            data: { accionTomada, nombreEmpleado, numeroEmpleado, id_orden, formatted_current_date, clave_cierre, parteAfectada, actividades }
                        });
                    });

                    gafeteEnviar = reporto;
                    for (var i = 0; i < 2; i++) {
                        funcionE.empleadosCorreo(gafeteEnviar, (err, correo) => {

                            to = correo;
                            cc = '';
                            subject = 'Orden Utra: ' + id_orden + ' -Atendida-';
                            status = 'Atendida';
                            color = '#3498db';
                            id_orden = id_orden;
                            creador = nombrereporto;
                            gafete = reporto;
                            maquina = nombremaquina;
                            descripcion = descripcion;
                            fecha = ordenFecha;
                            eclave = clave_cierre;
                            empleadoAtendida = nombreEmpleado;
                            fechaAtendida = formatted_current_date;
                            accionAtendida = actividades;
                            empleadoCerrada = '';
                            fechaCerrada = '';
                            accionCerrada = '';

                            dataEmail = {
                                to, cc, subject, status, color, id_orden, creador, gafete, maquina, descripcion, fecha, eclave, empleadoAtendida,
                                fechaAtendida, accionAtendida, empleadoCerrada, fechaCerrada, accionCerrada
                            }

                            funcion.sendEmail(dataEmail);
                        })

                        gafeteEnviar = numeroEmpleado;
                    }


                } else {
                    funcion.controllerUpdateOrdenC(accionTomada, actividades, formatted_current_date, seconds, nombreEmpleado, id_orden, (err, result) => {
                        res.render('cambio_orden.ejs', {
                            data: { accionTomada, nombreEmpleado, numeroEmpleado, id_orden, formatted_current_date, clave_cierre, parteAfectada, actividades }
                        });
                    });

                    gafeteEnviar = reporto;
                    for (var i = 0; i < 2; i++) {
                        funcionE.empleadosCorreo(gafeteEnviar, (err, correo) => {

                            to = correo;
                            cc = '';
                            subject = 'Orden Utra: ' + id_orden + ' -Cerrada-';
                            status = 'Cerrada';
                            color = '#0e943b';
                            id_orden = id_orden;
                            creador = nombrereporto;
                            gafete = reporto;
                            maquina = nombremaquina;
                            descripcion = descripcion;
                            fecha = ordenFecha;
                            eclave = clave_cierre;
                            empleadoAtendida = usuarioAtendida;
                            fechaAtendida = fechaAtendida;
                            accionAtendida = accionAtendidaC;
                            empleadoCerrada = nombreEmpleado;
                            fechaCerrada = formatted_current_date;
                            accionCerrada = actividades;

                            dataEmail = {
                                to, cc, subject, status, color, id_orden, creador, gafete, maquina, descripcion, fecha, eclave, empleadoAtendida,
                                fechaAtendida, accionAtendida, empleadoCerrada, fechaCerrada, accionCerrada
                            }

                            funcion.sendEmail(dataEmail);
                        })

                        gafeteEnviar = numeroEmpleado;
                    }

                }
            });

        });
    })
};

//POST a historial apra generar tabla, primero revisa si el gafete existe
controller.historial_POST = (req, res) => {
    numeroEmpleado = req.body.user;

    funcion.controllerHisotrialOrdenes(numeroEmpleado, (err, result) => {
        if (err) throw err;

        funcion.controllerHistorialOrdenesStatus('abiertas', "Abierta", numeroEmpleado, (err, result2) => {
            if (err) throw err;

            funcion.controllerHistorialOrdenesStatus('atendidas', "Atendida", numeroEmpleado, (err, result3) => {
                if (err) throw err;

                funcion.controllerHistorialOrdenesStatus('cerradas', "Cerrada", numeroEmpleado, (err, result4) => {
                    if (err) throw err;

                    ordenesAbiertas = result2[0].abiertas
                    ordenesAtendidas = result3[0].atendidas
                    ordenesCerradas = result4[0].cerradas


                    res.render('historial.ejs', {
                        data: result, data2: { ordenesAbiertas, ordenesAtendidas, ordenesCerradas }, data3: numeroEmpleado
                    });
                });
            });
        });
    });

};

//POST A revisar orden
controller.revisar_POST = (req, res) => {
    id_orden = req.params.id

    funcion.controllerRevisarOrden(id_orden, (err, result) => {
        if (err) throw err;

        nombreEmpleado = result[0].usuario_dominio;
        numeroEmpleado = result[0].reporto;
        parteAfectada = result[0].componente;
        descripcionProblema = result[0].descripcion_problema;
        creacionFecha = result[0].fecha_hora; //Fecha sin formato
        departamento = result[0].nombre;
        nombrEncargado = result[0].usuario_atendida;
        nombreCierre = result[0].usuario_cierre;
        atendidaFecha = result[0].fecha_hora_atendida;
        cierreFecha = result[0].fecha_hora_cierre;
        accionAtendida = result[0].acciones_atendida;
        accionCierre = result[0].acciones_cierre;
        clave_cierre = result[0].clave;
        ordenStatus = result[0].status

        res.render('revisar.ejs', {
            data: { id_orden, descripcionProblema, accionAtendida, accionCierre, nombreEmpleado, departamento, numeroEmpleado, creacionFecha, cierreFecha, clave_cierre, parteAfectada, nombrEncargado, nombreCierre, atendidaFecha, ordenStatus }
        });
    });
};

// Dashboard GET
controller.dashboard_GET = (req, res) => {
    res.render('dashboard.ejs')
}


controller.dashboard_POST = (req, res) => {


    selectedMonth = req.body.month_selected
    selectedYear = req.body.year_selected
    selectedDepartment = req.body.department_selected


    funcion.controllerDashCount('abiertas', selectedMonth, selectedYear, selectedDepartment, "Abierta", (err, result2) => {
        if (err) throw err;

        funcion.controllerDashCount('atendidas', selectedMonth, selectedYear, selectedDepartment, "Atendida", (err, result3) => {
            if (err) throw err;

            funcion.controllerDashCount('cerradas', selectedMonth, selectedYear, selectedDepartment, "Cerrada", (err, result4) => {
                if (err) throw err;

                funcion.controllerNombreDepartamento(selectedDepartment, (err, result5) => {
                    if (err) throw err;

                    funcion.controllerDashSeleccion(selectedMonth, selectedYear, selectedDepartment, (err, result6) => {
                        if (err) throw err;

                        ordenesAbiertas = result2[0].abiertas
                        ordenesAtendidas = result3[0].atendidas
                        ordenesCerradas = result4[0].cerradas
                        ordenesDepartamento = result5[0].nombre
                        ordenesSeleccion = result6

                        res.render('dashboard_view.ejs', {
                            data: { ordenesAbiertas, ordenesAtendidas, ordenesCerradas, ordenesDepartamento, ordenesSeleccion, selectedMonth, selectedYear }
                        });
                    });
                });
            });
        });
    });
};




module.exports = controller;