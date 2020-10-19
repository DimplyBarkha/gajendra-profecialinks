
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'UK',
    store: 'easycaresolutions',
    domain: 'easycaresolutions.co.uk',
    loadedSelector: 'main#maincontent',
    noResultsXPath: '//span[contains(text(),"Whoops, our bad...")] | //meta[contains(@content,"404 Not Found")]',
    zipcode: '',
  },
};
