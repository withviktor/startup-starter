import {
	Body,
	Container,
	Head,
	Heading,
	Hr,
	Html,
	Img,
	Link,
	Preview,
	Section,
	Tailwind,
	Text,
} from "@react-email/components";

import { env } from "@startup-starter/env/transactional";

interface VerifyEmailProps {
	verificationCode?: string;
}

const baseUrl = env.BASE_URL;

export default function VerifyEmail({
	verificationCode,
}: VerifyEmailProps) {
	return (
		<Html>
			<Head />
			<Tailwind>
				<Body className="bg-white font-aws text-[#212121]">
					<Preview>Email Verification</Preview>
					<Container className="mx-auto bg-[#eee] p-5">
						<Section className="bg-white">
							<Section className="flex items-center justify-center bg-[#252f3d] py-5">
								<Img
									src={`${baseUrl}/static/aws-logo.png`}
									width="75"
									height="45"
									alt="AWS's Logo"
								/>
							</Section>
							<Section className="px-8.75 py-6.25">
								<Heading className="mb-3.75 font-bold text-[#333] text-[20px]">
									Verify your email address
								</Heading>
								<Text className="mx-0 mt-6 mb-3.5 text-[#333] text-[14px] leading-6">
									Thanks for starting the new AWS account creation process. We
									want to make sure it's really you. Please enter the following
									verification code when prompted. If you don&apos;t want to
									create an account, you can ignore this message.
								</Text>
								<Section className="flex items-center justify-center">
									<Text className="m-0 text-center font-bold text-[#333] text-[14px]">
										Verification code
									</Text>

									<Text className="mx-0 my-2.5 text-center font-bold text-[#333] text-[36px]">
										{verificationCode}
									</Text>
									<Text className="m-0 text-center text-[#333] text-[14px]">
										(This code is valid for 10 minutes)
									</Text>
								</Section>
							</Section>
							<Hr />
							<Section className="px-8.75 py-6.25">
								<Text className="m-0 text-[#333] text-[14px]">
									Amazon Web Services will never email you and ask you to
									disclose or verify your password, credit card, or banking
									account number.
								</Text>
							</Section>
						</Section>
						<Text className="mx-0 my-6 px-5 py-0 text-[#333] text-[12px]">
							This message was produced and distributed by Amazon Web Services,
							Inc., 410 Terry Ave. North, Seattle, WA 98109. © 2022, Amazon Web
							Services, Inc.. All rights reserved. AWS is a registered trademark
							of{" "}
							<Link
								href="https://amazon.com"
								target="_blank"
								className="text-[#2754C5] text-[14px] underline"
							>
								Amazon.com
							</Link>
							, Inc. View our{" "}
							<Link
								href="https://amazon.com"
								target="_blank"
								className="text-[#2754C5] text-[14px] underline"
							>
								privacy policy
							</Link>
							.
						</Text>
					</Container>
				</Body>
			</Tailwind>
		</Html>
	);
}

VerifyEmail.PreviewProps = {
	verificationCode: "596853",
} satisfies VerifyEmailProps;
