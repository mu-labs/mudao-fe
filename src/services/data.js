import * as BufferLayout from 'buffer-layout';
import { PublicKey } from '@solana/web3.js';

export const ACCOUNT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(32, 'mint'),
  BufferLayout.blob(32, 'owner'),
  BufferLayout.nu64('amount'),
  BufferLayout.blob(93),
]);

export const MINT_LAYOUT = BufferLayout.struct([
  BufferLayout.blob(44),
  BufferLayout.u8('decimals'),
  BufferLayout.blob(37),
]);

export function parseTokenAccountData(data) {
  let pubkey = data[0].toBuffer();
  let { mint, owner, amount } = ACCOUNT_LAYOUT.decode(data[1]);
  return {
    pubkey: new PublicKey(pubkey).toBase58(),
    mint: new PublicKey(mint).toBase58(),
    owner: new PublicKey(owner).toBase58(),
    amount,
  };
}

export function parseMintData(data) {
  let { decimals } = MINT_LAYOUT.decode(data);
  return { decimals };
}
