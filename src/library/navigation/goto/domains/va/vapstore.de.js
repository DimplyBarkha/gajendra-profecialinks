
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'vapstore.de',
    timeout: 50000,
    country: 'DE',
    store: 'vapstore',
    zipcode: "''",
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    const { url, zipcode, storeId } = inputs;
    if (!url.includes('navi.php')) {
      let newUrl = url + '?ratings_nItemsPerPage=-1&ratings_nSortByDir=1#tab-votes';
      await context.goto(newUrl, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    }
    else {
      await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    }
    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  }
};
