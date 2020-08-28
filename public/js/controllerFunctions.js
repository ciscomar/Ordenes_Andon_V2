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
        area: dataEmail.area,
        subarea: dataEmail.subarea,
        estacion: dataEmail.estacion,
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

funcion.controllerSubArea = (id_area, callback) => {
    db.query(`SELECT * FROM andon_subarea WHERE id_area=${id_area}`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerSubAreaNombre = (id_subarea, callback) => {
    db.query(`SELECT * FROM andon_subarea WHERE id_subarea=${id_subarea}`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result[0].subarea);
        }
    })

}

funcion.controllerAreaNombre = (id_area, callback) => {
    db.query(`SELECT * FROM andon_areas WHERE id_area=${id_area}`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result[0].area);
        }
    })

}

funcion.controllerAreas = (callback) => {
    db.query(`SELECT area FROM andon_areas WHERE area != 'N/A'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerAreasId = (area, callback) => {
    db.query(`SELECT id_area FROM andon_areas WHERE area='${area}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result[0].id_area);
        }
    })

}

funcion.controllerAreaAndon = (id_andon, callback) => {
    db.query(`SELECT * FROM andon, andon_areas
    WHERE andon.id_andon = ${id_andon}
    AND andon.id_area= andon_areas.id_area`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result[0].area);
            }
        })
}

funcion.controllerSubAreaAndon = (id_andon, callback) => {
    db.query(`SELECT * FROM andon, andon_subarea
    WHERE andon.id_andon = ${id_andon}
    AND andon.id_subarea= andon_subarea.id_subarea`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result[0].subarea);
            }
        })
}

funcion.controllerEstacionAndon = (id_andon, callback) => {
    db.query(`SELECT * FROM andon, andon_estaciones
    WHERE andon.id_andon = ${id_andon}
    AND andon.id_estacion= andon_estaciones.id_estacion`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else if (result != '') {
                callback(null, result[0].estacion);
            } else {
                callback(null, '')
            }
        })
}

funcion.controllerEstaciones = (callback) => {
    db.query(`SELECT * FROM andon.andon_estaciones
    INNER JOIN andon_subarea ON andon_estaciones.id_subarea = andon_subarea.id_subarea`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}


funcion.estaciones = (subarea,callback) => {
    db.query(`SELECT * FROM andon_estaciones WHERE id_subarea=${subarea}`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

              
                callback(null, result);
            }
        })

}

