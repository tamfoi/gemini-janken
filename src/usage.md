## Jankenクラスの利用方法

```javascript
import { Janken, Hand, Result, JankenEvent, GamePhase } from './index';

const janken = new Janken();

// イベントリスナーの登録
janken.on(JankenEvent.BeforeRound, () => {
  console.log('新しいラウンドが始まります。');
});

janken.on(JankenEvent.AfterRound, (result: Result) => {
  console.log(`ラウンドが終了しました。結果: ${result}`);
});

janken.on(JankenEvent.Reset, () => {
  console.log('じゃんけんの状態がリセットされました。');
});

janken.on(JankenEvent.HandsNotSet, () => {
  console.log('手が出揃っていません。両方のプレイヤーの手を設定してください。');
});

// 現在のゲームフェーズを取得
console.log(`現在のフェーズ: ${janken.getPhase()}`); // READY

// プレイヤー1の手を設定
janken.setPlayer1Hand(Hand.GU);
console.log(`現在のフェーズ: ${janken.getPhase()}`); // READY (まだ両方の手が出揃っていないため)

// プレイヤー2の手を設定
janken.setPlayer2Hand(Hand.CHOKI);
console.log(`現在のフェーズ: ${janken.getPhase()}`); // PLAYING

// 勝敗を判定
const result = janken.playRound();
console.log(result); // { result: "P1_WIN" }
console.log(`現在のフェーズ: ${janken.getPhase()}`); // ROUND_END

// 直前の勝敗を取得
const lastResult = janken.getLastResult();
console.log(lastResult); // "P1_WIN"

// 状態をリセット
janken.reset();
console.log(janken.getLastResult()); // null
console.log(`現在のフェーズ: ${janken.getPhase()}`); // READY

// イベントリスナーの解除
const myListener = () => console.log('これは解除されるリスナーです。');
janken.on('someEvent', myListener);
janken.off('someEvent', myListener);
```