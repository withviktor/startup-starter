import { getSeoMetadata } from "@/lib/seo";
import { SignUpForm } from "./sign-up-form";

export const metadata = getSeoMetadata({
	title: "Sign Up",
	description: "Create a new account",
});

export default function SignUpPage() {
	return <SignUpForm />;
}
