
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'NZ',
    store: 'davidjones',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div[class*="products"],div#sli_results',
    noResultsXPath: '//div[@id="sli_no_results"] | //h1[contains(text(), "Invalid Request")] | //div[@itemtype="http://schema.org/Product"]',
    openSearchDefinition: null,
    domain: 'davidjones.com',
    zipcode: '',
  },
};
