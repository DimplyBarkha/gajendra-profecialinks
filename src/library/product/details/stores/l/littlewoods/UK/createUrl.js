
module.exports = {
  implements: 'product/details/createUrl',
  parameterValues: {
    domain: 'littlewoods.com',
    prefix: null,
    suffix: null,
    url: 'https://www.littlewoods.com/{id}.prd',
    country: 'UK',
    store: 'littlewoods',
    zipcode: '',
  },
};
/**
 *
 * @param { { id: any } } inputs
 * @param { { domain: string, prefix?: string, suffix?: string, url?: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id } = inputs;
  const { domain, prefix, suffix } = parameters;

  if (parameters.url) {
    const url = parameters.url.replace('{id}', encodeURIComponent(id));
    return url;
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