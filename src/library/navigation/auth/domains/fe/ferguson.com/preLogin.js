
module.exports = {
  implements: 'navigation/auth/preLogin',
  parameterValues: {
    domain: 'ferguson.com',
    country: 'US',
    store: 'ferguson',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    try {
      await context.waitForSelector('#js-loginpage-login');
    } catch (err) {
      console.log('Login Submit button not loaded');
    }
  },
};
