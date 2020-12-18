/**
 *
 * @param { { keywords: string, zipcode: string } } inputs
 * @param { { url: string, loadedSelector?: string, noResultsXPath: string } } parameters
 * @param { ImportIO.IContext } context
 * @param { { goto: ImportIO.Action} } dependencies
 */
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  console.log('params', parameters);
  const url = parameters.url.replace('{searchTerms}', encodeURIComponent(inputs.keywords));
  await dependencies.goto({ url, zipcode: inputs.zipcode });

  async function timeout1(ms) {
    console.log('waiting for ' + ms + ' millisecs');
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  await timeout1(5000);

  await context.evaluate(async () => {
    async function timeout(ms) {
      console.log('waiting for ' + ms + ' millisecs');
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    let loaderSel = 'span[data-search="product"][class*="search-results__loader"]';
    let loaderElm = document.querySelectorAll(loaderSel);
    let waitMax = 120000;
    let checkAfter = 500;
    let timeBeing = 0;
    let isLoaderPresent = false;
    if(loaderElm.length > 0) {
      console.log('we have loader -- need to wait');
      isLoaderPresent = true;
      if(loaderElm.length === 1) {
        while(isLoaderPresent) {
          await timeout(checkAfter);
          timeBeing = timeBeing + checkAfter;
          if(timeBeing > waitMax) {
            console.log('we have waited for too long - ' + timeBeing + ' Still the loader is there');
            break;
          }
          loaderElm = document.querySelectorAll(loaderSel);
          if(loaderElm.length === 0) {
            isLoaderPresent = false;
          }
        }
        console.log('do we still have the loader - ' + isLoaderPresent);

      } else {
        console.log('we have many loaders - not sure what to do');
      }
    } else {
      console.log('no loader found - can steer through');
    }
  });

  if (parameters.loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, parameters.loadedSelector, parameters.noResultsXPath);
  }
  console.log('Checking no results', parameters.noResultsXPath);
  return await context.evaluate(function (xp) {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, parameters.noResultsXPath);
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
    {
      name: 'loadedSelector',
      description: 'XPath to tell us the page has loaded',
      optional: true,
    },
    {
      name: 'noResultsXPath',
      description: 'XPath to tell us the page has loaded',
    },
  ],
  inputs: [
    {
      name: 'keywords',
      description: 'keywords to search for',
      type: 'string',
    },
    {
      name: 'zipcode',
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
