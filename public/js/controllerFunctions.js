const funcion = {};
const express = require('express');
const app = express();
mail_config = require('../email/conn.js');
var mailer = require('express-mailer');
mailer.extend(app, mail_config);

const db = require('../db/conn');

funcion.sendEmail= (dataEmail)=>{

    //Enviar Correos
    app.mailer.send('email.ejs', {

        //Info General
        to: dataEmail.to,
        cc:dataEmail.cc,
        subject: dataEmail.subject,
        status: dataEmail.status,
        color: dataEmail.color,
        id_orden: dataEmail.id_orden,
        creador: dataEmail.creador,
        gafete: dataEmail.gafete,
        maquina: dataEmail.maquina,
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

funcion.controllerDepartamentos=(callback)=>{
    db.query(`SELECT * FROM departamento`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
        callback (null,result);
        }
    })

}

funcion.controllerNombreDepartamento=(selectedDepartment,callback)=>{
    db.query(`SELECT nombre FROM departamento WHERE id_departamento = ${selectedDepartment} `, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
            
        callback (null,result);
        }
    })

}

funcion.controllerMaquinas=(callback)=>{
    db.query(`SELECT * FROM maquinas`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
            
        callback (null,result);
        }
    })

}

funcion.controllerIdMaquina=(maquina,callback)=>{
    db.query(`SELECT id_maquina FROM maquinas WHERE nombre ='${maquina}'`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
            
        callback (null,result[0].id_maquina);
        }
    })

}

funcion.controllerNombreMaquina=(maquina,callback)=>{
    db.query(`SELECT nombre FROM maquinas WHERE id_maquina= ${maquina}`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
            
        callback (null,result[0].nombre);
        }
    })

}

funcion.controllerFamilia=(maquina,callback)=>{
    db.query(`SELECT familia FROM maquinas WHERE nombre= '${maquina}'`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result[0].familia);
        }
    })

}

funcion.controllerComponentes=(familia,callback)=>{
    db.query(`SELECT componente FROM areas_componentes_afectados WHERE familia_maquina = '${familia}'`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
            
        callback (null,result);
        }
    })

}

funcion.controllerIdComponente=(parteAfectada,familia,callback)=>{
    db.query(`SELECT id_componente FROM areas_componentes_afectados WHERE componente ='${parteAfectada}' AND familia_maquina='${familia}'`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
            
        callback (null,result[0].id_componente);
        }
    })

}

funcion.controllerIdDepartamento=(departamento,callback)=>{
    db.query(`SELECT id_departamento FROM departamento WHERE nombre='${departamento}'`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
            
        callback (null,result[0].id_departamento);
        }
    })

}

funcion.controllerOrdenesAbiertas=(callback)=>{
    db.query(`SELECT id_orden FROM ordenes WHERE status='Abierta' OR status='atendida'`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
            
        callback (null,result);
        }
    })

}

funcion.controllerCountOrdenes=(id_orden,callback)=>{
    db.query(`SELECT COUNT( * ) AS count FROM ordenes WHERE id_orden=${id_orden}`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result[0].count);
        }
    })

}

