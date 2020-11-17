module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'thegoodguys',
    nextLinkSelector: 'button.btn.mobile_right',
    mutationSelector: '#product_listing_tab>ul>li:last-child',
    loadedSelector: '#product_listing_tab>ul>li:last-child',
    noResultsXPath: '//*[contains(@class,"results_description")]',
    domain: 'thegoodguys.com.au',
    zipcode: '',
  },
};
