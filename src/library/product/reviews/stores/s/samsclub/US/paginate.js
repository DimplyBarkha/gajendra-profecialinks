
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { loadedSelector, noResultsXPath, nextLinkXpath } = parameters;

  if (loadedSelector) {
    await context.waitForFunction(function (sel, xp) {
      return Boolean(document.querySelector(sel) || document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext());
    }, { timeout: 10000 }, loadedSelector, noResultsXPath);
  }

  console.log('Checking no results', noResultsXPath);

  const checkIfResults = await context.evaluate((xp) => {
    const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
    console.log(xp, r);
    const e = r.iterateNext();
    console.log(e);
    return !e;
  }, noResultsXPath);

  if (!checkIfResults) {
    return false;
  }

  function checkIfReviewIsFromLast30Days (lastDate, reviewDate) {
    console.log('lastDate' + lastDate);
    console.log('reviewDate' + reviewDate);
    const timestamp = new Date(lastDate).getTime() - (30 * 24 * 60 * 60 * 1000);
    console.log('timestamp' + timestamp);
    console.log(new Date(reviewDate).getTime());
    if (new Date(reviewDate).getTime() >= timestamp) {
      console.log('True');
      return true;
    }
    console.log('false');
    return false;
  }

  if (nextLinkXpath) {
    const hasNextLink = await context.evaluate(({ selector }) => {
      const elem = document.evaluate(selector, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
      if (!elem) return false;
      console.log('Clicking', selector);
      elem.click();
      return true;
    }, { selector: nextLinkXpath });
    if (!hasNextLink) return false;
  }

  await new Promise((resolve, reject) => setTimeout(resolve, 2000));

  const lastReviewDate = await context.evaluate(function () {
    return document.querySelector('#lastReviewDate').textContent;
  });

  const reviewDate = await context.evaluate(function () {
    return document.evaluate('//ol[contains(@class,\'bv-content-list-reviews\')]//li[1]//div[contains(@class,\'bv-content-datetime\')]/meta[contains(@itemprop,\'dateCreated\')]', document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue.content;
  });

  // check if the review in the current page should be extracted or not
  if (checkIfReviewIsFromLast30Days(lastReviewDate, reviewDate)) {
    return true;
  }

  return false;
}

module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'US',
    store: 'samsclub',
    nextLinkXpath: '//span[contains(@class,"bv-content-btn-pages-next")]',
    loadedSelector: 'ol.bv-content-list-reviews > li',
    noResultsXPath: '//div[@class="sc-error-page"]',
    domain: 'samsclub.com',
  },
  implementation,
};
