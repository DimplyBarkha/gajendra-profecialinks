
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
    lastDate = lastDate.replace(/(\d+)(st|nd|rd|th)/, '$1');
    reviewDate = reviewDate.replace(/(\d+)(st|nd|rd|th)/, '$1');
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

  let lastReviewDate = null;

  // Get the last review date in the page 1
  if (!lastReviewDate) {
    lastReviewDate = await context.evaluate(function () {
      return document.querySelectorAll('div#review-data > article > section:first-child > p > span.submission-time')[0].textContent;
    });
  }

  const reviewDate = await context.evaluate(function () {
    return document.querySelectorAll('div#review-data > article > section:first-child > p > span.submission-time')[0].textContent;
  });

  // check if the review in the current page should be extracted or not
  if (checkIfReviewIsFromLast30Days(lastReviewDate, reviewDate)) {
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
    await context.waitForNavigation({ timeout: 40000 });
    return true;
  }
  return false;
}

module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'UK',
    store: 'tesco',
    nextLinkXpath: '//p[contains(@class,"ShowMore")]/a',
    loadedSelector: 'div#review-data',
    noResultsXPath: '//h2[contains(.,"No reviews")]',
    domain: 'tesco.com',
    zipcode: '',
  },
  implementation,
};
