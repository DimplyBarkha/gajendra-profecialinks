
// module.exports = {
//   implements: 'product/details/execute',
//   parameterValues: {
//     country: 'IN',
//     store: 'nykaa',
//     domain: 'nykaa.com',
//     loadedSelector: null,
//     noResultsXPath: null,
//     zipcode: '',
//   },
// };


module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'IN',
    store: 'nykaa',
    domain: 'nykaa.com',
    loadedSelector: 'body.nykaa',
    noResultsXPath: '//div[contains(text(),"No results found ")]',
  },
};