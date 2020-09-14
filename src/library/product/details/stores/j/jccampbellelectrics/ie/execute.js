
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'ie',
    store: 'jccampbellelectrics',
    domain: 'jccampbellelectrics.com',
    loadedSelector: '#inpage_container > div.inpage_selector_feature > div > div:nth-child(2) > div > div',
    noResultsXPath: '//p[@class="note-msg"]'
    //zipcode: '',
  },
};
