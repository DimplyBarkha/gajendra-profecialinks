const { transform } = require('../shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    transform,
    domain: 'asda.com',
    zipcode: "''",
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    const { productReviews } = dependencies;
    // eslint-disable-next-line no-shadow
    const { transform } = parameters;

    // clicking in reviews section

    await context.evaluate(() => {
      const reviewsSection = document.querySelector('button[data-auto-id="tab-1"]');

      if (reviewsSection !== null) {
        // @ts-ignore
        reviewsSection.click();
      }
    });

    async function nextPage () {
      await context.evaluate(() => {
        document.querySelector('button[data-auto-id="btnright"]').click();
      });
    }

    while (true) {
      const date = Date.now();

      const lastPaginationButton = await context.evaluate(() => {
        return document.querySelector(
          'span[class*="asda-icon asda-icon--gray asda-icon--small asda-icon--rotate270"]');
      });

      if (lastPaginationButton !== null) {
        return await context.extract(productReviews, { transform }, 'MERGE_ROWS');
      } else {
        await context.extract(productReviews, { transform }, 'MERGE_ROWS');

        await new Promise((resolve) => setTimeout(resolve, 1500));

        nextPage();
      }
    }
  },
};
