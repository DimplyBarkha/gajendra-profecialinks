
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'shopmylocal',
    domain: 'shopmylocal.com.au',
    url: 'https://www.shopmylocal.com.au/api/int/s?query={searchTerms}&search_distance=10&published_to=marketplace&location_slug=St-Ives&region_name=New+South+Wales#[!opt!]{"type":"json"}[/!opt!]',
    loadedSelector: null,
    noResultsXPath: null,
    zipcode: '',
  },
};
