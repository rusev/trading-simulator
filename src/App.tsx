import "./styles.css";
import { StockExchange } from "./exchange/exchange";

type D = { p: number };
export default function App() {
  //const mi = createMaxHeap<D>((a, b) => a.p - b.p);
  //mi.insert({ p: 5 });
  //mi.insert({ p: 25 });
  //mi.insert({ p: 1 });
  console.clear();
  const exc = new StockExchange();
  exc.subscribe((e) => console.log(JSON.stringify(e, null, 2)));

  exc.placeOrder({
    symbol: "MSFT",
    quantity: 100,
    price: 100,
    type: "LIMIT",
    side: "BUY",
    status: "NEW"
  });

  exc.placeOrder({
    symbol: "MSFT",
    quantity: 500,
    price: 500,
    type: "LIMIT",
    side: "BUY",
    status: "NEW"
  });

  exc.getOrderBook("MSFT").dumpBids();

  exc.placeOrder({
    symbol: "MSFT",
    quantity: 2000,
    price: 99,
    type: "LIMIT",
    side: "SELL",
    status: "NEW"
  });

  exc.placeOrder({
    symbol: "MSFT",
    quantity: 2000,
    price: 99,
    type: "MARKET",
    side: "BUY",
    status: "NEW"
  });

  exc.placeOrder({
    symbol: "MSFT",
    quantity: 600,
    type: "LIMIT",
    price: 1,
    side: "SELL",
    status: "NEW"
  });

  exc.getOrderBook("MSFT").dumpBids();
  exc.getOrderBook("MSFT").dumpAsks();

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>Start editing to see some magic happen!</h2>
    </div>
  );
}
