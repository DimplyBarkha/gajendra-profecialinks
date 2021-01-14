module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'petlove.com.br',
    prefix: null,
    url: null,
    country: 'BR',
    store: 'petlove',
    zipcode: '',
  },
  dependencies: {
    goto: 'action:navigation/goto',
  },
  implementation: async ({ id }, { domain }, context, dependencies) => {
    await dependencies.goto({ url: `https://www.${domain}/busca?q=${id}` });
    const productHref = await context.evaluate(async () => (document.querySelector('div.catalog-list-item > a') ? document.querySelector('div.catalog-list-item > a').getAttribute('href') : null));
    if (productHref) return `https://www.${domain}${productHref}`;
  },
};
