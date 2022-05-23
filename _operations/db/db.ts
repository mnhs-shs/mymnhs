import mysql from "mysql2/promise";

const connection = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
});

async function dbExecute(query: string, params?: any[]): Promise<any> {
	const [data] = await connection.execute(query, params);
	return JSON.parse(JSON.stringify(data));
}
export default dbExecute;
