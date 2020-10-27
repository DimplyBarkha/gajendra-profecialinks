
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'officedepot.com',
    timeout: 80000,
    country: 'US',
    store: 'officedepot',
    zipcode: '',
  },
  // implementation: async ({ url }, { country, domain }, context, dependencies) => {
  //   await context.goto(url, { timeout: 50000, waitUntil: 'load', checkBlocked: false });
  //   await context.evaluate(async function () {
  //     window.location.reload;
  //     await context.waitForNavigation();
  //   });
  // },
};
