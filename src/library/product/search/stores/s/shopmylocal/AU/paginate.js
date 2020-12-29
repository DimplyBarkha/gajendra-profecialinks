
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'AU',
    store: 'shopmylocal',
    nextLinkSelector: null,
    nextLinkXpath: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    loadedXpath: '//div[contains(@id,"advert_")]',
    noResultsXPath: '//div[@class="AdvertSearch-noResults"]', 
    stopConditionSelectorOrXpath: null,
    resultsDivSelector: null,
    openSearchDefinition: {
      template: 'https://www.shopmylocal.com.au/api/int/s?query={searchTerms}&search_distance=10&published_to=marketplace&location_slug=St-Ives&region_name=New+South+Wales&page={page}#[!opt!]{"type":"json"}[/!opt!]',
    },
    domain: 'shopmylocal.com.au',
    zipcode: '',
  },
};
