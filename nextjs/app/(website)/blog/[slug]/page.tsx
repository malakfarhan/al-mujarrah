import BlogDetail from "@/components/website/BlogDetail";

export const metadata = {
  title: "Insight",
};

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <BlogDetail slug={slug} />;
}