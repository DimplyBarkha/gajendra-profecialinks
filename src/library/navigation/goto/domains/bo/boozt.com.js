// async function implementation({ url, zipcode, storeId }, parameters, context, dependencies) {
//   await context.goto(url, { timeout: 60000, waitUntil: "load", checkBlocked: true });
// }

module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'boozt.com',
    timeout: 120000,
    country: 'DK',
    store: 'boozt',
    zipcode: '',
  },
  // implementation,
};