/**
 *
 * @param {{
 *  keywords: string,
 *  page: number,
 *  offset: number,
 * }} inputs
 * @param {{
 *  nextLinkSelector: string,
 *  mutationSelector: string,
 *  loadedSelector: string,
 *  spinnerSelector: string,
 *  openSearchDefinition: { template: string, indexOffset?: number, pageOffset?: number },
 * interactionFn: function,
 * interactionFnParams: object,
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
  const { keywords, page, offset } = inputs;
  const { nextLinkSelector, loadedSelector, mutationSelector, spinnerSelector, openSearchDefinition, interactionFn, interactionFnParams } = parameters;
  if (interactionFn) {
    console.log('running interaction function.');
    await context.evaluate(async ({ externalFunction, interactionFnParams }) => {
      console.log(externalFunction);
      // eslint-disable-next-line no-eval
      const func = eval(externalFunction);
      await func(interactionFnParams);
    }, { externalFunction: Object.assign(interactionFn), interactionFnParams });
    console.log('DONE.');
  }

  if (nextLinkSelector) {
    const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
    if (!hasNextLink) {
      return false;
    }
  }

  const { pager } = dependencies;
  const success = await pager({ keywords, nextLinkSelector, loadedSelector, mutationSelector, spinnerSelector, interactionFn, interactionFnParams });
  if (success) {
    return true;
  }

  let url = await context.evaluate(function () {
    /** @type { HTMLLinkElement } */
    const next = document.querySelector('head link[rel="next"]');
    if (!next) {
      return false;
    }
    return next.href;
  });

  if (!url && openSearchDefinition) {
    url = openSearchDefinition.template
      .replace('{searchTerms}', encodeURIComponent(keywords))
      .replace('{page}', (page + (openSearchDefinition.pageOffset || 0)).toString())
      .replace('{offset}', (offset + (openSearchDefinition.indexOffset || 0)).toString());
  }

  if (!url) {
    return false;
  }

  console.log('Going to url', url);
  await dependencies.goto({ url });
  if (parameters.loadedSelector) {
    await context.waitForSelector(parameters.loadedSelector);
  }
  return true;
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
      description: 'XPath to tell us the page has loaded',
    },
    {
      name: 'openSearchDefinition',
      description: 'Open search definition object',
    },
    {
      name: 'interactionFn',
      description: 'Function which will run after each page is loaded.',
    },
    {
      name: 'interactionFnParams',
      description: 'Function which will run after each page is loaded.',
    },
  ],
  inputs: [{
    name: 'keywords',
    description: 'search terms',
  }, {
    name: 'page',
    description: 'page number (1 indexed)',
  }, {
    name: 'offset',
    description: 'offset (0 indexed)',
  }],
  path: './stores/${store[0:1]}/${store}/${country}/paginate',
  dependencies: {
    pager: 'action:product/search/paginate/pager',
    goto: 'action:navigation/goto',
  },
  implementation,
};
