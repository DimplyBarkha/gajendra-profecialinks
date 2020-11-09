
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'att.com',
    // prefix: null,
    url: 'https://www.att.com/global-search/search?catField=&group=true&q={id}',
    country: 'US',
    store: 'att',
    zipcode: "''",
  },
};
