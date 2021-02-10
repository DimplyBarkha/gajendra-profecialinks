module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'medpex.de',
    prefix: 'search.do?q=',
    url: 'https://medpex.de/search.do?q={id}',
    country: 'DE',
    store: 'medpex',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id } = inputs;
  const { domain, prefix, suffix } = parameters;

  if (parameters.url) {
    const url = parameters.url.replace('{id}', encodeURIComponent(id));
    // return url;
    await context.goto(url, { timeout: 20000, waitUntil: 'load', checkBlocked: true });
    const finalURL = await context.evaluate(async function () {
      let searchURL = document.querySelector('span[class="product-name"] a').getAttribute('href');
      return 'https://www.medpex.de' + searchURL;
    });
    return finalURL;
  }
  let gotoUrl = `https://${domain}`;
  if (prefix) {
    gotoUrl += `/${prefix}`;
  }
  gotoUrl += `/${id}`;
  if (suffix) {
    gotoUrl += `/${suffix}`;
  }
  return gotoUrl;
}