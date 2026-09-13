import { services } from "@/lib/data";
import ServiceDetail from "@/components/website/ServiceDetail";

export function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  return {
    title: service?.title ?? "Service",
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <ServiceDetail slug={slug} />;
}