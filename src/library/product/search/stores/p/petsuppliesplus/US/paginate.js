async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { keywords, page, offset } = inputs;
  const { nextLinkSelector, loadedSelector, noResultsXPath, mutationSelector, spinnerSelector, openSearchDefinition } = parameters;

  if (nextLinkSelector) {
    const hasNextLink = await context.evaluate((selector) => !!document.querySelector(selector), nextLinkSelector);
    if (!hasNextLink) {
      return false;
    }
  }

  // -------- Replacing pager function since context.click is not working selector 'div.c-pagination__right > span.c-pagination__navigate'
  if (!spinnerSelector) {
    // this may replace the section with a loader

    if (nextLinkSelector) {
      console.log('clicking', nextLinkSelector);
      // selected page no is 1

      const oldPageNum = await context.evaluate(function () {
        const element = document.querySelector('li.coveo-active');
        if (element) {
          return element.textContent;
        } else {
          return null;
        }
      });
      console.log(`${oldPageNum}`);
      await context.click(nextLinkSelector);
      // check if page is different
      await context.waitForNavigation({ timeout: 30000 });
      const newPageNum = await context.evaluate(function () {
        const element = document.querySelector('li.coveo-active+li>a');
        if (element) {
          return element.textContent;
        } else {
          return null;
        }
      });
      console.log('newPageNum');
      console.log(`${newPageNum}`);
      if (oldPageNum === newPageNum) {
        await stall(30000);
      }

      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      
      if (loadedSelector) {
        await context.waitForSelector(loadedSelector, { timeout: 20000 });
      }
      return true;
    }
    await context.waitForFunction((selector) => {
      console.log(selector, document.querySelector(selector));
      return !document.querySelector(selector);
    }, { timeout: 20000 }, spinnerSelector);
    console.log('Spinner went away', spinnerSelector);
    return true;
  }

  if (mutationSelector) {
    // this may replace the section with a loader
    await Promise.all([
      context.click(nextLinkSelector),
      // possible race condition if the data returned too fast, but unlikely
      context.waitForMutuation(mutationSelector, { timeout: 30000 }),
    ]);
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
    const pageNb = page + openSearchDefinition.pageStartNb - 1;
    url = openSearchDefinition.template
      .replace('{searchTerms}', encodeURIComponent(keywords))
      .replace('{page}', (pageNb + (openSearchDefinition.pageOffset || 0)).toString())
      .replace('{index}', (pageNb * (openSearchDefinition.pageIndexMultiplier || 0)).toString())
      .replace('{offset}', (offset + (openSearchDefinition.indexOffset || 0)).toString());
  }

  if (!url) {
    return false;
  }

  console.log('Going to url', url);
  await dependencies.goto({ url });
  await stall(60000);
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
  implements: 'product/search/paginate',
  parameterValues: {
    country: 'US',
    store: 'petsuppliesplus',
    nextLinkSelector: 'li.coveo-active+li>a',
    loadedSelector: 'div.coveo-result-list-container',
    noResultsXPath: '//div[@class="coveo-query-summary-no-results-string"]',
    mutationSelector: 'li.coveo-active',
    openSearchDefinition: {
      template: 'https://petsuppliesplus.com/Search#q={searchTerms}&first={index}&sort=relevancy',
      pageIndexMultiplier: 24,
      pageOffset: 1,
      pageStartNb: 0
    },
    domain: 'petsuppliesplus.com',
  },
  implementation,
};
