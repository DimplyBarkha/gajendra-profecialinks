
module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    country: 'ES',
    store: 'bebitus',
    nextLinkXpath: '//li[contains(@class,"bv-content-pagination-buttons-item-next")]/a',
    loadedSelector: 'div.visible',
    domain: 'bebitus.com',
  },
  implementation,
};
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { page } = inputs;
  const { noResultsXPath, nextLinkXpath } = parameters;

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

  await new Promise((resolve, reject) => setTimeout(resolve, 1000));

  console.log('page' + page);

  const lastReviewDate = await context.evaluate(function () {
    return document.querySelector('a.last-review-date').textContent;
  });

  const reviewDate = await context.evaluate(function (page) {
    return document.querySelector('ol.bv-content-list.bv-content-list-reviews li.bv-content-item.bv-content-top-review.bv-content-review:last-child div.bv-content-datetime meta:first-child') &&
    document.querySelector('ol.bv-content-list.bv-content-list-reviews li.bv-content-item.bv-content-top-review.bv-content-review:last-child div.bv-content-datetime meta:first-child').getAttribute('content');
  }, page);

  // check if the review in the current page should be extracted or not
  if (checkIfReviewIsFromLast30Days(lastReviewDate, reviewDate)) {
    if (nextLinkXpath) {
      const hasNextLink = await context.evaluate(async function () {
        function timeout (ms) {
          return new Promise((resolve) => setTimeout(resolve, ms));
        }
  
        const next = document.querySelector('li.bv-content-pagination-buttons-item-next a');
        if (!next) return false;
        // @ts-ignore
        next.click();
        await timeout(5000);
        return true;
      }, { selector: nextLinkXpath });
      if (!hasNextLink) return false;
    }
    console.log('continue');
    return true;
  }
  console.log('Force stop pagination');
  return false;
}
