/**
 * HistoryManager - Handles undo/redo functionality
 */

export class HistoryManager {
  constructor(maxSize = 50) {
    this.undoStack = [];
    this.redoStack = [];
    this.maxSize = maxSize;
    this.isBatching = false;
    this.currentBatch = [];
  }

  push(action) {
    if (this.isBatching) {
      this.currentBatch.push(action);
      return;
    }
    this.undoStack.push(action);
    this.redoStack = []; // Clear redo stack on new action

    // Limit stack size
    if (this.undoStack.length > this.maxSize) {
      this.undoStack.shift();
    }

    this.updateButtons();
  }

  startBatch() {
    this.isBatching = true;
    this.currentBatch = [];
  }

  endBatch(batchType = "batch") {
    this.isBatching = false;
    if (this.currentBatch.length > 0) {
      const batchAction = {
        type: batchType,
        actions: this.currentBatch,
      };
      this.undoStack.push(batchAction);
      this.redoStack = [];
      if (this.undoStack.length > this.maxSize) {
        this.undoStack.shift();
      }
      this.updateButtons();
    }
    this.currentBatch = [];
  }

  undo() {
    if (this.undoStack.length === 0) return null;

    const action = this.undoStack.pop();
    this.redoStack.push(action);
    this.updateButtons();

    return action;
  }

  redo() {
    if (this.redoStack.length === 0) return null;

    const action = this.redoStack.pop();
    this.undoStack.push(action);
    this.updateButtons();

    return action;
  }

  canUndo() {
    return this.undoStack.length > 0;
  }

  canRedo() {
    return this.redoStack.length > 0;
  }

  clear() {
    this.undoStack = [];
    this.redoStack = [];
    this.updateButtons();
  }

  updateButtons() {
    const undoBtn = document.getElementById("btn-undo");
    const redoBtn = document.getElementById("btn-redo");

    if (undoBtn) {
      undoBtn.disabled = !this.canUndo();
    }
    if (redoBtn) {
      redoBtn.disabled = !this.canRedo();
    }
  }
}
