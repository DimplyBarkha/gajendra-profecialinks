
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'waitrose.com',
    country: 'UK',
    store: 'waitrose',
    timeout: 100000,
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.goto(url, { waitUntil: 'load', checkBlocked: true });
    await context.evaluate(async () => {
      if (document.querySelector('[data-test="accept-all"]')) {
        document.querySelector('[data-test="accept-all"]').click();
      }
    });
  },
};
