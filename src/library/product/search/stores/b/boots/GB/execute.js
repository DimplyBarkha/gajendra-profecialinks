
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'GB',
    store: 'boots',
    domain: 'boots.com',
    url: 'https://www.boots.com/sitesearch?searchTerm={searchTerms}',
    loadedSelector: 'div.product_name > a',
    noResultsXPath: '//div[@class="no-result"] | /html[not(//div[@class="product_listing_container"])]',
    zipcode: '',
  },
};
