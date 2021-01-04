
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'IE',
    store: 'boots',
    domain: 'boots.ie',
    url: 'https://www.boots.ie/sitesearch?searchTerm={searchTerms}',
    loadedSelector: 'div.product_name > a',
    noResultsXPath: '//div[@class="no-result"] | /html[not(//div[@class="product_listing_container"])]',
    zipcode: '',
  },
};
