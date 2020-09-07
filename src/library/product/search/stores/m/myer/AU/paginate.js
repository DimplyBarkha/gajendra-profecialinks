
module.exports = {
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    nextLinkSelector: "div.css-1d2lwfn > #paginationContainer > li.next > a",   
    loadedSelector: "div.body-content",
    noResultsXPath: "div.css-s9ry5n[data-automation='no-results']",
    domain: 'myer.com.au',
    zipcode: '',
  },
};
