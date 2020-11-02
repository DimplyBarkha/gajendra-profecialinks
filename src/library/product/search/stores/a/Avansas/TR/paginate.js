
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'avansas',
    //nextLinkSelector: 'a[aria-label="Next"] span i',
    nextLinkSelector: 'i.pagination-right',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class="list-container area active"]',
    noResultsXPath: '//h2[contains(.," ile ilgili sonuç bulunamamıştır")]',
    // (//main[@class="main"]/h2/text())[2]
    openSearchDefinition: null,
    domain: 'avansas.com',
    zipcode: "''",
  },
};
