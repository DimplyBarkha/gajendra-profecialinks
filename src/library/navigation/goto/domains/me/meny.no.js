
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'meny.no',
    timeout: 90000,
    country: 'NO',
    store: 'meny',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.goto(url,{timeout : 50000});
    await context.evaluate(async () => {
      const goodsButton = document.querySelector('div[id="search-result-tab-products"]>label')
      if (goodsButton) {
        goodsButton.click();
        await new Promise((resolve) => setTimeout(resolve, 20000));
      }
    })
  },
};
