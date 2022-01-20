/**
 * Entry File.
 *
 * Copyright (c) 2022.
 * Kenichi Inoue.
 */
import { Wallet } from './wallet';

/**
 * Main Process.
 */
function main() {
  // 動作確認用
  const wallet = new Wallet(10000);
  // 実行確認
  wallet.pay(300);
  wallet.receive(400);
  console.log(wallet.getCurrentBalance());
  console.log(wallet.getHistory());
}

main();
