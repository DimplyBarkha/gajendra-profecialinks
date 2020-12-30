/**
 *
 * @param {{
 *  id: string,
 *  page: number,
 *  offset: number,
 * }} inputs
 * @param {{
 *  nextLinkSelector: string,
 *  mutationSelector: string,
 *  loadedSelector: string,
 *  noResultsXPath: string,
 *  spinnerSelector: string,
 *  openSearchDefinition: { template: string, indexOffset?: number, pageOffset?: number }
 * }} parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { id, page, offset } = inputs;
  const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;

  if (nextLinkSelector) {
    const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
    if (!hasNextLink) {
      return false;
    }
  }

  const { pager } = dependencies;
  const success = await pager({ id, nextLinkSelector, loadedSelector, mutationSelector, spinnerSelector });
  if (success) {
    return true;
  }

  let url;

  if (openSearchDefinition) {
    url = openSearchDefinition.template
      .replace(/{id}/g, id)
      .replace(/{page}/g, (page + (openSearchDefinition.pageOffset || 0)).toString())
      .replace(/{offset}/g, (offset + (openSearchDefinition.indexOffset || 0)).toString());
  }

  url = await context.evaluate(function () {
    /** @type { HTMLLinkElement } */
    const next = document.querySelector('head link[rel="next"]');
    if (!next) {
      return false;
    }
    return next.href;
  });

  if (!url) {
    return false;
  }

  console.log('Going to url', url);
  await dependencies.goto({ url });
  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }
  console.log('Checking no results', noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);
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
      name: 'loadedSelector',
      description: 'CSS to tell us the page has loaded',
    },
    {
      name: 'noResultsXPath',
      description: 'XPath selector for no results',
    },
    {
      name: 'openSearchDefinition',
      description: 'Open search definition object',
    },
  ],
  inputs: [{
    name: 'id',
    description: 'product id',
  }, {
    name: 'page',
    description: 'page number (1 indexed)',
  }, {
    name: 'offset',
    description: 'offset (0 indexed)',
  }],
  path: './stores/${store[0:1]}/${store}/${country}/paginate',
  dependencies: {
    pager: 'action:product/reviews/paginate/pager',
    goto: 'action:navigation/goto',
  },
  implementation,
};
