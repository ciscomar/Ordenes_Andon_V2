const funcion = {};
const express = require('express');
const app = express();
mail_config = require('../email/conn.js');
var mailer = require('express-mailer');
mailer.extend(app, mail_config);
var schedule = require('node-schedule');

const db = require('../db/conn');
const dbE = require('../db/connEmpleados');

funcion.sendEmail = (dataEmail) => {

    //Enviar Correos
    app.mailer.send('email.ejs', {

        //Info General
        to: dataEmail.to,
        cc: dataEmail.cc,
        subject: dataEmail.subject,
        status: dataEmail.status,
        color: dataEmail.color,
        id_andon: dataEmail.id_andon,
        creador: dataEmail.creador,
        gafete: dataEmail.gafete,
        problema: dataEmail.problema,
        descripcion: dataEmail.descripcion,
        fecha: dataEmail.fecha,
        eclave: dataEmail.eclave,

        //Info Atendida
        empleadoAtendida: dataEmail.empleadoAtendida,
        fechaAtendida: dataEmail.fechaAtendida,
        accionAtendida: dataEmail.accionAtendida,

        //Info cerrada
        empleadoCerrada: dataEmail.empleadoCerrada,
        fechaCerrada: dataEmail.fechaCerrada,
        accionCerrada: dataEmail.accionCerrada,

    }, function (err) {
        if (err) {
            console.log(err)
            return;
        }
        console.log('mail sent')
    });

};

funcion.controllerDepartamentos = (callback) => {
    db.query(`SELECT * FROM departamento`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {
            callback(null, result);
        }
    })

}

