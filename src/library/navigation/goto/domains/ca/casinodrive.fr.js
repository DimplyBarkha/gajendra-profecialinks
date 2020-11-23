
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'casinodrive.fr',
    timeout: 30000,
    country: 'FR',
    store: 'casinodrive',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url, zipcode });
    }
  },
};
