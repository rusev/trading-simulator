const OrderType = {
  MARKET: "MARKET",
  LIMIT: "LIMIT"
} as const;

type OrderType = keyof typeof OrderType;

const Side = {
  BUY: "BUY",
  SELL: "SELL"
} as const;
export type Side = keyof typeof Side;

type OrderStatus = string;

interface OrderBase {
  readonly symbol: string;
  readonly side: Side;
  // readonly type: OrderType; // market or limit - can be amended
  quantity: number; // quantity of the order (slice) - can be amended
  // price: number; // optional for market orders
  status: OrderStatus; // status of the order (slice) in the OMS or exchange (when submitted)
  [key: string]: unknown;
}

type WithPrice<T> = T & {
  readonly price: number;
};
type MarketOrder = OrderBase & {
  readonly type: typeof OrderType["MARKET"];
};
type LimitOrder = OrderBase &
  WithPrice<{
    readonly type: typeof OrderType["LIMIT"];
  }>;

type Prettify<T> = { [K in keyof T]: T[K] } & {};

export type OrderLike = Prettify<MarketOrder | LimitOrder>;
export type Order = Prettify<WithPrice<MarketOrder> | LimitOrder>;
export interface OrderTrade {
  buyOrder: Order;
  sellOrder: Order;
  price: number;
  quantity: number;
}

export interface OrderFill extends OrderBase {
  // readonly orderId: string; // id of the (child) order (slice) in the exchange
  readonly quantity: number; // quantity filled
  readonly price: number; // price at which the order was filled
  readonly timestamp: number; // timestamp of the fill (in milliseconds)
}

export const parseOrder = (order: OrderLike): Order => {
  if (order.type === "MARKET") {
    order.price =
      order.side === "SELL"
        ? Number.NEGATIVE_INFINITY
        : Number.POSITIVE_INFINITY;
  }

  return order as Order;
};
