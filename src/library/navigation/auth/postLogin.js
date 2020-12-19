
/**
 *
 * @param { {  } } inputs
 * @param { { domain: any } } parameters
 * @param { ImportIO.IContext } context
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
console.log("post login ............")
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
  dependencies: {},
  path: './domains/${domain[0:2]}/${domain}/postLogin',
  implementation,
};
