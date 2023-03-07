import { createMaxHeap, createMinHeap } from "./heap";
import type { Order, OrderTrade } from "./order";

export class OrderBook {
  private bids = createMaxHeap<Order>((a, b) => a.price - b.price);
  private asks = createMinHeap<Order>((a, b) => a.price - b.price);

  dumpBids() {
    this.bids.dump("Bids");
  }

  dumpAsks() {
    this.asks.dump("Asks");
  }

  add(order: Order) {
    if (order.side === "BUY") {
      this.bids.insert(order);
    } else {
      this.asks.insert(order);
    }
  }

  match() {
    const trades: OrderTrade[] = [];
    while (this.bids.size() && this.asks.size()) {
      const buy = this.bids.peek()!;
      const sell = this.asks.peek()!;

      if (buy.price >= sell.price) {
        const tradeQuantity = Math.min(buy.quantity, sell.quantity);
        const trade: OrderTrade = {
          buyOrder: { ...buy },
          sellOrder: { ...sell },
          price: sell.price,
          quantity: tradeQuantity
        };
        trades.push(trade);

        buy.quantity -= tradeQuantity;
        sell.quantity -= tradeQuantity;
        //Partial Fill for both buy and sell order
        if (buy.quantity === 0) {
          // Full fill
          this.bids.extract();
        }
        if (sell.quantity === 0) {
          // Full fill
          this.asks.extract();
        }
      } else {
        break;
      }
    }

    return trades;
  }
}
