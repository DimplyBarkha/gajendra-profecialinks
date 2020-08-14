
/**
 *
 * @param { {  } } inputs
 * @param { { domain: any } } parameters
 * @param { ImportIO.IContext } context
 * @param { { someAction: ImportIO.Action, someFunction: () => void, someExtraction: string } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { } = inputs; // eslint-disable-line no-empty-pattern
  const { domain } = parameters; // eslint-disable-line no-unused-vars

  // TODO: add your impl - must be self contained (no require/import/external functions)
}

module.exports = {
  parameters: [
    {
      name: 'domain',
      description: '',
      optional: false,
    },
  ],
  inputs: [],
  dependencies: {
    someAction: 'action:foo/bar',
    someFunction: 'function:foo/bar',
    someExtraction: 'extraction:foo/bar',
  },
  path: '${domain}',
  implementation,
};
