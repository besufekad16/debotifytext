import { HUB_PAGE_SIZE, type ClusterKey } from "./types";
import { getClusterEntries } from "./keywords";

export function clusterPageCount(cluster: ClusterKey): number {
  return Math.max(1, Math.ceil(getClusterEntries(cluster).length / HUB_PAGE_SIZE));
}

export function hubPath(cluster: ClusterKey, page: number): string {
  return page <= 1 ? `/topics/${cluster}` : `/topics/${cluster}/p/${page}`;
}
