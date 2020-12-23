
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'amazon',
    domain: 'amazon.nl',
    loadedSelector: '#productTitle, [data-automation-id=title], [id*=Title] h1, h1[class*=title],  h1[id*=title]',
    noResultsXPath: '//a[contains(@href, "dogsofamazon") and not(contains(@href, "503"))]',
    zipcode: '',
  },
};


// module.exports = {
//   implements: 'product/details/execute',
//   parameterValues: {
//     country: 'IT',
//     store: 'amazon',
//     domain: 'amazon.it',
//     loadedSelector: '#productTitle, [data-automation-id=title], [id*=Title] h1, h1[class*=title],  h1[id*=title]',
//     noResultsXPath: '//a[contains(@href, "dogsofamazon") and not(contains(@href, "503"))]',
//     zipcode: '20019',
//   },
// };
