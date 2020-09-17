
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IE',
    store: 'donaghybros',
    domain: 'donaghybros.ie',
    loadedSelector: 'h1',
    noResultsXPath: '//div[@class="kuNoRecordFound"]//div[contains(text(),"Please try another search term...")]',
  },
};
