
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'liverpool.mx',
    timeout: 80000,
    country: 'MX',
    store: 'liverpool',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    let { url, zipcode, storeId } = inputs;
    await context.setBlockAds(false);
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { waitUntil: 'networkidle0', block_ads: false });
    console.log(zipcode);
    if (zipcode || storeId) {
      await dependencies.setZipCode(inputs);
    }
  },
};
