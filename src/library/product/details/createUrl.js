
/**
 *
 * @param { { id: any } } inputs
 * @param { { domain: string, prefix: string } } parameters
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
  const { domain, prefix } = parameters;
  return `https://${domain}/${prefix}/${id}`;
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
