
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'very',
    domain: 'very.co.uk',
    loadedSelector: 'div#recs_1',
    noResultsXPath: '//span[@id="noSearchResultsString"]|//div[contains(@id, "sliderTarget--primaryCell")]',
    zipcode: '',
  },
};
