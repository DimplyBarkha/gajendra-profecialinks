
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IN',
    store: 'flipkart',
    nextLinkSelector: 'a._3fVaIS:last-child',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'span._2yAnYN',
    noResultsXPath: '//div[@class="DUFPUZ"]',
    openSearchDefinition: null,
    domain: 'flipkart.com',
    zipcode: '',
  },
};
