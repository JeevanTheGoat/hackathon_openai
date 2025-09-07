package com.example.demo.entities.enums;

public enum DebateRound {
    OPENING_STATEMENT,
    REBUTTAL,
    CLOSING_STATEMENT;

    // Helper method to get next round
    public DebateRound next() {
        DebateRound[] rounds = values();
        int nextIndex = (this.ordinal() + 1) % rounds.length;
        return rounds[nextIndex];
    }
}
