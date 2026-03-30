import PortfolioDashboard from "@/components/PortfolioDashboard";
import { getPortfolioSnapshot, parsePortfolioFilters } from "@/lib/programs";

type HomeProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Home({ searchParams }: HomeProps) {
  const filters = parsePortfolioFilters(await searchParams);
  const snapshot = await getPortfolioSnapshot(filters);

  return (
    <main className="mx-auto max-w-screen-2xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
      <PortfolioDashboard snapshot={snapshot} />
    </main>
  );
}
