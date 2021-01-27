module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'petsmart.ca',
    timeout: 300000,
    country: 'CA',
    store: 'petsmart',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, { country, domain, timeout }, context, dependencies) => {
    await context.goto(`${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true,"discard_CSP_header":true,"force200": true}[/!opt!]`, { timeout, waitUntil: 'load', checkBlocked: true });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
