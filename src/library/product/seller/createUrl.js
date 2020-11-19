
/**
 *
 * @param { { id: any } } inputs
 * @param { { domain: string, prefix?: string, suffix?: string, sellerUrl?: string } } parameters
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

  if (parameters.sellerUrl) {
    const url = parameters.sellerUrl.replace('{id}', encodeURIComponent(id));
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

module.exports = {
  parameters: [
    {
      name: 'domain',
      description: '',
      optional: false,
    },
    {
      name: 'prefix',
      description: '',
      optional: false,
    },
    {
      name: 'sellerUrl',
    },
  ],
  inputs: [
    {
      name: 'id',
      description: 'seller id',
      type: 'string',
      optional: false,
    },
  ],
  dependencies: {},
  path: './stores/${store[0:1]}/${store}/${country}/createUrl',
  implementation,
};
