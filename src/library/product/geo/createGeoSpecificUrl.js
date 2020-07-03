
/**
 *
 * @param { { id: any, geoParam: any } } inputs
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
  const { id, geoParam } = inputs;
  const { domain, prefix, suffix } = parameters;

  if (parameters.url) {
    const url = parameters.url
      .replace('{id}', encodeURIComponent(id))
      .replace('{geoParam}', encodeURIComponent(geoParam));
    return url;
  }
  let gotoUrl = `https://${domain}`;
  if (prefix) {
    gotoUrl += `/${prefix}`;
  }
  gotoUrl += `/${geoParam}`;
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
    {
      name: 'geoParam',
      description: '',
      type: 'string',
      optional: false,
    },
  ],
  dependencies: {},
  path: './stores/${store[0:1]}/${store}/${country}/createGeoSpecificUrl',
  implementation,
};
