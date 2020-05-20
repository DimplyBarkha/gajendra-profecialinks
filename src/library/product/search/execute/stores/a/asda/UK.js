module.exports = {
  implements: 'product/search/execute',
  parameterValues: { country: 'UK', domain: 'groceries.asda.com', store: 'asda' },
  implementation: async ({ keywords }, { country, store }, context, { goto }) => {
    const url = `https://groceries.asda.com/search/${encodeURIComponent(keywords)}`;
    await goto({ url });
    await context.waitForSelector('div.co-product, #listingsContainer');
  },
};
