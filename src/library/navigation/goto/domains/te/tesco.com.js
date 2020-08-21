
module.exports = {
  parameterValues: {
    domain: 'tesco.com',
    country: 'UK',
    store: 'tesco',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    url = `${url}`;
    await context.goto(url);
  },
};
