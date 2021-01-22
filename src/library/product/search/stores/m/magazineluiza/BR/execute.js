
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BR',
    store: 'magazineluiza',
    domain: 'magazineluiza.com.br',
    url: 'https://www.magazineluiza.com.br/busca/{searchTerms}/',
    loadedSelector: 'div#productShowcaseSearch ul.productShowCase li.product',
    noResultsXPath: '//div[@class="nm-not-found-message1"]',
    zipcode: "''",
  },
};
