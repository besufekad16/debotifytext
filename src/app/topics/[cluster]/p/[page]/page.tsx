import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ClusterHub from "~/components/templates/ClusterHub";
import { BASE_URL, CLUSTER_META, CLUSTER_ORDER, clusterPageCount, hubPath, type ClusterKey } from "~/lib/pseo";

interface PageProps {
  params: Promise<{ cluster: string; page: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  const params: { cluster: string; page: string }[] = [];
  for (const cluster of CLUSTER_ORDER) {
    const total = clusterPageCount(cluster);
    for (let p = 2; p <= total; p++) {
      params.push({ cluster, page: String(p) });
    }
  }
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { cluster, page: pageRaw } = await params;
  const meta = CLUSTER_META[cluster as ClusterKey];
  const page = Number(pageRaw);
  if (!meta || !Number.isInteger(page) || page < 2) {
    return { title: "Not Found", robots: { index: false, follow: false } };
  }
  const total = clusterPageCount(cluster as ClusterKey);
  if (page > total) return { title: "Not Found", robots: { index: false, follow: false } };
  const url = `${BASE_URL}${hubPath(cluster as ClusterKey, page)}`;
  const title = `${meta.label} — page ${page} | HumanifyLab`;
  const description = `${meta.description} Page ${page} of ${total}.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    robots: { index: true, follow: true },
    openGraph: { title, description, url, siteName: "HumanifyLab", type: "website" },
  };
}

export default async function ClusterPagedHub({ params }: PageProps) {
  const { cluster, page: pageRaw } = await params;
  if (!(cluster in CLUSTER_META)) notFound();
  const page = Number(pageRaw);
  const total = clusterPageCount(cluster as ClusterKey);
  if (!Number.isInteger(page) || page < 2 || page > total) notFound();
  return <ClusterHub cluster={cluster as ClusterKey} page={page} />;
}
