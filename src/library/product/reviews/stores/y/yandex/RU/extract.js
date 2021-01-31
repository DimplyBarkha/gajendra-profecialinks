async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { productReviews } = dependencies;

  const cssCookiesDiv = 'body._12JXUyMYfl';
  const cssReviews = 'div#scroll-to-reviews-list';
  const cssReviewsRow = 'div[data-zone-name="product-review"]';
  const cssShowMore = 'a._3OFYTyXi90';

  const isSelectorAvailable = async (cssSelector) => {
    return await context.evaluate(function (selector) {
      return !!document.querySelector(selector);
    }, cssSelector);
  };

  await context.waitForSelector(cssCookiesDiv, { timeout: 10000 });

  // const coockiesAvailable = await isSelectorAvailable(cssCookies);
  // if (coockiesAvailable) {
  //   await context.click(cssCookies);
  // }

  const reviewsAvailable = await isSelectorAvailable(cssReviews);
  if (reviewsAvailable) {
    await context.click(cssReviews);
  }

  await context.waitForSelector(cssReviewsRow, { timeout: 5000 });

  const showMoreAvailable = await isSelectorAvailable(cssShowMore);
  console.log(`showMoreAvailable: ${showMoreAvailable}`);
  if (showMoreAvailable) {
    await context.waitForNavigation({ timeout: 2000, waitUntil: 'load' });
    await context.evaluate(async function () {
      let moreReviews = true;
      while (moreReviews) {
        // console.log('Clicked...............');
        const reviewsButton = document.querySelector('a._3OFYTyXi90');
        if (reviewsButton) {
          reviewsButton.click();
          await new Promise((resolve, reject) => setTimeout(resolve, 4000));
        } else {
          moreReviews = false;
        }
      }
    });
  }

  return await context.extract(productReviews);
}

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'RU',
    store: 'yandex',
    transform: null,
    domain: 'yandex.ru',
    zipcode: '',
  },
};
