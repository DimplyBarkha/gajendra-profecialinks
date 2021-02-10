
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'homedepot.com',
    timeout: 100000,
    jsonToTable: null,
    country: 'US',
    store: 'homedepot',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.setFirstRequestTimeout(50000);
    await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 100000,
      waitUntil: 'load',
    });
  },
};

//* **************************** */

// module.exports = {
//   implements: 'navigation/goto',
//   parameterValues: {
//     domain: 'homedepot.com',
//     timeout: null,
//     country: 'US',
//     store: 'homedepot',
//     zipcode: '',
//   },
// };
