
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'paris.cl',
    timeout: 50000,
    country: 'CL',
    store: 'paris',
    zipcode: '',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters,
    context,
    dependencies
  ) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    await context.setLoadImages(false);
    await context.setLoadAllResources(false);
    /**
     * Adding goto in try catch as the webpage keeps on loading indefinitely
     * even if we give huge time out and eventually throws timeout error
     */
    try {
      await context.goto(url, {
        timeout: timeout,
        waitUntil: 'load',
        checkBlocked: true,
      });
    } catch (e) {
      console.log('page load time out ----> ', e);
    }
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
