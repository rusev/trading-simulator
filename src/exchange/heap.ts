type Comparer<T> = (a: T, b: T) => number;

class Heap<T> {
  private heap: T[] = [];
  private comparer: Comparer<T>;

  constructor(comparer: Comparer<T>) {
    this.comparer = comparer;
  }

  size() {
    return this.heap.length;
  }

  isEmpty() {
    return this.size() === 0;
  }

  peek(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    return this.heap[0];
  }

  insert(value: T) {
    this.heap.push(value);
    this.bubbleUp(this.size() - 1);
  }

  extract(): T | null {
    if (this.isEmpty()) {
      return null;
    }

    const min = this.heap[0];
    const last = this.heap.pop();
    if (!this.isEmpty()) {
      this.heap[0] = last as T;
      this.sinkDown(0);
    }
    return min;
  }

  dump(msg?: string) {
    console.log(msg, this.heap);
  }

  private bubbleUp(index: number) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.comparer(this.heap[index], this.heap[parentIndex]) >= 0) {
        break;
      }
      this.swap(index, parentIndex);
      index = parentIndex;
    }
  }

  private sinkDown(index: number) {
    while (true) {
      const leftChildIndex = 2 * index + 1;
      const rightChildIndex = 2 * index + 2;
      let smallerChildIndex = index;

      if (
        leftChildIndex < this.size() &&
        this.comparer(this.heap[leftChildIndex], this.heap[smallerChildIndex]) <
          0
      ) {
        smallerChildIndex = leftChildIndex;
      }

      if (
        rightChildIndex < this.size() &&
        this.comparer(
          this.heap[rightChildIndex],
          this.heap[smallerChildIndex]
        ) < 0
      ) {
        smallerChildIndex = rightChildIndex;
      }

      if (smallerChildIndex === index) {
        break;
      }

      this.swap(index, smallerChildIndex);
      index = smallerChildIndex;
    }
  }

  private swap(i: number, j: number) {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}

export const createMinHeap = <T>(comparer: Comparer<T>) => {
  return new Heap(comparer);
};

const reverseComparer = <T>(comparer: Comparer<T>): Comparer<T> => (
  a: T,
  b: T
) => {
  return comparer(b, a);
};

export const createMaxHeap = <T>(comparer: Comparer<T>) => {
  return new Heap(reverseComparer(comparer));
};
