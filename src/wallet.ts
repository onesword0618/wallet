/**
 * Main Process function.
 *
 * Wallet Operation Application.
 *
 * Copyright (c) 2022.
 * Kenichi Inoue.
 */
import { formatToTimeZone } from 'date-fns-timezone';

const Operation = {
  receive: `入金`,
  pay: `出金`,
};

type History = {
  dateTime: string;
  operationAmount: number;
  commission: number;
  balance: number;
};

/**
 * このクラスでは以下の操作を提供する.
 * - 入金
 * - 出金
 * - 現在の残高照会
 */
class Wallet {
  private balance: number;

  private log: Array<History>;

  private readonly numberPattern = /^([1-9]\d*|0)$/;

  private readonly commission = 100;

  constructor(initialBalance: number) {
    this.balance = initialBalance;
    this.log = [];
  }

  /**
   * 現在の残高を提供する.
   *
   * @returns {number} 現在の残高
   */
  public getCurrentBalance(): number {
    return this.balance;
  }

  /**
   * 指定した額を入金する.
   *
   * @param {number} amount 入金額
   */
  public receive(amount: number): void {
    this.accounting(amount, Operation.receive);
    this.operationLog(this.processingDateTime(new Date()), Operation.receive, amount, this.commission, this.balance);
  }

  /**
   * 指定した額を出金する.
   *
   * @param {number} amount 出金額
   */
  public pay(amount: number): void {
    this.accounting(amount, Operation.pay);
    this.operationLog(this.processingDateTime(new Date()), Operation.pay, amount, this.commission, this.balance);
  }

  /**
   * 入出金の履歴を提供する.
   * 日時
   * 金額: 入金は正の数, 出金は負の数で出力
   * 入出金操作後の残高
   *
   * @returns {string} Array<History>
   */
  public getHistory(): Array<History> {
    return this.log.reverse();
  }

  private operationLog(
    dateTime: string,
    operationType: string,
    operationAmount: number,
    commission: number,
    balance: number,
  ): void {
    const amount = operationType === Operation.pay ? 0 - operationAmount : operationAmount;
    this.log.push({ dateTime: dateTime, operationAmount: amount, commission: commission, balance: balance });
  }

  private processingDateTime(date: Date): string {
    const FORMAT = 'YYYY-MM-DD HH:mm:ss';
    const TIME_ZONE_TOKYO = 'Asia/Tokyo';
    return formatToTimeZone(date, FORMAT, { timeZone: TIME_ZONE_TOKYO });
  }

  private accounting(amount: number, operationType: string): void {
    let balance = 0;
    this.verifiedInput(amount.toString());
    if (Operation.receive === operationType) {
      balance = this.balance + amount;
    }

    if (Operation.pay === operationType) {
      if (this.balance < amount) {
        throw new Error(
          `指定した ${amount} 円では、 現在の残高である ${this.balance} を超えて出金することはできません。出金額をご確認ください。`,
        );
      }
      balance = this.balance - amount;
    }

    if (balance - this.commission < 0) {
      throw new Error(
        `${operationType}処理の手数料(${this.commission})を引こうとして残高が0円未満になりました。${operationType}処理を中止します。`,
      );
    }

    this.balance = balance - this.commission;
  }

  private verifiedInput(amount: string): void {
    if (!this.numberPattern.test(amount)) {
      throw new Error(`指定された ${amount} は有効な値ではありません。入力内容をご確認ください。`);
    }
  }
}

export { Wallet };
