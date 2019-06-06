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

//GET Crear andon
controller.crear_andon_GET = (req, res) => {
    res.render('login.ejs');
};

//Login
controller.login = (req, res) => {
    loginId = req.params.id
    if (loginId == 'alta_escalamiento') {
        funcionE.empleadosAccessAll(3, '=', (err, result) => {

            res.render('login.ejs', {
                data: loginId, data2: result
            });
        });
    } else
        if (loginId == 'crear_andon') {
            funcionE.empleadosAccessAll(1, '>=', (err, result) => {

                res.render('login.ejs', {
                    data: loginId, data2: result
                });
            });
        } else
            if (loginId == 'cerrar_andon') {
                funcionE.empleadosAccessAll(2, '>=', (err, result) => {

                    res.render('login.ejs', {
                        data: loginId, data2: result
                    });
                });
            }
};

//POST a crear_andon despues de login primero revisa si el Gafete existe 
controller.crear_andon_POST = (req, res) => {
    numeroEmpleado = req.body.user;

    funcionE.empleadosNombre(numeroEmpleado, (err, result3) => {
        if (err) throw err;
        funcion.controllerDepartamentos((err, result1) => {
            if (err) throw err;
            funcion.controllerProblemas((err, result2) => {
                if (err) throw err;

                res.render('crear_andon.ejs', {
                    data: result1, data2: result2, data3: result3, data4: numeroEmpleado
                });
            });
        });
    });

};


