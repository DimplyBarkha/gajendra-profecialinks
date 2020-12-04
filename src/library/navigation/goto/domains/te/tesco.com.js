
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'tesco.com',
    timeout: null,
    country: 'UK',
    store: 'tesco',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}`;
    await context.goto(url);
  },
};