funcion.controllerNombreDepartamento = (selectedDepartment, callback) => {
    db.query(`SELECT nombre FROM departamento WHERE id_departamento = ${selectedDepartment} `, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerProblemas = (callback) => {
    db.query(`SELECT descripcion FROM andon_fallas`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerIdProblema = (problema, callback) => {
    db.query(`SELECT id FROM andon_fallas WHERE descripcion ='${problema}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result[0].id);
        }
    })

}



funcion.controllerIdDepartamento = (departamento, callback) => {
    db.query(`SELECT id_departamento FROM departamento WHERE nombre='${departamento}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result[0].id_departamento);
        }
    })

}

funcion.controllerAndonAbiertas = (callback) => {
    db.query(`SELECT id_andon FROM andon WHERE status != 'Cerrada'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerCountAndon = (id_andon, callback) => {
    db.query(`SELECT COUNT( * ) AS count FROM andon WHERE id_andon=${id_andon}`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result[0].count);
        }
    })

}

funcion.controllerStatusAndon = (id_andon, callback) => {
    db.query(`SELECT status FROM andon WHERE id_andon=${id_andon}`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerClaveAndon = (id_andon, callback) => {
    db.query(`SELECT clave FROM andon WHERE id_andon=${id_andon}`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerProblemaAndon = (id_andon, callback) => {
    db.query(`SELECT * FROM andon,andon_fallas 
    WHERE andon.id_andon = ${id_andon}
    AND andon.problemas_comunes = andon_fallas.id`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerMaxIdAndon = (callback) => {
    db.query(`SELECT MAX(id_andon) AS id FROM andon`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerInsertAndon = (id_dep, id_prob, descripcion, gafete, clave, callback) => {
    db.query(`
    INSERT INTO andon (departamento, problemas_comunes, fecha_inicio, tiempo_muerto, 
    descripcion_problema, reporto, clave, status,escalamiento)
    VALUES( '${id_dep}', '${id_prob}', NOW() ,'${0}', '${descripcion}','${gafete}', '${clave}', 'Abierta',0)`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerUpdateAndonA = (accionTomada, actividades, formatted_current_date, nombreEmpleado, id_andon, callback) => {
    db.query(`UPDATE andon SET 
    status= "${accionTomada}",
    acciones_atendida= "${actividades}" ,
    fecha_hora_atendida= "${formatted_current_date}" ,
    usuario_atendida= "${nombreEmpleado}" 
    WHERE id_andon = ${id_andon}`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerUpdateAndonC = (accionTomada, actividades, formatted_current_date, minutos, nombreEmpleado, id_andon, callback) => {
    db.query(`UPDATE andon SET 
    status= "${accionTomada}",
    fecha_hora_cierre= "${formatted_current_date}",
    usuario_cierre= "${nombreEmpleado}",
    acciones_cierre= "${actividades}",
    tiempo_muerto= "${minutos}"
    WHERE id_andon = ${id_andon}`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerTablaAndon = (callback) => {
    db.query(`SELECT * FROM andon, departamento, andon_fallas 
    WHERE (andon.departamento = departamento.id_departamento) 
    AND(andon.problemas_comunes= andon_fallas.id) ORDER BY status ASC`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerRevisarAndon = (id_andon, callback) => {
    db.query(`SELECT * FROM andon, departamento, andon_fallas 
    WHERE (andon.departamento = departamento.id_departamento) 
    AND(andon.problemas_comunes= andon_fallas.id) AND andon.id_andon = "${id_andon}"`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerCountAndonAll = (as, status, callback) => {
    db.query(`SELECT COUNT(*) AS ${as} FROM andon WHERE status="${status}"`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerHisotrialAndon = (numeroEmpleado, callback) => {
    db.query(`SELECT * FROM andon, departamento, andon_fallas
    WHERE (andon.departamento = departamento.id_departamento) 
    AND(andon.problemas_comunes = andon_fallas.id) AND (andon.reporto ="${numeroEmpleado}") ORDER BY id_andon DESC `, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerHistorialAndonStatus = (as, status, numeroEmpleado, callback) => {
    db.query(`SELECT COUNT(*) AS ${as} FROM andon WHERE status ="${status}" AND reporto ="${numeroEmpleado}"`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerDashCount = (as, selectedMonth, selectedYear, selectedDepartment, status, callback) => {
    db.query(`SELECT COUNT(*) AS ${as} FROM andon  WHERE MONTH(fecha_inicio) = ${selectedMonth} AND  YEAR(fecha_inicio) = ${selectedYear} AND departamento = ${selectedDepartment} AND status ="${status}" `, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerDashSeleccion = (selectedMonth, selectedYear, selectedDepartment, callback) => {
    db.query(`
    SELECT COUNT(id_andon) AS problemas_comunes_count, andon_fallas.descripcion as andon_fallas, departamento.nombre as departamento , andon.tiempo_muerto
    FROM otplus.andon, otplus.andon_fallas, otplus.departamento 
    WHERE andon.problemas_comunes = andon_fallas.id 
    AND andon.departamento = departamento.id_departamento 
    AND MONTH(andon.fecha_inicio) = ${selectedMonth}  
    AND YEAR(andon.fecha_inicio) = ${selectedYear} 
    AND departamento.id_departamento = "${selectedDepartment}"
    GROUP by andon.problemas_comunes
    `, function (err, result, fields) {

            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerEscalamiento = (correo, callback) => {
    db.query(`SELECT * FROM andon_escalamiento WHERE correo='${correo}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result[0]);
        }
    })
}

funcion.controllerEscalamientoAll = (callback) => {
    db.query(`SELECT * FROM andon_escalamiento ORDER BY correo`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })
}

funcion.controllerInsertEscalamiento = (dep1, dep2, dep3, dep4, dep5, esc1, esc2, esc3, esc4, esc5, correo, callback) => {

    db.query(`INSERT INTO andon_escalamiento (correo, dep1, dep2, dep3, dep4, dep5, esc1, esc2, esc3, esc4, esc5)
    VALUES('${correo}',${dep1}, ${dep2}, ${dep3}, ${dep4}, ${dep5}, ${esc1}, ${esc2}, ${esc3}, ${esc4}, ${esc5})
    ON DUPLICATE KEY UPDATE dep1 = VALUES(dep1), dep2 = VALUES(dep2), dep3 = VALUES(dep3), dep4 = VALUES(dep4), dep5 = VALUES(dep5), 
    esc1 = VALUES(esc1), esc2 = VALUES(esc2), esc3 = VALUES(esc3), esc4 = VALUES(esc4), esc5 = VALUES(esc5)`, function (err, result, fields) {
            if (err) {

                callback(err, null);

            } else {

                callback(null, result);
            }
        })

}