//POST a guardar_andon despues de crear andon2
controller.guardar_andon_POST = (req, res) => {


    empleado = (req.body.empleado)
    gafete = (req.body.gafete)
    departamento = (req.body.departamento)
    problema = (req.body.problema)
    descripcion = (req.body.descripcion)
    clave = Math.floor(Math.random() * 10000);


    funcion.controllerIdProblema(problema, (err, id_prob) => {
        if (err) throw err;

        funcion.controllerIdDepartamento(departamento, (err, id_dep) => {
            if (err) throw err;

            funcion.controllerInsertAndon(id_dep, id_prob, descripcion, gafete, clave, (err, result) => {
                if (err) throw err;

                funcion.controllerMaxIdAndon((err, result2) => {
                    id_andon = result2[0].id;
                    if (err) throw err;

                    res.render('guardar_andon.ejs', {
                        data: { departamento, problema, descripcion, clave, id_andon }
                    });
                });
            });
        });
    });




    //Enviar Correos
    funcion.controllerIdDepartamento(departamento, (err, id_depE) => {
        if (err) throw err;
        funcion.controllerMaxIdAndon((err, result5) => {
            if (err) throw err;
            id = result5[0].id + 1;
            //Enviar Correo Empleados del Creador de andon
            funcionE.empleadosCorreo(gafete, (err, correo) => {

                to = correo;
                cc = '';
                subject = 'Nueva Andon: ' + id;
                status = 'Abierta';
                color = '#b30000';
                id_andon = id;
                creador = empleado;
                gafete = gafete;
                problema = problema;
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
                    to, cc, subject, status, color, id_andon, creador, gafete, problema, descripcion, fecha, eclave, empleadoAtendida,
                    fechaAtendida, accionAtendida, empleadoCerrada, fechaCerrada, accionCerrada
                }

                funcion.sendEmail(dataEmail);
            });

            //Enviar Correo Empleados del Departamento
            funcionE.empleadosAccessAll(2,'=',(err, gafeteAcc) => {

                for (var i = 0; i < gafeteAcc.length; i++) {

                    funcionE.empleadosCorreoDep(gafeteAcc[i].acc_id, id_depE, (err, correo) => {

                        if (correo != '') {


                            to = correo[0].emp_correo;
                            cc = '';
                            subject = 'Nueva Andon: ' + id;
                            status = 'Abierta';
                            color = '#b30000';
                            id_andon = id;
                            creador = empleado;
                            gafete = gafete;
                            problema = problema;
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
                                to, cc, subject, status, color, id_andon, creador, gafete, problema, descripcion, fecha, eclave, empleadoAtendida,
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

//Get tabla andons
controller.andons_GET = (req, res) => {

    funcion.controllerTablaAndon((err, result) => {
        if (err) throw err;
        funcion.controllerCountAndonAll('abiertas', "Abierta", (err, result2) => {
            if (err) throw err;
            funcion.controllerCountAndonAll('atendidas', "Atendida", (err, result3) => {
                if (err) throw err;
                funcion.controllerCountAndonAll('cerradas', "Cerrada", (err, result4) => {
                    if (err) throw err;

                    andonAbiertas = result2[0].abiertas
                    andonAtendidas = result3[0].atendidas
                    andonCerradas = result4[0].cerradas

                    res.render('andons.ejs', {
                        data: result, data2: { andonAbiertas, andonAtendidas, andonCerradas }
                    });
                });
            });
        });
    });
};

//POST  a cerrar_andondespues de login, revisa primero si el Gafete existe
controller.cerrar_andon_POST = (req, res) => {
    numeroEmpleado = req.body.user;

    funcionE.empleadosNombre(numeroEmpleado, (err, nombreEmpleado) => {
        if (err) throw err;

        funcion.controllerAndonAbiertas((err, result4) => {
            if (err) throw err;


            res.render('cerrar_andon.ejs', {
                data: numeroEmpleado, data2: nombreEmpleado, data3: result4
            });
        });
    });

};

//POST  cerrar_andon2 despues de cerrra_andon primero revisa si la andon existe
controller.cerrar_andon2_POST = (req, res) => {

    numeroEmpleado = req.body.numeroEmpleado;
    nombreEmpleado = req.body.nombreEmpleado;
    id_andon = req.body.id_andon;

    funcion.controllerStatusAndon(id_andon, (err, result2) => {
        if (err) throw err;
        status = result2[0].status

        funcion.controllerClaveAndon(id_andon, (err, clave) => {
            if (err) throw err;
            id_clave = clave[0].clave;

            funcion.controllerProblemaAndon(id_andon, (err, result1) => {
                if (err) throw err;
                problema = result1[0].descripcion

                res.render('cerrar_andon2.ejs', {
                    data: { numeroEmpleado, nombreEmpleado, id_andon, problema, id_clave, status }
                });
            });
        });
    });

};

//POST a cambio_andon
controller.cambio_andon_POST = (req, res) => {

    accionTomada = req.params.id;
    nombreEmpleado = req.body.nombreEmpleado;
    numeroEmpleado = req.body.numeroEmpleado;
    id_andon = req.body.id_andon;
    current_date = req.body.current_date; //Fecha sin formato
    formatted_current_date = req.body.formatted_current_date; //Fecha con formato YYYY-MM-DD hh:mm:ss
    clave_cierre = req.body.clave_cierre;
    problema = req.body.problema;
    actividades = req.body.actividades;


    db.query(`SELECT * FROM andon WHERE id_andon = ${id_andon}`, function (err, result, fields) {

        andonFecha = result[0].fecha_inicio;
        var startDate = new Date(andonFecha);//Fecha en que se creo la andon de trabajo
        var endDate = new Date(current_date);//Fecha en la que se esta tendiendo la andon de trabajo, viene de cerrar_andon2(current_date)
        var seconds = (endDate.getTime() - startDate.getTime()) / 1000;
        minutos = (seconds / 60);
        var usuarioAtendida = result[0].usuario_atendida;
        var accionAtendidaC = result[0].acciones_atendida;

        //Info correo
        reporto = result[0].reporto;
        descripcion = result[0].descripcion_problema;
        fechaAtendida = result[0].fecha_hora_atendida;
        accionesAtendida = result[0].acciones_atendida;

        funcionE.empleadosNombre(reporto, (err, nombrereporto) => {


            //Si es de tipo correctivo actualiza segundos //////////////////////////////////////////////////////////

            if (accionTomada == "Atendida") {

                clave_cierre = '';
                funcion.controllerUpdateAndonA(accionTomada, actividades, formatted_current_date, nombreEmpleado, id_andon, (err, result) => {
                    if (err) throw err;

                    res.render('cambio_andon.ejs', {
                        data: { accionTomada, nombreEmpleado, numeroEmpleado, id_andon, formatted_current_date, clave_cierre, problema, actividades }
                    });
                });

                gafeteEnviar = reporto;
                for (var i = 0; i < 2; i++) {
                    funcionE.empleadosCorreo(gafeteEnviar, (err, correo) => {

                        to = correo;
                        cc = '';
                        subject = ' Andon: ' + id_andon + ' -Atendida-';
                        status = 'Atendida';
                        color = '#3498db';
                        id_andon = id_andon;
                        creador = nombrereporto;
                        gafete = reporto;
                        problema = problema;
                        descripcion = descripcion;
                        fecha = andonFecha;
                        eclave = clave_cierre;
                        empleadoAtendida = nombreEmpleado;
                        fechaAtendida = formatted_current_date;
                        accionAtendida = actividades;
                        empleadoCerrada = '';
                        fechaCerrada = '';
                        accionCerrada = '';

                        dataEmail = {
                            to, cc, subject, status, color, id_andon, creador, gafete, problema, descripcion, fecha, eclave, empleadoAtendida,
                            fechaAtendida, accionAtendida, empleadoCerrada, fechaCerrada, accionCerrada
                        }

                        funcion.sendEmail(dataEmail);
                    })

                    gafeteEnviar = numeroEmpleado;
                }


            } else {
                funcion.controllerUpdateAndonC(accionTomada, actividades, formatted_current_date, minutos, nombreEmpleado, id_andon, (err, result) => {

                    res.render('cambio_andon.ejs', {
                        data: { accionTomada, nombreEmpleado, numeroEmpleado, id_andon, formatted_current_date, clave_cierre, problema, actividades }
                    });
                });

                gafeteEnviar = reporto;
                for (var i = 0; i < 2; i++) {
                    funcionE.empleadosCorreo(gafeteEnviar, (err, correo) => {

                        to = correo;
                        cc = '';
                        subject = 'Andon ' + id_andon + ' -Cerrada-';
                        status = 'Cerrada';
                        color = '#0e943b';
                        id_andon = id_andon;
                        creador = nombrereporto;
                        gafete = reporto;
                        problema = problema;
                        descripcion = descripcion;
                        fecha = andonFecha;
                        eclave = clave_cierre;
                        empleadoAtendida = usuarioAtendida;
                        fechaAtendida = fechaAtendida;
                        accionAtendida = accionAtendidaC;
                        empleadoCerrada = nombreEmpleado;
                        fechaCerrada = formatted_current_date;
                        accionCerrada = actividades;

                        dataEmail = {
                            to, cc, subject, status, color, id_andon, creador, gafete, problema, descripcion, fecha, eclave, empleadoAtendida,
                            fechaAtendida, accionAtendida, empleadoCerrada, fechaCerrada, accionCerrada
                        }

                        funcion.sendEmail(dataEmail);
                    })

                    gafeteEnviar = numeroEmpleado;
                }

            }
        });

    })
};

//POST a historial apra generar tabla, primero revisa si el gafete existe
controller.historial_POST = (req, res) => {
    numeroEmpleado = req.body.user;

    funcion.controllerHisotrialAndon(numeroEmpleado, (err, result) => {
        if (err) throw err;

        funcion.controllerHistorialAndonStatus('abiertas', "Abierta", numeroEmpleado, (err, result2) => {
            if (err) throw err;

            funcion.controllerHistorialAndonStatus('atendidas', "Atendida", numeroEmpleado, (err, result3) => {
                if (err) throw err;

                funcion.controllerHistorialAndonStatus('cerradas', "Cerrada", numeroEmpleado, (err, result4) => {
                    if (err) throw err;

                    andonAbiertas = result2[0].abiertas
                    andonAtendidas = result3[0].atendidas
                    andonCerradas = result4[0].cerradas


                    res.render('historial.ejs', {
                        data: result, data2: { andonAbiertas, andonAtendidas, andonCerradas }, data3: numeroEmpleado
                    });
                });
            });
        });
    });

};

//POST A revisar andon
controller.revisar_POST = (req, res) => {
    id_andon = req.params.id


    funcion.controllerRevisarAndon(id_andon, (err, result) => {
        if (err) throw err;

        numeroEmpleado = result[0].reporto;
        problema = result[0].descripcion;
        descripcionProblema = result[0].descripcion_problema;
        creacionFecha = result[0].fecha_inicio; //Fecha sin formato
        departamento = result[0].nombre;
        nombrEncargado = result[0].usuario_atendida;
        nombreCierre = result[0].usuario_cierre;
        atendidaFecha = result[0].fecha_hora_atendida;
        cierreFecha = result[0].fecha_hora_cierre;
        accionAtendida = result[0].acciones_atendida;
        accionCierre = result[0].acciones_cierre;
        clave_cierre = result[0].clave;
        andonStatus = result[0].status

        funcionE.empleadosNombre(numeroEmpleado, (err, nombreEmpleado) => {
            if (err) throw err;

            res.render('revisar.ejs', {
                data: { id_andon, descripcionProblema, accionAtendida, accionCierre, nombreEmpleado, departamento, numeroEmpleado, creacionFecha, cierreFecha, clave_cierre, problema, nombrEncargado, nombreCierre, atendidaFecha, andonStatus }
            });
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

                        andonAbiertas = result2[0].abiertas
                        andonAtendidas = result3[0].atendidas
                        andonCerradas = result4[0].cerradas
                        andonDepartamento = result5[0].nombre
                        andonSeleccion = result6

                        res.render('dashboard_view.ejs', {
                            data: { andonAbiertas, andonAtendidas, andonCerradas, andonDepartamento, andonSeleccion, selectedMonth, selectedYear }
                        });
                    });
                });
            });
        });
    });
};


//Alta_escalAmiento
controller.alta_escalamiento_POST = (req, res) => {
    numeroEmpleado = req.body.user;

    funcionE.empleadosTodos((err, result) => {
        if (err) throw err;

        funcion.controllerEscalamientoAll((err, result2) => {
            if (err) throw err;

            res.render('alta_escalamiento.ejs', {
                data: result, data2: result2
            });
        });
    });

};

//Alta_escalamiento
controller.alta_escalamiento2_POST = (req, res) => {
    if (req.body.correo == '') {
        correo = req.body.correo2;
    } else {
        correo = req.body.correo;
    }


    funcion.controllerEscalamiento(correo, (err, result) => {
        if (err) throw err;

        res.render('alta_escalamiento2.ejs', {
            data: correo, data2: result
        });
    });

};

controller.guardar_escalamiento_POST = (req, res) => {

    correo = req.body.correo
    dep1 = req.body.dep1
    if (dep1 == undefined) {
        dep1 = 0
    }
    dep2 = req.body.dep2
    if (dep2 == undefined) {
        dep2 = 0
    }
    dep3 = req.body.dep3
    if (dep3 == undefined) {
        dep3 = 0
    }
    dep4 = req.body.dep4
    if (dep4 == undefined) {
        dep4 = 0
    }
    dep5 = req.body.dep5
    if (dep5 == undefined) {
        dep5 = 0
    }
    esc1 = req.body.esc1
    if (esc1 == undefined) {
        esc1 = 0
    }
    esc2 = req.body.esc2
    if (esc2 == undefined) {
        esc2 = 0
    }
    esc3 = req.body.esc3
    if (esc3 == undefined) {
        esc3 = 0
    }
    esc4 = req.body.esc4
    if (esc4 == undefined) {
        esc4 = 0
    }
    esc5 = req.body.esc5
    if (esc5 == undefined) {
        esc5 = 0
    }


    funcion.controllerInsertEscalamiento(dep1, dep2, dep3, dep4, dep5, esc1, esc2, esc3, esc4, esc5, correo, (err, result) => {

        res.redirect('/login/alta_escalamiento')
    });




};




module.exports = controller;