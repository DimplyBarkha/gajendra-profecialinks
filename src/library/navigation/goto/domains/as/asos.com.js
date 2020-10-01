
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'asos.com',
    timeout: 100000,
    country: 'UK',
    store: 'asos',
    zipcode: '',
  },
  implementation: async (
    { url, zipcode, storeId },
    parameters, context, dependencies
) => {
    const timeout = parameters.timeout ? parameters.timeout : 1000000;
    await context.setLoadImages(true);
    await context.goto(url, {
        firstRequestTimeout: 600000,
        timeout: timeout,
        waitUntil: 'load',
        checkBlocked: true,
    });
    await context.evaluate(async function () {
        console.log(`selector before wait: ${document.querySelector('#gallery-content')}`)
        await new Promise(r => setTimeout(r, 5000));
        console.log(`Selector After wait: ${document.querySelector('#gallery-content')}`)
    });
    await context.extract(productDetails);
  }
};