funcion.sendEscalamiento = (esc, nextesc, esc1, tiempo) => {

    //Select andon mas antigua que este abierta y escalamiento sea cero
    db.query(`SELECT * FROM andon WHERE status !='Cerrada' && escalamiento=${esc} ORDER BY id_andon LIMIT 1`, function (err, result, fields) {
        if (err) {
            console.log(err)
        } else {


            if (result.length > 0) {
                
                //Select Fecha de inicio en la andon abierta
                var fechaInicio = result[0].fecha_inicio;
                var fechaActual = new Date();
                var seconds = (fechaActual.getTime() - fechaInicio.getTime()) / 1000;
                minutos = (seconds / 60);
                id_andon = result[0].id_andon;
                reporto = result[0].reporto;
                problema = result[0].problemas_comunes;
                descripcion = result[0].descripcion_problema;
                andonFecha = result[0].fecha_inicio;
                usuarioAtendida = result[0].usuario_atendida;
                fechaAtendida = result[0].fecha_hora_atendida;
                accionAtendidaC = result[0].acciones_atendida;
                usuarioCerrada = result[0].usuario_cierre;
                fechacierre = result[0].fecha_hora_cierre;
                accionCierre = result[0].acciones_cierre;

                //Select Nombre para crador del andon 
                dbE.query(`SELECT emp_Nombre FROM del_empleados WHERE emp_id=${reporto}`, function (err, resultNombre, fields) {

                    db.query(`SELECT descripcion FROM andon_fallas WHERE id=${problema}`, function (err, resultProblema, fields) {

                        //escalamiento minutos
                        if (minutos > tiempo) {
                            //update escalamiento a siguiente escalamiento
                            db.query(`UPDATE andon SET escalamiento='${nextesc}' WHERE id_andon=${result[0].id_andon} `, function (err, result, fields) {
 
                            });

                            db.query(`SELECT correo FROM andon_escalamiento WHERE dep${result[0].departamento}=1 AND ${esc1}=1`, function (err, resultc, fields) {

                                for (var i = 0; i < resultc.length; i++) {

                                    to = resultc[i].correo;
                                    cc = '';
                                    subject = 'Andon ' + id_andon + ' -Abierta- '+ tiempo+' Min';
                                    status = 'Abierta: ' + tiempo +' Min';
                                    color = '#b30000';
                                    id_andon = id_andon;
                                    creador = resultNombre[0].emp_Nombre;
                                    gafete = reporto;
                                    problema = resultProblema[0].descripcion;
                                    descripcion = descripcion;
                                    fecha = andonFecha;
                                    eclave = '';
                                    empleadoAtendida = usuarioAtendida;
                                    fechaAtendida = fechaAtendida;
                                    accionAtendida = accionAtendidaC;
                                    empleadoCerrada = usuarioCerrada;
                                    fechaCerrada = fechacierre;
                                    accionCerrada = accionCierre;

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
            }
        }
    });
};


var j = schedule.scheduleJob('1 * * * * *', function () {

    //(escactual,nextesc,escbd,tiempoescalamiento)

    funcion.sendEscalamiento(0, 1, 'esc1', 1);
    funcion.sendEscalamiento(1, 2, 'esc2', 3);
    funcion.sendEscalamiento(2, 3, 'esc3', 5);
    funcion.sendEscalamiento(3, 4, 'esc4', 7);
    funcion.sendEscalamiento(4, 5, 'esc5', 9);

});


module.exports = funcion;