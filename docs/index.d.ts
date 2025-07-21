export declare enum Hand {
    GU = "GU",
    CHOKI = "CHOKI",
    PA = "PA"
}
export declare enum Result {
    P1_WIN = "P1_WIN",
    P2_WIN = "P2_WIN",
    DRAW = "DRAW"
}
export declare enum JankenEvent {
    BeforeRound = "beforeRound",
    AfterRound = "afterRound",
    GameStarted = "gameStarted",
    HandsNotSet = "handsNotSet",
    PlayerHandUpdated = "playerHandUpdated"
}
export declare enum GamePhase {
    Ready = "READY",
    Playing = "PLAYING",
    RoundEnd = "ROUND_END"
}
export declare class Janken {
    private _listeners;
    private _currentPhase;
    on(eventName: JankenEvent, listener: Function): void;
    off(eventName: JankenEvent, listener: Function): void;
    private emit;
    private player1Hand;
    private player2Hand;
    private lastResult;
    playRound(): {
        result: Result;
    } | null;
    setPlayer1Hand(hand: Hand): void;
    setPlayer2Hand(hand: Hand): void;
    getLastResult(): Result | null;
    startGame(): void;
    getPlayer1Hand(): Hand | null;
    getPlayer2Hand(): Hand | null;
    getPhase(): GamePhase;
    areHandsSet(): boolean;
    private _determineWinner;
}
