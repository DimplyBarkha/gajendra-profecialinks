
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'drankdozijn.nl',
    country: 'NL',
    store: 'drankdozijn',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.goto(url, { timeout: timeout, waitUntil: 'networkidle0', checkBlocked: true });
    // Hack to wait until details are binded to the DOM
    await new Promise((resolve, reject) => setTimeout(resolve, 5000));
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
