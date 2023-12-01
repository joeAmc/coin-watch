import { rest } from "msw";

export const handlers = [
  rest.get("https://api.coincap.io/v2/assets", (req, res, ctx) => {
    console.log("coincap req made!");
    return res(
      ctx.json({
        data: [
          {
            id: "bitcoin",
            rank: "1",
            symbol: "BTC",
            name: "Bitcoin",
            supply: "19546881.0000000000000000",
            maxSupply: "21000000.0000000000000000",
            marketCapUsd: "715787695379.5855066564357272",
            volumeUsd24Hr: "2550760785.0713546961136179",
            priceUsd: "36619.0235352425538712",
            changePercent24Hr: "-0.1435906869690486",
            vwap24Hr: "36714.2887715542769635",
            explorer: "https://blockchain.info/",
          },
          {
            id: "ethereum",
            rank: "2",
            symbol: "ETH",
            name: "Ethereum",
            supply: "120252683.5477615300000000",
            maxSupply: null,
            marketCapUsd: "236490714324.1463334204251736",
            volumeUsd24Hr: "2303500304.2103094021965621",
            priceUsd: "1966.6148592036850373",
            changePercent24Hr: "0.6958863040627620",
            vwap24Hr: "1964.2168207705098721",
            explorer: "https://etherscan.io/",
          },
          {
            id: "yearn-finance",
            rank: "100",
            symbol: "YFI",
            name: "yearn.finance",
            supply: "33231.6505447700000000",
            maxSupply: "36666.0000000000000000",
            marketCapUsd: "305564475.3511318871246724",
            volumeUsd24Hr: "84986360.8730221202395294",
            priceUsd: "9194.9834071429127478",
            changePercent24Hr: "1.1712662115789301",
            vwap24Hr: "9466.3720277698552132",
            explorer:
              "https://etherscan.io/token/0x0bc529c00c6401aef6d220be8c6ea1667f6ad93e",
          },
        ],
        timestamp: 1700408163364,
      })
    );
  }),

  rest.get("http://localhost:4000/coins/6550aef4bff6ff1f42769fbd", function*(
    req,
    res,
    ctx
  ) {
    console.log("coins fetched!");
    yield res(
      ctx.json([
        {
          _id: "65270d9f257cd0a7b40daa96",
          name: "Ethereum Classic",
          ticker: "etc",
          user_id: "65270cdd257cd0a7b40daa8a",
          amount: 200,
          __v: 0,
        },
        {
          _id: "65270e70257cd0a7b40daa9b",
          name: "binance-coin",
          ticker: "bnb",
          user_id: "65270cdd257cd0a7b40daa8a",
          amount: 10,
          __v: 0,
        },
      ])
    );
  }),
  rest.put(
    "http://localhost:4000/coin/update/65270d9f257cd0a7b40daa96",
    (req, res, ctx) => {
      return res(
        ctx.json({
          amount: 500,
        })
      );
    }
  ),
  rest.delete(
    "http://localhost:4000/coin/delete/65270d9f257cd0a7b40daa96",
    (req, res, ctx) => {
      console.log("delete req made!");
      return res(ctx.json({ message: "Deleted successfully" }));
    }
  ),
];
