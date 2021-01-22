
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'SE',
    store: 'apoteket',
    domain: 'apoteket.se',
    url: 'https://www.apoteket.se/sok/?q={searchTerms}',
    loadedSelector: 'div.product-grid__items',
    noResultsXPath: '//div[@class="product-grid__loader" and contains(text(), "Inga produkter hittades")]',
    zipcode: '',
  },
};
