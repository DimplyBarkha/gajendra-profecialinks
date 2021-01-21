
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'MX',
    store: 'coppel',
    nextLinkSelector: 'button#WC_SearchBasedNavigationResults_pagination_link_right_categoryResults',
    mutationSelector: null,
    spinnerSelector: null,
    loadedSelector: null,
    noResultsXPath: '//div[@class="widget_search_results_position"]/div[@class="widget_search_results text-center"]/div[@class="description"]/div[@class="specification_text"]',
    openSearchDefinition: null,
    domain: 'coppel.com',
    zipcode: '',
  },
};
