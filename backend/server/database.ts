import dotenv from 'dotenv';
import mysql from 'mysql';
import {promisify} from 'util'

dotenv.config()

const pool:any = mysql.createPool(
{
    host: process.env.MYSQL_HOST,
    port: Number(process.env.MYSQL_PORT) || 3306,
    database: process.env.MYSQL_DB,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
})

pool.getConnection((error:any, connection:any) =>
{
    if(error) {
        if(error.code === "PROTOCOL_CONNECTION_LOST")
            console.error("database connection has been closed");

        else if(error.code === "ER_CON_COUNT_ERROR")
            console.error("database has to many connections");

        else if(error.code === "ECONNREFUSED")
            console.error("database connection was refused");
    }

    else if(connection) {
        connection.release()
        console.log("mysql database connected");
    }
       
        
})

pool.query = promisify(pool.query)

export default pool;