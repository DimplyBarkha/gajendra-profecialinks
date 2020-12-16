
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'homedepot.ca',
    timeout: null,
    country: 'CA',
    store: 'homedepot',
    zipcode: '',
  },
  implementation: async ({ id, url, zipcode }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 30000;
    // console.log(id+' is product rpc')
    await context.goto(url, { first_request_timeout: 60000, timeout, waitUntil: 'load', checkBlocked: true });
    if (zipcode) {
      await dependencies.setZipCode({ url, zipcode });
    }
  },
};
