const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https"
});

document.addEventListener("DOMContentLoaded", async () => {
  const txids = await arweave.arql({
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
  });

  let all = [];
  for (let i = 0; i < txids.length && i < 24; i++) {
    all.push(arweave.transactions.getData(txids[i], {
      decode: true,
      string: true
    }));
  }
  let data = await Promise.all(all);
  let ethPrices = [],
      mkrPrices = [],
      pethPrices = [],
      wethToPeths = [],
      collateralizations = [];
  for (let i = data.length - 1; i >= 0; i--) {
    const d = JSON.parse(data[i]);
    ethPrices.push(parseFloat(d.ethPrice));
    mkrPrices.push(parseFloat(d.mkrPrice));
    pethPrices.push(parseFloat(d.pethPrice));
    wethToPeths.push(d.wethToPeth);
    collateralizations.push(d.collateralization);
  }
  let lineConf = {
    type: "line",
    height: "80",
    width: "100%",
    lineColor: "#28a745",
    fillColor: undefined,
    lineWidth: 3
  };
  $("#sparkline-1").sparkline(ethPrices, lineConf);
  $("#sparkline-2").sparkline(mkrPrices, lineConf);
  $("#sparkline-3").sparkline(pethPrices, lineConf);
  $("#sparkline-4").sparkline(wethToPeths, lineConf);
  $("#sparkline-5").sparkline(collateralizations, lineConf);
});