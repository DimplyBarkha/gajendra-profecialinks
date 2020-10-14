
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'jcpenney',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'td.organicZoneInfo',
    noResultsXPath: '//td[contains(@class,"products depth_1")]/table/tbody[count(*)=0]',
    openSearchDefinition: {
      template: 'https://search-api.jcpenney.com/v1/search-service/s?productGridView=medium&searchTerm={searchTerms}&page={page}&mktTiles=0&responseType=organic#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'jcpenney.com',
  },
};