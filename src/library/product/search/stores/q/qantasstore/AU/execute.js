
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'qantasstore',
    domain: 'qantasstore.com.au',
    url: 'https://www.qantasstore.com.au/search/?q={searchTerms}',
    loadedSelector: 'div.product-listing',
    noResultsXPath: '//div[@class="uid-EmptyResultsParagraphComponent qantas-store-paragraph container"]',
  },
};
