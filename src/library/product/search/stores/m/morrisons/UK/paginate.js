
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'UK',
    store: 'morrisons',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'ul[class="fops fops-regular fops-shelf"]',
    noResultsXPath: '//div[@class="nf-resourceNotFound"]',
    openSearchDefinition: null,
    domain: 'groceries.morrisons.com',
    zipcode: '',
  },
};
