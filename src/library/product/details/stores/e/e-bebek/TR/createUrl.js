
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'e-bebek.com',
    prefix: null,
    url: null,
    country: 'TR',
    store: 'e-bebek',
    zipcode: '',
  },
  dependencies: {
    goto: 'action:navigation/goto',
  },
  implementation: async ({ id }, { domain }, context, dependencies) => {
    await dependencies.goto({ url: `https://www.e-bebek.com/search?text=${id}` });
    const productHref = await context.evaluate(async () => (document.querySelector('div.gtmProductClick a') ? 'https://www.e-bebek.com' + document.querySelector('div.gtmProductClick a').getAttribute('href') : null));
    if (!productHref) throw new Error('Failed to create a URL for a given id');
    return productHref;
  },
};
