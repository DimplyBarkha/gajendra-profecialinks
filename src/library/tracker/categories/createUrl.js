
/**
 *
 * @param { { id: any } } inputs
 * @param { { domain: string, prefix?: string, suffix?: string, url?: string, subdomain: string} } parameters
 * @param { ImportIO.IContext } context
 * @param { { } } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
  const { id } = inputs;
  const { domain, prefix, suffix, url, subdomain } = parameters;

  if (url) return url.replace(/{id}/g, encodeURIComponent(id));

  let gotoUrl = 'https://';
  if (subdomain) gotoUrl += `${subdomain}.`;
  gotoUrl += domain;
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
      optional: true,
    },
    {
      name: 'suffix',
      description: '',
      optional: true,
    },
    {
      name: 'subdomain',
      description: '',
      optional: true,
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
