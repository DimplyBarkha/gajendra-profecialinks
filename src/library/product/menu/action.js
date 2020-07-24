
/**
 *
 * @param { { URL: string} } inputs
 * @param { { store: any, domain: any, country: any, zipcode: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { execute: ImportIO.Action, extract: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { domain, zipcode } = parameters;

  const { URL } = inputs;
  const { execute, extract } = dependencies;
  const url = URL || `https://${domain}`;

  await execute({ url, zipcode: zipcode });

  await extract({ url });
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
    {
      name: 'zipcode',
      description: 'to set location',
      optional: true,
    },
  ],
  inputs: [
    {
      name: 'URL',
      description: 'url for menu',
      type: 'string',
      optional: true,
    },
  ],
  dependencies: {
    execute: 'action:product/menu/execute',
    extract: 'action:product/menu/extract',
  },
  path: './menu/stores/${store[0:1]}/${store}/${country}/menu',
  implementation,
};
