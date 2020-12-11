
/**
 *
 * @param { { id: any } } inputs
 * @param { { domain: string, prefix?: string, suffix?: string, url?: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { } } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
  const { id } = inputs;
  const { domain, prefix, suffix, url } = parameters;

  if (url) return url.replace(/{id}/g, encodeURIComponent(id));

  let gotoUrl = `https://${domain}`;
  if (prefix) gotoUrl += `/${prefix}`;
  if (id) gotoUrl += `/${id}`;
  if (suffix) gotoUrl += `/${suffix}`;
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
      name: 'url',
    },
  ],
  inputs: [
    {
      name: 'id',
      description: '',
      type: 'string',
      optional: false,
    },
  ],
  dependencies: {},
  path: './stores/${store[0:1]}/${store}/${country}/createUrl',
  implementation,
};
