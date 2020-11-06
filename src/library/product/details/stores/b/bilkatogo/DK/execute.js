
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'DK',
    store: 'bilkatogo',
    domain: 'bilkatogo.dk',
    loadedSelector: 'html body',
    noResultsXPath: '//div[@class=\'container-fluid my-5 has-max-width-limit\']/div[@class=\'row no-results\']/div[@class=\'col justify-content-center text-center py-2\']',
    zipcode: '',
  },
};
