
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
    const searchUrl = `https://www.${domain}/search/?q=${id}`;
    await dependencies.goto({ url: searchUrl });
    const productHref = await context.evaluate(async () => (document.querySelector('div#products-wrapper ul.product-list > li > a') ? document.querySelector('div#products-wrapper ul.product-list > li > a').getAttribute('href') : null));
    if (!productHref) {
      console.log('No product was found for a given ID.');
      return searchUrl;
    };
    return `${domain}${productHref}`;
  },
};
