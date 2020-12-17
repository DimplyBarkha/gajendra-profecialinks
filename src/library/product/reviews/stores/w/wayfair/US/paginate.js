
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { page } = inputs;
  // NOTE: Ugly hack to avoid nightmare timeout error in case of more reviews, limiting pages to 35

  if (page > 35) {
    return false;
  }

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

  await new Promise((resolve, reject) => setTimeout(resolve, 1000));

  const lastReviewDate = await context.evaluate(function () {
    return document.querySelector('div:first-child>article[class="ProductReview"]>div>div>p[class*="pl-Text"]').textContent;
  });

  console.log('page' + page);

  const reviewDate = await context.evaluate(function (page) {
    const elePosition = (page - 1) * 10 + 1;
    console.log('elePosition' + elePosition);
    return document.querySelector(`div:nth-child(${elePosition})>article[class="ProductReview"]>div>div>p[class*="pl-Text"]`).textContent;
  }, page);

  const productsCount = await context.evaluate(function () {
    return document.querySelectorAll('div[class*="pl-Box--mt"]>div>article[class="ProductReview"]').length;
  });

  if (productsCount > 1000) {
    return false;
  }

  // check if the review in the current page should be extracted or not
  if (checkIfReviewIsFromLast30Days(lastReviewDate, reviewDate)) {
    return true;
  }

  return false;
}

module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'US',
    store: 'wayfair',
    nextLinkXpath: '//div[contains(@class,"ProductReviewList-links")]//button',
    loadedSelector: 'div.pl-Container> div > article',
    noResultsXPath: '//div[@class="RatingBlock"]/p[contains(.,"no review")]',
    domain: 'wayfair.com',
    zipcode: '',
  },
  implementation,
};
