import PortfolioDetail from "@/components/website/PortfolioDetail";

export const metadata = {
  title: "Portfolio Project",
};

export default async function PortfolioDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <PortfolioDetail slug={slug} />;
}