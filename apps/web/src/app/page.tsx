import { Features } from "@/components/marketing/features";
import { Footer } from "@/components/marketing/footer";
import { Header } from "@/components/marketing/header";
import { Hero } from "@/components/marketing/hero";
import { Pricing } from "@/components/marketing/pricing";

export default function Home() {
	return (
		<div className="flex min-h-svh flex-col">
			<Header />
			<main className="flex-1">
				<Hero />
				<Features />
				<Pricing />
			</main>
			<Footer />
		</div>
	);
}
