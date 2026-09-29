import { loadState, saveState, clearState } from './storage.js';
import { INITIAL_STATE } from '../types/schemas.js';

class StateManager {
  constructor() {
    this.state = loadState();
    this.listeners = new Set();
  }

  getState() {
    return {
      ...INITIAL_STATE,
      ...(this.state || {})
    };
  }

  setState(partialOrFn) {
    const prevState = this.getState();
    const partial = typeof partialOrFn === 'function' ? partialOrFn(prevState) : partialOrFn;
    const nextState = { ...prevState, ...partial };
    
    this.state = nextState;
    saveState(this.state);
    this.notify(nextState, prevState);
    return this.getState();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify(nextState, prevState) {
    for (const listener of this.listeners) {
      try {
        listener(nextState, prevState);
      } catch (err) {
        console.error('Error in state listener:', err);
      }
    }
  }

  reset() {
    clearState();
    this.state = loadState();
    this.notify(this.state, null);
  }
}

export const store = new StateManager();
