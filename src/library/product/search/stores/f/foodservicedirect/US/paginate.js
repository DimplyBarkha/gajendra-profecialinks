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
  if (spinnerSelector) {
    // this may replace the section with a loader

    if (nextLinkSelector) {
      console.log('Clicking', nextLinkSelector);
      // selected page no is 1

      const oldPageNum = await context.evaluate(function () {
        const element = document.querySelector('li.c-pagination__number--active');
        if (element) {
          return element.textContent;
        } else {
          return null;
        }
      });
      console.log(oldPageNum);
      await context.click(nextLinkSelector);
      // check if page is different
      await context.waitForNavigation({ timeout: 30000 });
      const newPageNum = await context.evaluate(function () {
        const element = document.querySelector('li.c-pagination__number--active');
        if (element) {
          return element.textContent;
        } else {
          return null;
        }
      });
      console.log('newPageNum');
      console.log(newPageNum);
      if (oldPageNum === newPageNum) {
        await context.evaluate(function () {
          if (document.querySelector('div.c-pagination__right > span.c-pagination__navigate')) {
            document.querySelector('div.c-pagination__right > span.c-pagination__navigate').click();
          }
        });
        await context.waitForNavigation({ timeout: 30000 });
      }

      await context.waitForNavigation({ timeout: 30000 });
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
      context.waitForMutuation(mutationSelector, { timeout: 20000 }),
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
    store: 'foodservicedirect',
    nextLinkSelector: 'div.c-pagination__right > span.c-pagination__navigate',
    spinnerSelector: 'div.c-loading-spinner',
    loadedSelector: 'div.c-product-card',
    noResultsXPath: '//h2[contains(@class, "p-no-result__intro-title")]',
    openSearchDefinition: null,
    domain: 'foodservicedirect.com',
  },
  implementation,
};
