
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'primor.eu',
    timeout: 15000,
    country: 'ES',
    store: 'primor',
    zipcode: '',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    const url = `${inputs.url}`;
    await context.setViewPort({ height: 700, width: 800 });
    await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    return url;
  },
};
