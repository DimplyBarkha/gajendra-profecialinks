
module.exports = {
  implements: 'product/search/execute',
  parameterValues: {
    country: 'BE',
    store: 'bol',
    domain: 'bol.com',
    url: `https://www.bol.com/nl/s/dyson/?language=nl-BE&country=BE&approved=true`,
    loadedSelector: `ul.list-view.product-list`,
    noResultsXPath: `//div[@data-test='no-result-content']`,
    zipcode: '',
  },
};