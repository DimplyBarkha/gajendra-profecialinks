
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'ehservices',
    domain: 'ehservices.co.uk',
    url: 'https://www.ehservices.co.uk/s/search?search={searchTerms}&perPage=150',
    loadedSelector: 'img.scale',
    noResultsXPath: '//*[contains(@class,\'product-listing\')]/div[contains(text(),\'No records\')]',
    zipcode: '',
  },
};
