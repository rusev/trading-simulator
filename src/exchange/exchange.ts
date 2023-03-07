import {
  Order,
  OrderLike,
  parseOrder,
  OrderTrade,
  OrderFill,
  Side
} from "./order";
import { OrderBook } from "./orderBook";
import { EventEmitter, ListenerCallback } from "./eventEmitter";

function createFill(trade: OrderTrade, side: Side): OrderFill {
  const key = `${side.toLowerCase()}Order`;
  const order = (trade as any)[key] as Order;
  const status = trade.quantity === order.quantity ? "Fill" : "Partial Fill";
  return {
    ...order,
    quantity: trade.quantity,
    price: trade.price,
    timestamp: Date.now(),
    status
  };
}

export class StockExchange {
  private orderBooks = new Map<string, OrderBook>();
  private events = new EventEmitter();

  getOrderBook(symbol: string): OrderBook {
    if (!this.orderBooks.has(symbol)) {
      this.orderBooks.set(symbol, new OrderBook());
    }

    return this.orderBooks.get(symbol) as OrderBook;
  }

  placeOrder(orderLike: OrderLike) {
    const order = parseOrder(orderLike);
    this.changeToWorking(order);

    const orderBook = this.getOrderBook(order.symbol);
    orderBook.add(order);

    const trades = orderBook.match();
    this.notifyTrades(trades);
    //return trades;
  }

  subscribe(
    callback: ListenerCallback<{
      type: string;
      order?: Order;
      fill?: OrderFill;
    }>
  ) {
    return this.events.subscribe(callback);
  }

  private notifyTrades(trades: OrderTrade[]) {
    trades.forEach((trade) => {
      const buyFill = createFill(trade, "BUY");
      this.events.emit({
        type: "StatusChanged",
        fill: buyFill
      });

      const sellFill = createFill(trade, "SELL");
      this.events.emit({
        type: "StatusChanged",
        fill: sellFill
      });
    });
  }

  private changeToWorking(order: Order) {
    order.status = "Working";
    this.events.emit({
      type: "StatusChanged",
      order
    });
  }
}
