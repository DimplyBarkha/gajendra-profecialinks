
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'kroger.com',
    country: 'US',
    store: 'kroger', 
    timeout: 30000,
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;   
    await context.goto("https://www.kroger.com", { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode });
    }
  },
};
