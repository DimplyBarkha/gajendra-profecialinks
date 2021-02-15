
module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'UK',
    store: 'asda',
    // transform,
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
    const { transform } = parameters;

    // clicking in reviews section

    await context.evaluate(() => {
      const reviewsSection = document.querySelector('button[data-auto-id="tab-1"]');

      if (reviewsSection !== null) {
        reviewsSection.click();
      }
    });

    async function getElementByXpath (path) {
      await context.evaluate(() => {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      }, path);
    }

    getElementByXpath('//button[@data-auto-id="btnright"]');

    // async function nextPage () {
    //   await context.evaluate(() => {
    //     document.querySelector('div.pdp-description-reviews__review-pagination-cntr button[data-auto-id="btnright"]').click();
    //   });
    // }

    // const currentPage = await context.evaluate(() => {
    //   document.querySelector('select.co-dropdown__select.co-pagination__select').click();
    //   return parseInt(document.querySelector('select.co-dropdown__select.co-pagination__select').lastElementChild.textContent);
    // });

    // const lastPage = await context.evaluate(() => {
    //   return parseInt(document.querySelector(
    //     'button.asda-link.asda-link--primary.asda-link--button.co-pagination__last-page').textContent);
    // });

    // if (currentPage === lastPage) {
    //   return await context.extract(productReviews, 'MERGE_ROWS');
    // } else {
    //   await context.extract(productReviews, 'MERGE_ROWS');

    //   // waiting for extraction

    //   await new Promise((resolve) => setTimeout(resolve, 3000));

    //   nextPage();
    // }
    return await context.extract(productReviews, 'MERGE_ROWS');
  },
};
