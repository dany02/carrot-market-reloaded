import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
	id?:number;
}

export default async function getSession(){
	//console.log(cookies());
	return(
		getIronSession<SessionContent>(await cookies(),{
			cookieName: "delicious-karrot",
			password: process.env.COOKIE_PASSWORD!,
		})
	);
}