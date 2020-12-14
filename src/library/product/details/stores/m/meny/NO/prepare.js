
module.exports = {
  implements: 'product/details/geo/prepare',
  parameterValues: {
    country: 'NO',
    domain: 'meny.no',
    store: 'meny',
    zipcode: "''",
  },
  implementation: async ({ URL, RPC, SKU, zipcode, storeId, postcode }, { country, domain, timeout }, context, dependencies) => {
    await context.evaluate(async function () {
      if (document.querySelector('div.no-result')) {
        throw Error('We cant find any results for "Product Code", sorry about that.');
      }
    });
    // await context.goto(url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  },
};
