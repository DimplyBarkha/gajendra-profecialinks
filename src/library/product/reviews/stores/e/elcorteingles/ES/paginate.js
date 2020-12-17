
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { page } = inputs;
  const { nextLinkSelector } = parameters;

  function checkIfReviewIsFromLast30Days (lastDate, reviewDate) {
    console.log('lastDate' + lastDate);
    console.log('reviewDate' + reviewDate);
    const timestamp = new Date(lastDate).getTime() - (30 * 24 * 60 * 60 * 1000);
    console.log('timestamp' + timestamp);
    console.log('review date' + new Date(reviewDate).getTime());
    if (new Date(reviewDate).getTime() >= timestamp) {
      console.log('True');
      return true;
    }
    console.log('false');
    return false;
  }

  await new Promise((resolve, reject) => setTimeout(resolve, 1000));

  const reviewDate = await context.evaluate(function () {
    return document.querySelector('div.first-review') ? document.querySelector('div.first-review').textContent : 'no found';
  });

  console.log('page' + page);

  const lastReviewDateOnPage = await context.evaluate(function () {
    return document.evaluate(
      '//ol[contains(@class, "content-list-reviews")]//li[@itemprop="review"][last()]//meta[@itemprop="datePublished"]/@content',
      document,
      null,
      XPathResult.FIRST_ORDERED_NODE_TYPE,
      null,
    ).singleNodeValue.nodeValue;
  });

  // check if the review in the current page should be extracted or not
  if (lastReviewDateOnPage && reviewDate) {
    try {
      checkIfReviewIsFromLast30Days(lastReviewDateOnPage, reviewDate);
      await context.waitForSelector(nextLinkSelector, { timeout: 30000 });
      await context.click(nextLinkSelector);
      console.log('continue');
    } catch (err) {
      console.log(`Couldn't load selector => ${nextLinkSelector}`);
      console.log('force stop');
      return false;
    }
    return true;
  }
  return false;
}

module.exports = {
  implements: 'navigation/paginate',
  parameterValues: {
    template: null,
    country: 'ES',
    store: 'elcorteingles',
    nextLinkSelector: 'li[class*="item-next"]>a',
    resultsDivSelector: '*[class*="content-list-reviews"]',
    domain: 'elcorteingles.es',
    zipcode: '',
  },
  implementation,
};
