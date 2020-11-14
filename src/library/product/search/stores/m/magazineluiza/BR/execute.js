
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'magazineluiza',
    domain: 'magazineluiza.com.br',
    url: 'https://www.magazineluiza.com.br/busca/{searchTerms}/',
    loadedSelector: 'ul.neemu-products-container li.nm-product-item',
    noResultsXPath: '//div[@class="nm-not-found-message1"]',
    zipcode: "''",
  },
};
