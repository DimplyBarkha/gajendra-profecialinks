module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'AE',
    store: 'noon',
    domain: 'noon.com',
    loadedSelector: 'div#content,div.swiper-container',
    noResultsXPath: '//p[contains(text(),"Uh-oh, something went wrong here")]',
    zipcode: '',
  },
};
