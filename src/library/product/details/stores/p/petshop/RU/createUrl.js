
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'petshop.ru',
    prefix: null,
    url: null,
    country: 'RU',
    store: 'petshop',
    zipcode: '',
  },
  dependencies: {
    goto: 'action:navigation/goto',
  },
  implementation: async ({ id }, { domain }, context, dependencies) => {
    await dependencies.goto({ url: `https://www.${domain}/search/?q=${id}` });
    const productHref = await context.evaluate(async () => (document.querySelector('ul.product-list > li > a') ? document.querySelector('ul.product-list > li > a').getAttribute('href') : null));
    if (!productHref) throw new Error('Failed to create a URL for a given id');
    return productHref;
  },
};
