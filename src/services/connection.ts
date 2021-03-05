import {
  clusterApiUrl,
  Commitment,
  Connection,
} from "@solana/web3.js";

export const COMMITMENT: Commitment = "singleGossip";

export enum Cluster {
  MAINNET = "mainnet-beta",
  TESTNET = "testnet",
  DEVNET = "devnet",
  LOCALNET =  "http://localhost:8899",
};

export let targetCluster: Cluster = Cluster.LOCALNET;

export let connection: Connection = new Connection(targetCluster, COMMITMENT);

export const switchCluster = (cluster: Cluster) => {
  connection = new Connection(
    cluster === Cluster.LOCALNET
      ? Cluster.LOCALNET
      : clusterApiUrl(cluster),
      COMMITMENT
  );
  targetCluster = cluster;
};

export const getConnection = () => connection;
