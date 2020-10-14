
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'apoteket',
    domain: 'apoteket.se',
    loadedSelector: 'div[class="product-grid__items"] , article#main',
    noResultsXPath: '//div[@class="product-grid__loader" and contains(text(), "Inga produkter hittades")]',
    // loadedSelector: 'article.productpage',
    zipcode: '',
  },
};
