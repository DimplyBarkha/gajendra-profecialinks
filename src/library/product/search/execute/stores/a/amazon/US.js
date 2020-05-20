module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    domain: 'amazon.com',
  },
  implementation: async ({ keywords }, { country, store }, context, { goto }) => {
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keywords)}&ref=nb_sb_noss_2`;
    await context.setJavaScriptEnabled(false);
    await goto({ url });
  },
};
