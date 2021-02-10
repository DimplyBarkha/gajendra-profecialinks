
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'homedepot.com',
    timeout: 100000,
    jsonToTable: null,
    country: 'US',
    store: 'homedepot',
    zipcode: '',
  },
  implementation: async ({ url }, parameters, context, dependencies) => {
    await context.setFirstRequestTimeout(50000);
    const lastResponseData = await context.goto(url, {
      block_ads: false,
      load_all_resources: true,
      images_enabled: true,
      timeout: 100000,
      waitUntil: 'load',
    });
    if (lastResponseData.status === 403 || lastResponseData.status === 502) {
      return context.reportBlocked(lastResponseData.status, 'Reportd Blocked.');
    }
  },
};
