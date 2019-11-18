const Arweave = require("arweave/node");

const arweave = Arweave.init({
  host: "arweave.net",
  port: 443,
  protocol: "https"
});

// arweave.transactions
//   .getData("5V4v5XSvmZoIawuWorKYWajfCb4hRSRira_0ErDbvX8", {
//     decode: true,
//     string: true
//   })
//   .then(data => {
//     console.log(data);
//   });

async function test() {
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

  console.log(txids);
}
test();
