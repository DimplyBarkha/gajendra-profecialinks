
/**
 *
 * @param { { url: any, id: any } } inputs
 * @param { { country: any, transform: any, store: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { variants } = dependencies;
  return await context.extract(variants, { transform });
}

module.exports = {
  parameters: [
    {
      name: 'country',
      description: '',
      optional: false,
    },
    {
      name: 'store',
      description: '',
      optional: false,
    },
    {
      name: 'transform',
      description: 'transform function for the extraction',
      optional: true,
    },
  ],
  inputs: [
    {
      name: 'url',
      description: '',
      type: 'string',
      optional: false,
    },
    {
      name: 'id',
      description: '',
      type: 'string',
      optional: false,
    },
  ],
  dependencies: {
    variants: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/variantsExtract',
  },
  path: '../stores/${store[0:1]}/${store}/${country}/variantsExtract',
  implementation,
};
