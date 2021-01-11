
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'euro.com.pl',
    timeout: 50000,
    country: 'PL',
    store: 'euro',
    zipcode: '',
  },
  implementation: async ({ url, zipcode, storeId }, parameters, context, dependencies) => {
    await context.setBlockAds(false);
    url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
    await context.goto(url, { waitUntil: 'networkidle0', block_ads: false });
    console.log(zipcode);
    if (zipcode) {
      await dependencies.setZipCode({ url: url, zipcode: zipcode, storeId });
    }
  },
};
