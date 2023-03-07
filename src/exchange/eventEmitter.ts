type Unsubscribe = () => void;
export type ListenerCallback<Args = any> = (args: Args) => void;

export class EventEmitter {
  private listeners: Array<ListenerCallback> = [];

  subscribe = (action: ListenerCallback): Unsubscribe => {
    this.listeners.push(action);
    let removed = false;
    return () => {
      if (removed) {
        return;
      }
      removed = true;
      this.remove(action);
    };
  };

  remove = (action: ListenerCallback) => {
    for (let i = 0; i < this.listeners.length; ++i) {
      if (action === this.listeners[i]) {
        this.listeners.splice(i, 1);
        return;
      }
    }
  };

  emit = <Args = any>(args: Args) => {
    this.listeners.slice(0).forEach((listener) => {
      listener.call(listener, args);
    });
  };
}
