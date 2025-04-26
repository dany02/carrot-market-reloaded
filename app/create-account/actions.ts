"use server";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import db from "@/lib/db";
import { z } from "zod";
import bcrypt from "bcrypt";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const checkUsername = (username: string) => {
    return !username.includes("potato");
};

const checkPasswords = ({
    password,
    confirm_password,
}: {
    password: string;
    confirm_password: string;
}) => {
    return password === confirm_password;
};

const checkUniqueUsername = async(username: string) => {
	const user = await db.user.findUnique({
		where: {
			username,
		},
		select: {
			id: true,
		},
	});

	return !Boolean(user);
};

const checkUniqueEmail = async(email: string) => {
	const user = await db.user.findUnique({
		where: {
			email,
		},
		select: {
			id: true
		}
	});
	
	return !Boolean(user);
};

const formSchema = z
    .object({
        username: z
            .string({
                invalid_type_error: "Username must be a string",
                required_error: "Where is my username???",
            })
			.trim()
			.toLowerCase()	
			//.transform((username) => `🔥 ${username} 🔥`)	//값을 변환	
            .refine(checkUsername, "No potatoes allowed!")
			.refine(checkUniqueUsername, "This username is already taken"),
        email: z.string().email().trim().toLowerCase()
				.refine(checkUniqueEmail,"There is an account already registered with that email."),
        password: z
            .string()
            .min(PASSWORD_MIN_LENGTH)
            .regex(
                PASSWORD_REGEX,
                PASSWORD_REGEX_ERROR
            ),
        confirm_password: z.string().min(PASSWORD_MIN_LENGTH),
    })
    .refine(checkPasswords, {
        message: "Both passwords should be the same!",
        path: ["confirm_password"],
    })
	.superRefine(async({username}, ctx) => {
		const user = await db.user.findUnique({
			where: {
				username
			},
			select: {
				id: true
			}
		});
		if(user){
			ctx.addIssue({
				code:'custom',
				message: "This username is already taken",
			});
		}

	});

export async function createAccount(prevState: any, formData: FormData) {
    const data = {
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password"),
    };
    const result = await formSchema.spa(data);

    if (!result.success) {
        return {
            errors: result.error.flatten(),
            values: data, // 입력값도 함께 반환
        };
    }else{
		// check if username is taken		
		// check if the email already used		
		// hash password
		const hashedPassword = await bcrypt.hash(result.data.password, 12);
		// save the user to db
		const user = await db.user.create({
			data: {
				username: result.data.username,
				email: result.data.email,
				password: hashedPassword,
			},
			select: {
				id: true,
			},
		});
		// log the user in
		const session = await getSession();
		session.id = user.id;
		await session.save();
		redirect("/profile");
	}
}
