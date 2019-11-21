# MakerDAO Permafeed

Track **MakerDAO** platform data statistics.
Stats are pulled directly from the Ethereum blockchain and stored in **Arweave** for faster
historical querying.

## Demo graph

For realtime graphs, please go [here](https://bakaoh.com/MkrPermafeed/client/#demo)

![graph](/graph.png "graph")

## What's included

Data is archived from address `nSe8ZKhDu3v4CH0GFiZXzVWA1clYrT2_R46ApDtu2TA` hourly in `Json` format:

```
{
  "utc": "Fri, 22 Nov 2019 01:21:49 GMT",
  "ethPrice": "161.07 USD/ETH",
  "mkrPrice": "529.41 USD/MKR",
  "pethPrice": "168.54 USD/PETH",
  "daiSupply": "92146643.42 DAI",
  "wethToPeth": 1.0464370394605356,
  "collateralization": 3.015935426996438
}
```

|Name|Description|Unit|Example|
|---|---|---|---|
|utc|Time in UTC|	|Fri, 22 Nov 2019 01:21:49 GMT|
|ethPrice|ETH Price|USD/ETH|161.02 USD/ETH|
|mkrPrice|MKR Price|USD/MKR|529.41 USD/MKR|
|pethPrice|PETH Price|USD/PETH|168.50 USD/PETH|
|daiSupply|DAI Supply|DAI|92146643.42 DAI|
|wethToPeth|WETH To PETH ratio| |1.0464370394605356|
|collateralization|Collateralization| |3.015092803867795|

Each data point is also attached to these tags:

* `Stream-Name` is always `mkr`, use to search for all transactions in the stream.
* `Date` in `YYYY-MM-DD` format, use to search data points by date.
* `Hour` in `hh` format, use to chart by 1h, 3h, 1D...

## ArQL Example

* Get all data point:

```
{
  op: "and",
  expr1: {
    op: "equals",
    expr1: "from",
    expr2: "nSe8ZKhDu3v4CH0GFiZXzVWA1clYrT2_R46ApDtu2TA"
  },
  expr2: {
    op: "equals",
    expr1: "Stream-Name",
    expr2: "mkr"
  }
}
```

* Get data points by date `2019-11-22`:
  
```
{
  op: "and",
  expr1: {
    op: "equals",
    expr1: "from",
    expr2: "nSe8ZKhDu3v4CH0GFiZXzVWA1clYrT2_R46ApDtu2TA"
  },
  expr2: {
    op: "and",
    expr1: {
      op: "equals",
      expr1: "Date",
      expr2: "2019-11-22"
    },
    expr2: {
      op: "equals",
      expr1: "Stream-Name",
      expr2: "mkr"
    }
  }
}
```

* Get data daily at `00:00 AM`:

```
{
  op: "and",
  expr1: {
    op: "equals",
    expr1: "from",
    expr2: "nSe8ZKhDu3v4CH0GFiZXzVWA1clYrT2_R46ApDtu2TA"
  },
  expr2: {
    op: "and",
    expr1: {
      op: "equals",
      expr1: "Hour",
      expr2: "0"
    },
    expr2: {
      op: "equals",
      expr1: "Stream-Name",
      expr2: "mkr"
    }
  }
}
```