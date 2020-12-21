
module.exports = {
  implements: 'navigation/auth/preLogin',
  parameterValues: {
    domain: 'shoprite.com',
    country: 'US',
    store: 'shoprite_08096',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    try {
      await context.waitForSelector('#SignIn');
    } catch (err) {
      console.log('Login Submit button not loaded');
    }
  },
};
