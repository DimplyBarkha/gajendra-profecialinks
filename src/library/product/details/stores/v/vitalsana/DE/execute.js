
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DE',
    store: 'vitalsana',
    domain: 'vitalsana.com',
    loadedSelector: '#maincontent',
    noResultsXPath: "//div[@class='message notice']/div/text()",
    zipcode: '',
  },
};
