module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'PL',
    store: 'makro',
    transform: null,
    domain: 'makro.pl',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, { productDetails }) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (await context.evaluate(() => !!document.querySelector('div.cookie-law-footer button'))) {
      await context.click('div.cookie-law-footer button');
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));

    let resultsOnPage = await context.evaluate(async () => document.querySelectorAll('div[class$="card-article-2--list-container-flex"] > span > div').length);
    let loadMoreButton = await context.evaluate(async () => !!document.querySelector('a[class$="load-more-articles"]'));
    while (resultsOnPage < 150 && loadMoreButton) {
      await context.clickAndWaitForNavigation('a[class$="load-more-articles"]');
      resultsOnPage = await context.evaluate(async () => document.querySelectorAll('div[class$="card-article-2--list-container-flex"] > span > div').length);
      loadMoreButton = await context.evaluate(async () => !!document.querySelector('a[class$="load-more-articles"]'));
    }

    return await context.extract(productDetails);
  },
};
