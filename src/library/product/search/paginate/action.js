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
      name: 'nextLinkSelector',
      description: 'CSS selector for the next link',
    },
    {
      name: 'mutationSelector',
      description: 'CSS selector for what to wait to change (if in-page pagination)',
    },
    {
      name: 'spinnerSelector',
      description: 'CSS selector for a spinner to wait to disappear (if in-page pagination)',
    },
    {
      name: 'loadedXPath',
      description: 'XPath to tell us the page has loaded',
    },
  ],
  inputs: [
  ],
  path: './stores/${store[0:1]}/${store}/${country}/paginate',
  dependencies: {
    pager: 'action:product/search/paginate/pager',
  },
  implementation: async (inputs, { nextLinkSelector, loadedXPath, mutationSelector, spinnerSelector }, context, { pager }) => {
    return await pager({ nextLinkSelector, loadedXPath, mutationSelector, spinnerSelector });
  },
};
