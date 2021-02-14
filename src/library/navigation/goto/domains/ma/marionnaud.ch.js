
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'marionnaud.ch',
    timeout: null,
    country: 'CH',
    store: 'marionnaud',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    const timeout = parameters.timeout ? parameters.timeout : 10000;
    let resp = await context.goto(url, { timeout: timeout, waitUntil: 'load', checkBlocked: true });
    console.log('resp.status', resp.status);
    if(resp.status.toString() !== '200') {
      throw new Error(`got status --> ${resp.status} - Hence throwing custom error`);
    }
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  }
};
