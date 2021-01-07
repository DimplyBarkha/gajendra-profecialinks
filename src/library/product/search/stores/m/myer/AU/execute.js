
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'AU',
    store: 'myer',
    domain: 'myer.com.au',
    url: "https://www.myer.com.au/search?query={searchTerms}",
    loadedSelector: "div.body-content",
    noResultsXPath: "div.css-s9ry5n[data-automation='no-results']",
    zipcode: '',
  },
};
