
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'conforama.fr',
    timeout: 8000000,
    country: 'FR',
    store: 'conforama',
    zipcode: '',
  },
  implementation: async ({ url, zipcode }, parameters, context, dependencies) => {
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    await context.solveCaptcha({
    type: 'RECAPTCHA',
    inputElement: '.g-recaptcha'
  }); 
  
  },
};
