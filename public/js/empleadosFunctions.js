const funcionE = {};
const dbE = require('../db/connEmpleados');
const db = require('../db/conn');

funcionE.empleadosCorreo= (gafete, callback)=>{

    dbE.query(`SELECT emp_correo from del_empleados WHERE emp_id= ${gafete}`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result[0].emp_correo);
        }
    })

}


funcionE.empleadosCount=(gafete,callback)=>{
    dbE.query(`SELECT COUNT( * ) AS count FROM del_empleados WHERE emp_id=${gafete}`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result[0].count);
        }
    })

}

funcionE.empleadosNombre=(gafete,callback)=>{
    dbE.query(`SELECT emp_nombre FROM del_empleados WHERE emp_id=${gafete}`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
            
        callback (null,result[0].emp_nombre);
        }
    })

}

funcionE.empleadosAccess2=(callback)=>{
    dbE.query(`SELECT acc_id FROM del_accesos WHERE acc_ultra=2`, function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcionE.empleadosCorreoDep= (gafeteAcc,id_depE, callback)=>{

    dbE.query(`SELECT emp_correo from del_empleados WHERE emp_id= ${gafeteAcc} AND emp_dep=${id_depE}` , function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{

        callback (null,result);
        }
    })

}

funcionE.empleadosRevisarAccess1= (numeroEmpleado, callback)=>{

    dbE.query(`SELECT COUNT( * ) AS count FROM del_accesos WHERE acc_id=${numeroEmpleado}` , function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
        callback (null,result[0].count);
        }
    })

}

funcionE.empleadosRevisarAccess2= (numeroEmpleado,acc_ultra, callback)=>{

    dbE.query(`SELECT COUNT( * ) AS count FROM del_accesos WHERE acc_id=${numeroEmpleado} AND acc_ultra=${acc_ultra} ` , function (err, result, fields) {
        if (err) {
            callback (err,null);
        }else{
        callback (null,result[0].count);
        }
    })

}



module.exports = funcionE;