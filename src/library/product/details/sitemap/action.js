// never executed but needs to be valid

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
  const { execute, extract } = dependencies;
  await execute({ url: url || URL });

  await extract({ url: url || URL });
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
