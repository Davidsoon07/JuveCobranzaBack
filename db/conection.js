import sql from 'mssql';
import dotenv from 'dotenv';

dotenv.config();


const connectionSettings = {
  server: process.env.SQSQL_SERVER,
  database: process.env.SQL_DATABASE,
  user: process.env.SQL_USER,
  password: process.env.SQL_PASSWORD,
  options: {
    encrypt: true,
    trustServerCertifacte: true 
  }
}


export async function getConcetion ()
{
  try{
    return await sql.connect(connectionSettings);
  }
  catch(error){
    console.error(error);
  }
}

export {sql};

