
/**
 *
 * @param { { url: string } } inputs
 * @param { { domain: any, loggedInSelector: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action } } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies
) {
  const { url } = inputs;
  const { loggedInSelector } = parameters;
  await dependencies.goto({ url });

  await context.waitForSelector(loggedInSelector);

  console.log('Logged in!');
}

module.exports = {
  parameters: [
    {
      name: 'domain',
      description: '',
      optional: false
    },
    {
      name: 'loggedInSelector'
    }
  ],
  inputs: [
    {
      name: 'url',
      description: '',
      type: 'string',
      optional: false
    }
  ],
  dependencies: {
    goto: 'action:navigation/goto'
  },
  path: '../auth/domains/${domain[0:2]}/${domain}/checkAuth',
  implementation
};