"use server";

import { redirect } from "next/navigation";

export async function handleForm(prevState: any, formData: FormData){
	await new Promise((resolve)=>setTimeout(resolve,5000));
	console.log(formData);
	//redirect("/");
	return{
		errors:["wrong password", "password too short"]
	};
	
	
}