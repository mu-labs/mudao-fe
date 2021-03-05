import {
  Cluster,
  clusterApiUrl,
  Commitment,
  Connection,
} from "@solana/web3.js";

type Localnet = "localnet";

export const COMMITMENT: Commitment = "singleGossip";

export const CLUSTERS = {
  MAINNET: "mainnet-beta" as Cluster,
  TESTNET: "testnet" as Cluster,
  DEVNET: "devnet" as Cluster,
  LOCALNET: "localnet" as Localnet,
};

export let targetCluster: Cluster | Localnet = CLUSTERS.LOCALNET;

let connection: Connection;

export const switchCluster = (cluster: Cluster | Localnet) => {
  connection = new Connection(
    cluster === CLUSTERS.LOCALNET
      ? "http://localhost:8899"
      : clusterApiUrl(cluster),
      COMMITMENT
  );
  targetCluster = cluster;
};

export const getConnection = () => connection;
