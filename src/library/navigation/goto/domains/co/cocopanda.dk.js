
module.exports = {
  implements: 'navigation/goto',
  parameterValues: {
    domain: 'cocopanda.dk',
    timeout: 30000,
    country: 'DK',
    store: 'cocopanda',
    zipcode: '',
  },
  implementation
};

async function implementation(inputs, parameterValues, context, dependencies) {
  const { url, zipcode, storeId } = inputs;
  await context.setBlockAds(false);
  // url = `${url}#[!opt!]{"block_ads":false,"first_request_timeout":60,"load_timeout":60,"load_all_resources":true}[/!opt!]`;
  await context.goto(url, { waitUntil: 'networkidle0', block_ads: false, timeout: parameterValues.timeout });
  
  if (zipcode || storeId) {
    await dependencies.setZipCode(inputs);
  }
};
