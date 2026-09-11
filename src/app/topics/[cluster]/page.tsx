import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClusterHub from "~/components/templates/ClusterHub";
import { BASE_URL, CLUSTER_META, CLUSTER_ORDER, clusterPageCount, hubPath, type ClusterKey } from "~/lib/pseo";

interface PageProps {
  params: Promise<{ cluster: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return CLUSTER_ORDER.map((cluster) => ({ cluster }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cluster } = await params;
  const meta = CLUSTER_META[cluster as ClusterKey];
  if (!meta) return { title: "Not Found", robots: { index: false, follow: false } };
  const url = `${BASE_URL}${hubPath(cluster as ClusterKey, 1)}`;
  const title = `${meta.label} | HumanifyLab`;
  const description = `${meta.description} Page 1 of ${clusterPageCount(cluster as ClusterKey)}.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, siteName: "HumanifyLab", type: "website" },
  };
}

export default async function ClusterTopicPage({ params }: PageProps) {
  const { cluster } = await params;
  if (!(cluster in CLUSTER_META)) notFound();
  return <ClusterHub cluster={cluster as ClusterKey} page={1} />;
}
