
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'TR',
    store: 'avansas',
    nextLinkSelector: 'a[aria-label="Next"]',
    //nextLinkSelector: 'li.next a span i',
    //mutationSelector: null,
    //spinnerSelector: null,
    // loadedSelector: 'div[class="list-container area active"]',
    loadedSelector: 'div.section-container',
    noResultsXPath: '//h2[contains(.," ile ilgili sonuç bulunamamıştır")]',
    // (//main[@class="main"]/h2/text())[2]
    domain: 'avansas.com',
    zipcode: "''",
  },
};
