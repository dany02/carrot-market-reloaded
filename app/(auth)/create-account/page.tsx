"use client";
import Button from "@/components/button";
import Input from "@/components/input";
import SocialLogin from "@/components/social-login";
import { createAccount } from "./actions";
import { useActionState } from "react";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function CreateAccount() {
    const [state, dispatch] = useActionState(createAccount, null);
    return (
        <div className="flex flex-col gap-10 py-8 px-6">
            <div className="flex flex-col gap-2 *:font-medium">
                <h1 className="text-2xl">안녕하세요!</h1>
                <h2 className="text-xl">Fill in the form below to join!</h2>
            </div>
            <form action={dispatch} className="flex flex-col gap-3">
                <Input
                    name="username"
                    type="text"
                    placeholder="Username"
                    required
					minLength={3}
					maxLength={10}
					errors={state?.errors.fieldErrors.username}
					defaultValue={(state?.values.username as string) || ''}
                />
                <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    required
					errors={state?.errors.fieldErrors.email}
					defaultValue={(state?.values.email as string) || ''}
                />
                <Input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
					minLength={PASSWORD_MIN_LENGTH}
					errors={state?.errors.fieldErrors.password}
					defaultValue={(state?.values.password as string) || ''}
					
                />
                <Input
                    name="confirm_password"
                    type="password"
                    placeholder="Confirm Password"
                    required
					minLength={PASSWORD_MIN_LENGTH}
					errors={state?.errors.fieldErrors.confirm_password}
					defaultValue={(state?.values.confirm_password as string) || ''}
                />
                <Button text="CreateAccount" />
            </form>
            <SocialLogin />
        </div>
    );
}
