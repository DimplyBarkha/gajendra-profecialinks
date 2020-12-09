
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'US',
    store: 'jcpenney',
    domain: 'jcpenney.com',
    url: 'https://search-api.jcpenney.com/v1/search-service/s?productGridView=medium&searchTerm={searchTerms}&responseType=organic#[!opt!]{"type":"json"}[/!opt!]',
    loadedSelector: 'td.organicZoneInfo',
    noResultsXPath: '//td[contains(@class,"products depth_1")]/table/tbody[count(*)=0]',
    zipcode: '',
  },
};
