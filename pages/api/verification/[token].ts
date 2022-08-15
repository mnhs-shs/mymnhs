import { NextApiRequest, NextApiResponse } from "next";
import { verifyVerificationToken } from "../../../utils/jwt/jwt";
import dbExecute from "../../../utils/db/db";

interface UserInfo {
	user?: {
		email: string | undefined;
		exp: number | undefined;
	};
}
interface InData {
	verify_id: number;
	verify_first_name: string;
	verify_last_name: string;
	verify_email: string;
	verify_password: string;
	verify_section_id: number;
}
type ObjData = InData[];
/**
 * Flow of the code
 * 1. Get the jwt token from the request which contains the email
 * 2. Verify the token
 * 3. Search db for matching email
 * 4. Convert sql data to js object
 * 5. Insert the user to the account_table
 * 6. redirect user to the login page
 */

export default async function (req: NextApiRequest, res: NextApiResponse) {
	try {
		const { token } = req.query;
		const userInfo: UserInfo = await verifyVerificationToken(
			token as string
		);

		const sql = `
            SELECT * FROM verify_user_table
            WHERE verify_email = $1
			LIMIT 1;
			`;

		const objData: ObjData = await dbExecute(sql, [userInfo.user?.email]);
		const {
			verify_id,
			verify_first_name,
			verify_last_name,
			verify_email,
			verify_password,
			verify_section_id,
		} = objData[0];

		console.log(objData[0]);
		const sql2 = `
            DELETE FROM verify_user_table
            WHERE verify_id = $1;`;

		await dbExecute(sql2, [verify_id]);
		const sql3 = `
            INSERT INTO account_table (account_first_name, account_last_name, account_email, account_password, account_section_id)
            VALUES ($1, $2, $3, $4, $5);`;

		await dbExecute(sql3, [
			verify_first_name,
			verify_last_name,
			verify_email,
			verify_password,
			verify_section_id,
		]);
		return res.status(200).redirect("http://localhost:3000/login");
	} catch (error) {
		console.log(error);

		return res.status(500).redirect("http://localhost:3000/500");
	}
}
