/**
 * Wallet Operation Test.
 *
 * Copyright (c) 2022.
 * Kenichi Inoue.
 */
import { Wallet } from '../src/wallet';

describe(`Wallet class Unit Test Cases. `, () => {
  test(`Wallet.getCurrentBalance() is 10000.`, () => {
    const sut = new Wallet(10000);
    const actual = sut.getCurrentBalance();
    expect(actual).toEqual(10000);
  });

  test(`Wallet.getCurrentBalance() is 1900.`, () => {
    const sut = new Wallet(10000);
    sut.pay(8000);
    const actual = sut.getCurrentBalance();
    expect(actual).toEqual(1900);
  });

  test(`Wallet.getCurrentBalance() is 19900.`, () => {
    const sut = new Wallet(10000);
    sut.receive(10000);
    const actual = sut.getCurrentBalance();
    expect(actual).toEqual(19900);
  });

  test(`Wallet.getHistory() contains order by [ operation 2 , operation 1 ].`, () => {
    const sut = new Wallet(10000);
    Object.defineProperty(sut, 'processingDateTime', {
      value: jest.fn(() => '2022-01-20 18:23:50'),
    });
    sut.receive(10000);
    sut.pay(8000);
    const actual = sut.getHistory();
    expect(actual).toEqual(
      expect.arrayContaining([
        { balance: 11800, commission: 100, dateTime: '2022-01-20 18:23:50', operationAmount: -8000 },
        { balance: 19900, commission: 100, dateTime: '2022-01-20 18:23:50', operationAmount: 10000 },
      ]),
    );
  });

  test(`Wallet.receive(-1) is Error.`, () => {
    const sut = new Wallet(10000);
    expect(() => sut.receive(-1)).toThrowError(
      new Error('指定された -1 は有効な値ではありません。入力内容をご確認ください。'),
    );
  });

  test(`When Wallet.getCurrentBalance() is 100, Wallet.pay(1000) is Error.`, () => {
    const sut = new Wallet(100);
    expect(() => sut.pay(1000)).toThrowError(
      new Error(
        '指定した 1000 円では、 現在の残高である 100 を超えて出金することはできません。出金額をご確認ください。',
      ),
    );
  });

  test(`When Wallet.getCurrentBalance() is 200, Wallet.pay(200) is Error.`, () => {
    const sut = new Wallet(200);
    expect(() => sut.pay(200)).toThrowError(
      new Error('出金処理の手数料(100)を引こうとして残高が0円未満になりました。出金処理を中止します。'),
    );
  });
});
