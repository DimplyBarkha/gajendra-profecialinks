
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'shop.njoy.com',
    timeout: 50000,
    country: 'US',
    store: 'njoy',
    zipcode: "''",
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });

    await context.waitForSelector('a[class="button confirmm-age"]', { timeout: 7000 })
      .catch(() => console.log('age selector not found'));

    await context.evaluate(async function () {
      const ageConfIframe = document.querySelector('a.button.confirmm-age');
      if (ageConfIframe) {
        document.querySelector('a.button.confirmm-age').click();
      }
    });
  },
};
