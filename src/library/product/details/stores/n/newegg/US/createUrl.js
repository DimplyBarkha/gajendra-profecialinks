
// module.exports = {
//   implements: 'product/details/createUrl',
//   parameterValues: {
//     domain: 'newegg.com',
//     prefix: null,
//     url: 'https://www.newegg.com/p/pl?d={id}',
//     country: 'US',
//     store: 'newegg',
//     zipcode: "''",
//   },
// };

module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'newegg.com',
    prefix: null,
    url: 'https://www.newegg.com/p/pl?d={id}',
    country: 'US',
    store: 'newegg',
    zipcode: '',
  },
};
