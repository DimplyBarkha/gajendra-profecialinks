module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'BE',
    store: 'colruyt_nl',
    domain: 'colruyt.be',
    loadedSelector: '#mainContent img',
    noResultsXPath: '//div[contains(@class,"no-result-page")] | //body[contains(text(),"The requested URL was rejected. Please consult with your administrator.")]',
    zipcode: '',
  },
};
