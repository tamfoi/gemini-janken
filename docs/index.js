export var Hand;
(function (Hand) {
    Hand["GU"] = "GU";
    Hand["CHOKI"] = "CHOKI";
    Hand["PA"] = "PA";
})(Hand || (Hand = {}));
export var Result;
(function (Result) {
    Result["P1_WIN"] = "P1_WIN";
    Result["P2_WIN"] = "P2_WIN";
    Result["DRAW"] = "DRAW";
})(Result || (Result = {}));
export var JankenEvent;
(function (JankenEvent) {
    JankenEvent["BeforeRound"] = "beforeRound";
    JankenEvent["AfterRound"] = "afterRound";
    JankenEvent["GameStarted"] = "gameStarted";
    JankenEvent["HandsNotSet"] = "handsNotSet";
    JankenEvent["PlayerHandUpdated"] = "playerHandUpdated";
})(JankenEvent || (JankenEvent = {}));
export var GamePhase;
(function (GamePhase) {
    GamePhase["Ready"] = "READY";
    GamePhase["Playing"] = "PLAYING";
    GamePhase["RoundEnd"] = "ROUND_END";
})(GamePhase || (GamePhase = {}));
export class Janken {
    constructor() {
        this._listeners = {};
        this._currentPhase = GamePhase.Ready;
        this.player1Hand = null;
        this.player2Hand = null;
        this.lastResult = null;
    }
    on(eventName, listener) {
        if (!this._listeners[eventName]) {
            this._listeners[eventName] = [];
        }
        this._listeners[eventName].push(listener);
    }
    off(eventName, listener) {
        if (!this._listeners[eventName]) {
            return;
        }
        this._listeners[eventName] = this._listeners[eventName].filter((l) => l !== listener);
    }
    emit(eventName, ...args) {
        if (!this._listeners[eventName]) {
            return;
        }
        this._listeners[eventName].forEach((listener) => {
            listener(...args);
        });
    }
    playRound() {
        this.emit(JankenEvent.BeforeRound);
        if (this.player1Hand === null || this.player2Hand === null) {
            this.emit(JankenEvent.HandsNotSet);
            return null; // 両方の手が出されていない場合は判定できない
        }
        let currentResult = this._determineWinner(this.player1Hand, this.player2Hand);
        this.lastResult = currentResult;
        this.emit(JankenEvent.AfterRound, currentResult);
        this._currentPhase = GamePhase.RoundEnd;
        return { result: currentResult };
    }
    setPlayer1Hand(hand) {
        this.player1Hand = hand;
        this.emit(JankenEvent.PlayerHandUpdated, 1, hand);
        if (this.player1Hand !== null && this.player2Hand !== null) {
            this._currentPhase = GamePhase.Playing;
        }
    }
    setPlayer2Hand(hand) {
        this.player2Hand = hand;
        this.emit(JankenEvent.PlayerHandUpdated, 2, hand);
        if (this.player1Hand !== null && this.player2Hand !== null) {
            this._currentPhase = GamePhase.Playing;
        }
    }
    getLastResult() {
        return this.lastResult;
    }
    startGame() {
        this.lastResult = null;
        this.player1Hand = null;
        this.player2Hand = null;
        this._currentPhase = GamePhase.Ready;
        this.emit(JankenEvent.GameStarted);
    }
    getPlayer1Hand() {
        return this.player1Hand;
    }
    getPlayer2Hand() {
        return this.player2Hand;
    }
    getPhase() {
        return this._currentPhase;
    }
    areHandsSet() {
        return this.player1Hand !== null && this.player2Hand !== null;
    }
    _determineWinner(player1Hand, player2Hand) {
        if (player1Hand === player2Hand) {
            return Result.DRAW;
        }
        else if ((player1Hand === Hand.GU && player2Hand === Hand.CHOKI) ||
            (player1Hand === Hand.CHOKI && player2Hand === Hand.PA) ||
            (player1Hand === Hand.PA && player2Hand === Hand.GU)) {
            return Result.P1_WIN;
        }
        else {
            return Result.P2_WIN;
        }
    }
}
