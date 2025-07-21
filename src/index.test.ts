import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Janken, Hand, Result, JankenEvent, GamePhase } from '../src/index';

describe('Janken', () => {
  let janken: Janken;

  beforeEach(() => {
    janken = new Janken();
  });

  it('プレイヤー1が勝つ場合にP1_WINを返す', () => {
    janken.setPlayer1Hand(Hand.GU);
    janken.setPlayer2Hand(Hand.CHOKI);
    expect(janken.playRound()).toEqual({ result: Result.P1_WIN });

    janken.setPlayer1Hand(Hand.CHOKI);
    janken.setPlayer2Hand(Hand.PA);
    expect(janken.playRound()).toEqual({ result: Result.P1_WIN });

    janken.setPlayer1Hand(Hand.PA);
    janken.setPlayer2Hand(Hand.GU);
    expect(janken.playRound()).toEqual({ result: Result.P1_WIN });
  });

  it('プレイヤー2が勝つ場合にP2_WINを返す', () => {
    janken.setPlayer1Hand(Hand.GU);
    janken.setPlayer2Hand(Hand.PA);
    expect(janken.playRound()).toEqual({ result: Result.P2_WIN });

    janken.setPlayer1Hand(Hand.CHOKI);
    janken.setPlayer2Hand(Hand.GU);
    expect(janken.playRound()).toEqual({ result: Result.P2_WIN });

    janken.setPlayer1Hand(Hand.PA);
    janken.setPlayer2Hand(Hand.CHOKI);
    expect(janken.playRound()).toEqual({ result: Result.P2_WIN });
  });

  it('引き分けの場合にDRAWを返す', () => {
    janken.setPlayer1Hand(Hand.GU);
    janken.setPlayer2Hand(Hand.GU);
    expect(janken.playRound()).toEqual({ result: Result.DRAW });

    janken.setPlayer1Hand(Hand.CHOKI);
    janken.setPlayer2Hand(Hand.CHOKI);
    expect(janken.playRound()).toEqual({ result: Result.DRAW });

    janken.setPlayer1Hand(Hand.PA);
    janken.setPlayer2Hand(Hand.PA);
    expect(janken.playRound()).toEqual({ result: Result.DRAW });
  });

  it('手が出揃っていない場合にnullを返す', () => {
    expect(janken.playRound()).toBeNull();
  });

  it('直前の結果を返す', () => {
    expect(janken.getLastResult()).toBeNull();
    janken.setPlayer1Hand(Hand.GU);
    janken.setPlayer2Hand(Hand.CHOKI);
    janken.playRound();
    expect(janken.getLastResult()).toEqual(Result.P1_WIN);

    janken.setPlayer1Hand(Hand.GU);
    janken.setPlayer2Hand(Hand.PA);
    janken.playRound();
    expect(janken.getLastResult()).toEqual(Result.P2_WIN);

    janken.setPlayer1Hand(Hand.GU);
    janken.setPlayer2Hand(Hand.GU);
    janken.playRound();
    expect(janken.getLastResult()).toEqual(Result.DRAW);
  });

  it('直前の結果と手をリセットする', () => {
    janken.setPlayer1Hand(Hand.GU);
    janken.setPlayer2Hand(Hand.CHOKI);
    janken.playRound();
    expect(janken.getLastResult()).toEqual(Result.P1_WIN);
    janken.reset();
    expect(janken.getLastResult()).toBeNull();
    expect(janken.getPlayer1Hand()).toBeNull();
    expect(janken.getPlayer2Hand()).toBeNull();
  });

  it('"beforeRound"と"afterRound"イベントを発火する', () => {
    const beforeRoundListener = vi.fn();
    const afterRoundListener = vi.fn();

    janken.on(JankenEvent.BeforeRound, beforeRoundListener);
    janken.on(JankenEvent.AfterRound, afterRoundListener);

    janken.setPlayer1Hand(Hand.GU);
    janken.setPlayer2Hand(Hand.CHOKI);
    janken.playRound();

    expect(beforeRoundListener).toHaveBeenCalledTimes(1);
    expect(afterRoundListener).toHaveBeenCalledTimes(1);
    expect(afterRoundListener).toHaveBeenCalledWith(Result.P1_WIN);
  });

  it('"reset"イベントを発火する', () => {
    const resetListener = vi.fn();
    janken.on(JankenEvent.Reset, resetListener);

    janken.setPlayer1Hand(Hand.GU);
    janken.setPlayer2Hand(Hand.CHOKI);
    janken.playRound();
    janken.reset();

    expect(resetListener).toHaveBeenCalledTimes(1);
  });

  it('手が出揃っていないときに"handsNotSet"イベントを発火する', () => {
    const handsNotSetListener = vi.fn();
    janken.on(JankenEvent.HandsNotSet, handsNotSetListener);

    janken.setPlayer1Hand(Hand.GU);
    janken.playRound(); // player2HandがnullなのでhandsNotSetが発火する

    expect(handsNotSetListener).toHaveBeenCalledTimes(1);
  });

  it('現在のゲームフェーズを返す', () => {
    expect(janken.getPhase()).toEqual(GamePhase.Ready);

    janken.setPlayer1Hand(Hand.GU);
    expect(janken.getPhase()).toEqual(GamePhase.Ready);

    janken.setPlayer2Hand(Hand.CHOKI);
    expect(janken.getPhase()).toEqual(GamePhase.Playing);

    janken.playRound();
    expect(janken.getPhase()).toEqual(GamePhase.RoundEnd);

    janken.reset();
    expect(janken.getPhase()).toEqual(GamePhase.Ready);
  });
});