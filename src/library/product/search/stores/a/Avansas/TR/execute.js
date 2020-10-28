
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'TR',
    store: 'Avansas',
    domain: 'avansas.com',
    url: 'https://www.avansas.com/search/?q={searchTerms}',
    loadedSelector: 'div[class="list-container area active"]',
    noResultsXPath: '//h2[contains(.," ile ilgili sonuç bulunamamıştır")]',
    // (//main[@class="main"]/h2/text())[2]
    zipcode: "''",
  },
};
