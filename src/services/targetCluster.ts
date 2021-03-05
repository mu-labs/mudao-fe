import {
  Cluster,
  clusterApiUrl,
  Commitment,
  Connection,
} from "@solana/web3.js";

export const DEFAULT_CLUSTER = "http://localhost:8899";

type Localnet = "localnet";

export const COMMITMENT: Commitment = "singleGossip";

export const CLUSTERS = {
  MAINNET: "mainnet-beta" as Cluster,
  TESTNET: "testnet" as Cluster,
  DEVNET: "devnet" as Cluster,
  LOCALNET: "localnet" as Localnet,
};

export let targetCluster: Cluster | Localnet = CLUSTERS.LOCALNET;

export let connection: Connection = new Connection(DEFAULT_CLUSTER, COMMITMENT);

export const switchCluster = (cluster: Cluster | Localnet) => {
  connection = new Connection(
    cluster === CLUSTERS.LOCALNET
      ? DEFAULT_CLUSTER
      : clusterApiUrl(cluster),
      COMMITMENT
  );
  targetCluster = cluster;
};

export const getConnection = () => connection;
