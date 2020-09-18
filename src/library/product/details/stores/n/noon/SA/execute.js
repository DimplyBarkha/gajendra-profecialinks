
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'SA',
    store: 'noon',
    domain: 'noon.com',
    loadedSelector: 'div#content',
    noResultsXPath: '//p[contains(text(),"Uh-oh, something went wrong here")]',
    zipcode: '',
  },
};