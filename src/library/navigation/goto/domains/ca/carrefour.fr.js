
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'carrefour.fr',
    timeout: 90000,
    country: 'FR',
    store: 'carrefour',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.goto(url, { timeout: 90000, waitUntil: 'load', checkBlocked: false });
    await context.solveCaptcha({
    type: 'RECAPTCHA',
    inputElement: '.g-recaptcha'
  }); 
  await new Promise((resolve, reject) => setTimeout(resolve, 10000));
  },
  };
