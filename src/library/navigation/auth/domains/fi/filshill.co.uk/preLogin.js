
module.exports = {
  implements: 'navigation/auth/preLogin',
  parameterValues: {
    domain: 'filshill.co.uk',
    country: 'UK',
    store: 'filshill',
    zipcode: '',
  },
  implementation: async function implementation (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    try {
      await context.waitForSelector('#login_submit');
    } catch (err) {
      console.log('Login Submit button not loaded');
    }
  },
};