
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'tesco.com',
    country: 'UK',
    store: 'tesco',
  },
  // implementation: async ({ url }, parameters, context, dependencies) => {
  //   url = `${url}`;
  //   await context.goto(url);
  // },
  implementation: async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies,
  ) => {
    url = `${url}`;
    await context.goto(url);
  if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
},
};
