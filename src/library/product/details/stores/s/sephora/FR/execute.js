
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'FR',
    store: 'sephora',
    domain: 'sephora.fr',
    loadedSelector: 'div.product-top-content',
    noResultsXPath: '//div[contains(@class, "no-hits-content")] | //div[contains(@class, "brandspace-landing-page")] | //div[contains(@class, "breadcrumb-element")]//a[contains(text(), "Accueil")]',
    zipcode: '',
  },
};
