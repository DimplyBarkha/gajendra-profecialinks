
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'DE',
    store: 'whisky',
    transform: null,
    domain: 'whisky.de',
  },
  implementation: async ({ url }, { country, domain }, context, { productDetails }) => {
    await context.waitForSelector('div[class="article-left article-thumbnail"] a[class="title"]', 3000);
    // await context.click('div[class="article-left article-thumbnail"] a[class="title"]');
    document.getElementById('searchList_1').click();
    await new Promise(r => setTimeout(r, 6000));
    await context.evaluate(async function () {
    });
    return await context.extract(productDetails);
  },
};
