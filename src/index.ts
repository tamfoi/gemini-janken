export enum Hand {
  GU = "GU",
  CHOKI = "CHOKI",
  PA = "PA",
}

export enum Result {
  P1_WIN = "P1_WIN",
  P2_WIN = "P2_WIN",
  DRAW = "DRAW",
}



export enum JankenEvent {
  BeforeRound = "beforeRound",
  AfterRound = "afterRound",
  Reset = "reset",
  HandsNotSet = "handsNotSet",
}

export enum GamePhase {
  Ready = "READY",
  Playing = "PLAYING",
  RoundEnd = "ROUND_END",
}

export class Janken {
  private _listeners: { [key: string]: Function[] } = {};
  private _currentPhase: GamePhase = GamePhase.Ready;

  on(eventName: JankenEvent, listener: Function): void {
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = [];
    }
    this._listeners[eventName].push(listener);
  }

  off(eventName: JankenEvent, listener: Function): void {
    if (!this._listeners[eventName]) {
      return;
    }
    this._listeners[eventName] = this._listeners[eventName].filter(
      (l) => l !== listener
    );
  }

  private emit(eventName: JankenEvent, ...args: any[]): void {
    if (!this._listeners[eventName]) {
      return;
    }
    this._listeners[eventName].forEach((listener) => {
      listener(...args);
    });
  }
  private player1Hand: Hand | null = null;
  private player2Hand: Hand | null = null;
  private lastResult: Result | null = null;

  playRound(): { result: Result } | null {
    this.emit(JankenEvent.BeforeRound);

    if (this.player1Hand === null || this.player2Hand === null) {
      this.emit(JankenEvent.HandsNotSet);
      return null; // 両方の手が出されていない場合は判定できない
    }

    let currentResult: Result;

    if (this.player1Hand === this.player2Hand) {
      currentResult = Result.DRAW;
    } else if (
      (this.player1Hand === Hand.GU && this.player2Hand === Hand.CHOKI) ||
      (this.player1Hand === Hand.CHOKI && this.player2Hand === Hand.PA) ||
      (this.player1Hand === Hand.PA && this.player2Hand === Hand.GU)
    ) {
      currentResult = Result.P1_WIN;
    } else {
      currentResult = Result.P2_WIN;
    }

    this.lastResult = currentResult;
    this.emit(JankenEvent.AfterRound, currentResult);
    this._currentPhase = GamePhase.RoundEnd;
    return { result: currentResult };
  }

  setPlayer1Hand(hand: Hand): void {
    this.player1Hand = hand;
    if (this.player1Hand !== null && this.player2Hand !== null) {
      this._currentPhase = GamePhase.Playing;
    }
  }

  setPlayer2Hand(hand: Hand): void {
    this.player2Hand = hand;
    if (this.player1Hand !== null && this.player2Hand !== null) {
      this._currentPhase = GamePhase.Playing;
    }
  }

  getLastResult(): Result | null {
    return this.lastResult;
  }

  reset(): void {
    this.lastResult = null;
    this.player1Hand = null;
    this.player2Hand = null;
    this._currentPhase = GamePhase.Ready;
    this.emit(JankenEvent.Reset);
  }

  getPlayer1Hand(): Hand | null {
    return this.player1Hand;
  }

  getPlayer2Hand(): Hand | null {
    return this.player2Hand;
  }

  getPhase(): GamePhase {
    return this._currentPhase;
  }
}