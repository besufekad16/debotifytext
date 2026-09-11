/**
 * Compatibility shim — cluster registry now lives in src/lib/pseo.
 */
export {
  CLUSTER_META as CLUSTER_REGISTRY,
  CLUSTER_ORDER,
  getClusterSize,
  getTotalPseoCount,
  type AnyClusterKey,
  type LiteEntry,
  type ClusterMeta,
} from "~/lib/pseo/clusters";

import { CLUSTER_META } from "~/lib/pseo/clusters";
import { getClusterEntries } from "~/lib/pseo/keywords";
import type { ClusterKey } from "~/lib/pseo/types";
import type { LiteEntry } from "~/lib/pseo/clusters";

type RegistryEntry = typeof CLUSTER_META[ClusterKey] & { getEntries: () => LiteEntry[] };

export const CLUSTER_REGISTRY_WITH_ENTRIES = Object.fromEntries(
  (Object.keys(CLUSTER_META) as ClusterKey[]).map((key) => [
    key,
    { ...CLUSTER_META[key], getEntries: () => getClusterEntries(key) },
  ]),
) as Record<ClusterKey, RegistryEntry>;
