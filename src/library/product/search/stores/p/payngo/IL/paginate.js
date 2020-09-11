
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'IL',
    store: 'payngo',
    nextLinkSelector: null,
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: 'div#isp_center_container > ul#isp_search_results_container > li',
    noResultsXPath: '//li[contains(string(), "no results found")]',
    openSearchDefinition: null,
    domain: 'payngo.co.il',
    zipcode: '',
  },
};