funcion.controllerStatusOrden=(id_orden,callback)=>{
    db.query(`SELECT status FROM ordenes WHERE id_orden=${id_orden}`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcion.controllerClaveOrden=(id_orden,callback)=>{
    db.query(`SELECT clave FROM ordenes WHERE id_orden=${id_orden}`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcion.controllerParteAfectadaOrden=(id_orden,callback)=>{
    db.query(`SELECT * FROM ordenes,areas_componentes_afectados 
    WHERE ordenes.id_orden = ${id_orden}
    AND ordenes.parte_afectada = areas_componentes_afectados.id_componente`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcion.controllerMaxIdOrden=(callback)=>{
    db.query(`SELECT MAX(id_orden) AS id FROM ordenes`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcion.controllerInsertOrden=(id_dep,id_maquina,componente,descripcion,gafete,empleado,turno,grupo,clave,tipoOrden,callback)=>{
    db.query(`
    INSERT INTO ordenes (departamento, maquina, parte_afectada, descripcion_problema, 
    reporto, usuario_dominio, email, turno, grupo,  fecha_hora, clave, status, tipo_orden)
    VALUES( '${id_dep}', '${id_maquina}', '${componente}', '${descripcion}', 
    '${gafete}', '${empleado}', '${empleado + '@tristone.com'}', '${turno}', '${grupo}', NOW() , '${clave}', 
    'Abierta', '${tipoOrden}')`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcion.controllerUpdateOrdenA=(accionTomada,actividades,formatted_current_date,seconds,nombreEmpleado,id_orden,callback)=>{
    db.query(`UPDATE ordenes SET 
    status= "${accionTomada}",
    acciones_atendida= "${actividades}" ,
    fecha_hora_atendida= "${formatted_current_date}" ,
    tiempo_atendida= "${seconds}",
    usuario_atendida= "${nombreEmpleado}" 
    WHERE id_orden = ${id_orden}`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcion.controllerUpdateOrdenC=(accionTomada,actividades,formatted_current_date,seconds,nombreEmpleado,id_orden,callback)=>{
    db.query(`UPDATE ordenes SET 
    status= "${accionTomada}",
    fecha_hora_cierre= "${formatted_current_date}",
    usuario_cierre= "${nombreEmpleado}",
    acciones_cierre= "${actividades}",
    tiempo_muerto= "${seconds}",
    area_real_afectada= "NULL",
    parte_real_afectada= "NULL"
    WHERE id_orden = ${id_orden}`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcion.controllerTablaOrdenes=(callback)=>{
    db.query(`SELECT * FROM ordenes, departamento, areas_componentes_afectados 
    WHERE (ordenes.departamento = departamento.id_departamento) 
    AND(ordenes.parte_afectada= areas_componentes_afectados.id_componente) ORDER BY id_orden DESC`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcion.controllerRevisarOrden=(id_orden, callback)=>{
    db.query(`SELECT * FROM ordenes, departamento, areas_componentes_afectados 
    WHERE (ordenes.departamento = departamento.id_departamento) 
    AND(ordenes.parte_afectada= areas_componentes_afectados.id_componente) AND ordenes.id_orden = "${id_orden}"`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcion.controllerCountOrdenesAll=(as, status,callback)=>{
    db.query(`SELECT COUNT(*) AS ${as} FROM ordenes WHERE status="${status}"`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcion.controllerHisotrialOrdenes=(numeroEmpleado,callback)=>{
    db.query(`SELECT * FROM ordenes, departamento, areas_componentes_afectados 
    WHERE (ordenes.departamento = departamento.id_departamento) 
    AND(ordenes.parte_afectada= areas_componentes_afectados.id_componente) AND (ordenes.reporto ="${numeroEmpleado}") ORDER BY id_orden DESC `, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcion.controllerHistorialOrdenesStatus=(as, status,numeroEmpleado,callback)=>{
    db.query(`SELECT COUNT(*) AS ${as} FROM ordenes WHERE status ="${status}" AND reporto ="${numeroEmpleado}"`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcion.controllerDashCount=(as, selectedMonth,selectedYear,selectedDepartment,status,callback)=>{
    db.query(`SELECT COUNT(*) AS ${as} FROM ordenes  WHERE MONTH(fecha_hora) = ${selectedMonth} AND  YEAR(fecha_hora) = ${selectedYear} AND departamento = ${selectedDepartment} AND status ="${status}" `, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcion.controllerDashSeleccion=(selectedMonth,selectedYear,selectedDepartment,callback)=>{
    db.query(`
    SELECT COUNT(id_orden) AS parte_afectada_count, maquinas.nombre as maquina, departamento.nombre as departamento , ordenes.tiempo_muerto
    FROM otplus.ordenes, otplus.maquinas, otplus.departamento 
    WHERE ordenes.maquina = maquinas.id_maquina 
    AND ordenes.departamento = departamento.id_departamento 
    AND MONTH(ordenes.fecha_hora) = ${selectedMonth}  
    AND YEAR(ordenes.fecha_hora) = ${selectedYear} 
    AND departamento.id_departamento = "${selectedDepartment}"
    GROUP by ordenes.maquina
    `, function (err, result, fields) {

        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}



module.exports = funcion;