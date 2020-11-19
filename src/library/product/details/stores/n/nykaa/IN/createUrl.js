
// module.exports = {
//   implements: 'product/details/createUrl',
//   parameterValues: {
//     domain: 'nykaa.com',
//     prefix: null,
//     url: null,
//     country: 'IN',
//     store: 'nykaa',
//     zipcode: '',
//   },
// };

module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'nykaa.com',
    url: 'https://www.nykaa.com/dyson-supersonic-hair-dryer/p/{id}',
    country: 'IN',
    store: 'nykaa',
  },
};