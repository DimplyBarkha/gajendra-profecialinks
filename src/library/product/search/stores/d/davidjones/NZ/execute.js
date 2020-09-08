
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'NZ',
    store: 'davidjones',
    domain: 'davidjones.com',
    url: 'https://search.www.davidjones.com/search?w={searchTerms}',
    loadedSelector: 'div[class*="products"],div#sli_results',
    noResultsXPath: '//div[@id="sli_no_results"] | //h1[contains(text(), "Invalid Request")] | //div[@itemtype="http://schema.org/Product"]',
    zipcode: '',
  },
};
