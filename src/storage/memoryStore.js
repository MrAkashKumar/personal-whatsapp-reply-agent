export class MemoryStore {
  constructor(options = {}) {
    this.maxHistoryTurns = options.maxHistoryTurns || 12;
    this.maxSeenMessages = options.maxSeenMessages || 1000;
    this.seenMessages = new Map();
    this.conversations = new Map();
  }

  hasMessage(messageId) {
    this.trimSeenMessages();
    return this.seenMessages.has(messageId);
  }

  markMessage(messageId) {
    this.seenMessages.set(messageId, Date.now());
    this.trimSeenMessages();
  }

  getConversation(senderId) {
    return [...(this.conversations.get(senderId) || [])];
  }

  addTurn(senderId, turn) {
    const current = this.conversations.get(senderId) || [];
    current.push(turn);
    this.conversations.set(senderId, current.slice(-this.maxHistoryTurns));
  }

  trimSeenMessages() {
    if (this.seenMessages.size <= this.maxSeenMessages) {
      return;
    }

    const sorted = [...this.seenMessages.entries()].sort((a, b) => a[1] - b[1]);
    const removeCount = sorted.length - this.maxSeenMessages;

    for (const [messageId] of sorted.slice(0, removeCount)) {
      this.seenMessages.delete(messageId);
    }
  }
}