funcion.controllerEstacionNombre = (id_estacion, callback) => {
    db.query(`SELECT estacion FROM andon_estaciones WHERE id_estacion='${id_estacion}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result[0].estacion);
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

funcion.controllerInsertAndon = (id_dep, id_prob, id_area, id_subarea, id_estacion, descripcion, gafete, clave, callback) => {
    if (id_estacion == '') {
        id_estacion = 104
    }
    db.query(`
    INSERT INTO andon (departamento, problemas_comunes,id_area, id_subarea, id_estacion, fecha_inicio, tiempo_muerto, 
    descripcion_problema, reporto, clave, status,escalamiento)
    VALUES( '${id_dep}', '${id_prob}','${id_area}','${id_subarea}','${id_estacion}', NOW() ,'${0}', '${descripcion}','${gafete}', '${clave}', 'Abierta',0)`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerUpdateAndonA = (accionTomada, actividades, formatted_current_date, minutos,nombreEmpleado, id_andon, callback) => {
    db.query(`UPDATE andon SET 
    status= "${accionTomada}",
    acciones_atendida= "${actividades}" ,
    fecha_hora_atendida= "${formatted_current_date}" ,
    tiempo_muerto= "${minutos}",
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
    console.log(minutos);
    if (minutos > 0) {
        db.query(`UPDATE andon SET 
        status= "${accionTomada}",
        fecha_hora_cierre= "${formatted_current_date}",
        usuario_cierre= "${nombreEmpleado}",
        acciones_cierre= "${actividades}"
        WHERE id_andon = ${id_andon}`, function (err, result, fields) {
                if (err) {
                    callback(err, null);
                } else {
    
                    callback(null, result);
                }
            }) 
    }else{
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


}

funcion.controllerTablaAndon = (callback) => {
    db.query(`SELECT * FROM andon, departamento, andon_fallas, andon_areas, andon_subarea, andon_estaciones
    WHERE (andon.departamento = departamento.id_departamento) 
    AND(andon.problemas_comunes= andon_fallas.id) 
    AND(andon.id_area= andon_areas.id_area)
    AND(andon.id_subarea= andon_subarea.id_subarea)
    AND(andon.id_estacion= andon_estaciones.id_estacion)
    ORDER BY status ASC`, function (err, result, fields) {
            if (err) {
                callback(err, null);
            } else {

                callback(null, result);
            }
        })

}

funcion.controllerRevisarAndon = (id_andon, callback) => {
    db.query(`SELECT * FROM andon, departamento, andon_fallas, andon_areas, andon_subarea, andon_estaciones
    WHERE (andon.departamento = departamento.id_departamento) 
    AND(andon.problemas_comunes= andon_fallas.id)
    AND(andon.id_area= andon_areas.id_area)
    AND(andon.id_subarea= andon_subarea.id_subarea)
    AND(andon.id_estacion= andon_estaciones.id_estacion)
    AND andon.id_andon = "${id_andon}"`, function (err, result, fields) {
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

funcion.controllerCountAndonArea = (as, area, callback) => {
    db.query(`SELECT COUNT(*) AS ${as} FROM andon WHERE status !='Cerrada' && id_area='${area}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerCountAndonAreaEmp = (as, area, numeroEmpleado, callback) => {
    db.query(`SELECT COUNT(*) AS ${as} FROM andon WHERE status !='Cerrada' && id_area='${area}' && reporto='${numeroEmpleado}'`, function (err, result, fields) {
        if (err) {
            callback(err, null);
        } else {

            callback(null, result);
        }
    })

}

funcion.controllerHisotrialAndon = (numeroEmpleado, callback) => {
    db.query(`SELECT * FROM andon, departamento, andon_fallas, andon_areas, andon_subarea, andon_estaciones
    WHERE (andon.departamento = departamento.id_departamento) 
    AND(andon.problemas_comunes = andon_fallas.id) 
    AND(andon.id_area= andon_areas.id_area)
    AND(andon.id_subarea= andon_subarea.id_subarea)
    AND(andon.id_estacion= andon_estaciones.id_estacion)
    AND (andon.reporto ="${numeroEmpleado}") ORDER BY id_andon DESC `, function (err, result, fields) {
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

    db.query(`SELECT COUNT(id_andon) AS problemas_comunes_count, andon_fallas.descripcion as andon_fallas, departamento.nombre as departamento , andon.tiempo_muerto
    FROM andon.andon, andon.andon_fallas, andon.departamento
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

funcion.controllerDashSeleccionArea = (area, callback) => {

    db.query(`SELECT andon.id_subarea, count(*) AS TOTAL, andon_subarea.subarea AS subarea 
    FROM andon.andon, andon.andon_subarea 
    WHERE andon.id_area =${area} 
    AND andon.id_subarea = andon_subarea.id_subarea 
    GROUP BY andon.id_subarea`, function (err, result, fields) {

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
    db.query(`SELECT * FROM andon WHERE status !='Cerrada' && escalamiento=${esc}`, function (err, result, fields) {

        if (err) {
            console.log(err)

        } else {

            if (result.length > 0) {
                for (let y = 0; y < result.length; y++) {

                    //Select Fecha de inicio en la andon abierta
                    var fechaInicio = result[y].fecha_inicio;
                    var fechaActual = new Date();
                    var seconds = (fechaActual.getTime() - fechaInicio.getTime()) / 1000;
                    minutos = (seconds / 60);

                    //escalamiento minutos
                    if (minutos > tiempo) {
                        //update escalamiento a siguiente escalamiento
                        db.query(`UPDATE andon SET escalamiento='${nextesc}' WHERE id_andon=${result[y].id_andon} `, function (err, resultescal, fields) {

                            db.query(`SELECT correo FROM andon_escalamiento WHERE dep${result[y].departamento}=1 AND ${esc1}=1`, function (err, resultc, fields) {

                                for (let i = 0; i < resultc.length; i++) {

                                    //Select Nombre para crador del andon 
                                    dbE.query(`SELECT emp_Nombre FROM del_empleados WHERE emp_id=${result[y].reporto}`, function (err, resultNombre, fields) {

                                        db.query(`SELECT descripcion FROM andon_fallas WHERE id=${result[y].problemas_comunes}`, function (err, resultProblema, fields) {

                                            db.query(`SELECT area FROM andon_areas WHERE id_area=${result[y].id_area}`, function (err, resultArea, fields) {

                                                db.query(`SELECT subarea FROM andon_subarea WHERE id_subarea=${result[y].id_subarea}`, function (err, resultSubarea, fields) {

                                                    db.query(`SELECT estacion FROM andon_estaciones WHERE id_estacion='${result[y].id_estacion}'`, function (err, resultEstacion, fields) {

                                                        var fechaInicio = result[y].fecha_inicio;
                                                        var fechaActual = new Date();
                                                        var seconds = (fechaActual.getTime() - fechaInicio.getTime()) / 1000;
                                                        minutos = (seconds / 60);
                                                        id_andon = result[y].id_andon;
                                                        reporto = result[y].reporto;
                                                        problema = result[y].problemas_comunes;
                                                        descripcion = result[y].descripcion_problema;
                                                        andonFecha = result[y].fecha_inicio;
                                                        usuarioAtendida = result[y].usuario_atendida;
                                                        fechaAtendida = result[y].fecha_hora_atendida;
                                                        accionAtendidaC = result[y].acciones_atendida;
                                                        usuarioCerrada = result[y].usuario_cierre;
                                                        fechacierre = result[y].fecha_hora_cierre;
                                                        accionCierre = result[y].acciones_cierre;

                                                        to = resultc[i].correo;
                                                        cc = '';
                                                        subject = 'Andon ' + id_andon + ' -Abierta- ' + tiempo + ' Min';
                                                        status = 'Abierta: ' + tiempo + ' Min';
                                                        color = '#b30000';
                                                        id_andon = id_andon;
                                                        creador = resultNombre[0].emp_Nombre;
                                                        gafete = reporto;
                                                        problema = resultProblema[0].descripcion;
                                                        area = resultArea[0].area;
                                                        subarea = resultSubarea[0].subarea;
                                                        estacion = resultEstacion[0].estacion;
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
                                                            fechaAtendida, accionAtendida, empleadoCerrada, fechaCerrada, accionCerrada, area, subarea, estacion
                                                        }

                                                        funcion.sendEmail(dataEmail);

                                                    });
                                                });
                                            })
                                        })
                                    })
                                }
                            });
                        });
                    }
                }
            }
        }
    });
};


var j = schedule.scheduleJob('1 * * * * *', function () {

    //(escactual,nextesc,escbd,tiempoescalamiento)

    funcion.sendEscalamiento(0, 1, 'esc1', 1);
    funcion.sendEscalamiento(1, 2, 'esc2', 15);
    funcion.sendEscalamiento(2, 3, 'esc3', 30);
    funcion.sendEscalamiento(3, 4, 'esc4', 60);
    funcion.sendEscalamiento(4, 5, 'esc5', 120);

});


module.exports = funcion;