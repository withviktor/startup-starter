import { getSeoMetadata } from "@/lib/seo";
import { SignInForm } from "./sign-in-form";

export const metadata = getSeoMetadata({
	title: "Sign In",
	description: "Sign in to your account",
});

export default function SignInPage() {
	return <SignInForm />;
}
