
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SE',
    store: 'elgiganten',
    domain: 'elgiganten.se',
    loadedSelector: 'div.product-detail-page, div[id*="searchProductsInfo"] div[class*="product-list"] div[class="mini-product-content"]',
    noResultsXPath: '//*[contains(text(),"Tyvärr kunde vi inte hitta någonting som matchade din sökning")]',
    zipcode: '',
  },
};
