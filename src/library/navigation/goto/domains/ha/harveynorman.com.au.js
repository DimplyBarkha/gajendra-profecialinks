
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'harveynorman.com.au',
    country: 'AU',
    store: 'harveynorman',
  },
  implementation: async (inputs, parameterValues, context, dependencies) => {
    await context.setAntiFingerprint(false);
    await context.setLoadAllResources(true);
    await context.setBlockAds(false);
    await context.goto(inputs.url, { timeout: 60000, waitUntil: 'load', checkBlocked: true });
  },
};
