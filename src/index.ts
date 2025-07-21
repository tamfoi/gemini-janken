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
  GameStarted = "gameStarted",
  HandsNotSet = "handsNotSet",
  PlayerHandUpdated = "playerHandUpdated",
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

    let currentResult: Result = this._determineWinner(this.player1Hand, this.player2Hand);

    this.lastResult = currentResult;
    this.emit(JankenEvent.AfterRound, currentResult);
    this._currentPhase = GamePhase.RoundEnd;
    return { result: currentResult };
  }

  setPlayer1Hand(hand: Hand): void {
    this.player1Hand = hand;
    this.emit(JankenEvent.PlayerHandUpdated, 1, hand);
    if (this.player1Hand !== null && this.player2Hand !== null) {
      this._currentPhase = GamePhase.Playing;
    }
  }

  setPlayer2Hand(hand: Hand): void {
    this.player2Hand = hand;
    this.emit(JankenEvent.PlayerHandUpdated, 2, hand);
    if (this.player1Hand !== null && this.player2Hand !== null) {
      this._currentPhase = GamePhase.Playing;
    }
  }

  getLastResult(): Result | null {
    return this.lastResult;
  }

  startGame(): void {
    this.lastResult = null;
    this.player1Hand = null;
    this.player2Hand = null;
    this._currentPhase = GamePhase.Ready;
    this.emit(JankenEvent.GameStarted);
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

  areHandsSet(): boolean {
    return this.player1Hand !== null && this.player2Hand !== null;
  }

  private _determineWinner(player1Hand: Hand, player2Hand: Hand): Result {
    if (player1Hand === player2Hand) {
      return Result.DRAW;
    } else if (
      (player1Hand === Hand.GU && player2Hand === Hand.CHOKI) ||
      (player1Hand === Hand.CHOKI && player2Hand === Hand.PA) ||
      (player1Hand === Hand.PA && player2Hand === Hand.GU)
    ) {
      return Result.P1_WIN;
    } else {
      return Result.P2_WIN;
    }
  }
}