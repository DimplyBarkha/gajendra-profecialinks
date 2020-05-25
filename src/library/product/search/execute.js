/**
 *
 * @param { { keywords: string } } inputs
 * @param { { url: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url });
}

module.exports = {
  parameters: [
    {
      name: 'country',
      description: '2 letter ISO code for the country',
    },
    {
      name: 'store',
      description: 'store name',
    },
    {
      name: 'domain',
      description: 'top private domain (e.g. amazon.com)',
    },
    {
      name: 'url',
      description: 'Open Search search url pattern, e.g. http://example.com/?q={searchTerms}',
    },
  ],
  inputs: [
    {
      name: 'keywords',
      description: 'keywords to search for',
      type: 'string',
    },
  ],
  dependencies: {
    goto: 'action:navigation/goto',
  },
  path: './stores/${store[0:1]}/${store}/${country}/execute',
  implementation,
};
