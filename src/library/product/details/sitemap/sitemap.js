
/**
 *
 * @param { { url: any, URL: any } } inputs
 * @param { { country: any, domain: any, store: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { URL, url } = inputs;
  const { domain } = parameters;
  const { execute, extract } = dependencies;
  const address = url || URL || `https://${domain.includes('wwww') ? domain : 'wwww.' + domain}/sitemap.xml`;
  await execute({ url: address });

  await extract({ url: address });
}

module.exports = {
  parameters: [
    {
      name: 'country',
      description: '',
      optional: false,
    },
    {
      name: 'domain',
      description: '',
      optional: false,
    },
    {
      name: 'store',
      description: '',
      optional: false,
    },
  ],
  inputs: [
    {
      name: 'url',
      description: '',
      type: 'string',
      optional: true,
    },
    {
      name: 'URL',
      description: '',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    execute: 'action:product/details/execute',
    extract: 'action:product/details/sitemap/sitemapExtract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/sitemap',
  implementation,
};
