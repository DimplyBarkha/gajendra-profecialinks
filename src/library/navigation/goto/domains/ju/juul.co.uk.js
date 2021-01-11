
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'juul.co.uk',
    timeout: 20000,
    country: 'UK',
    store: 'juul',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 20000;
    await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
    const { productReviews } = dependencies;
    await context.evaluate(async () => {
      if (document.querySelector('button#age-gate-confirmation')) {
        document.querySelector('button#age-gate-confirmation').click();
      }
    });
  },
};
