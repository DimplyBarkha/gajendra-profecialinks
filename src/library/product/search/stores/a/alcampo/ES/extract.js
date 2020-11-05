async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const extract = [];

  const nextSelector = await context.evaluate(() => {
    const ResultSelector = document.querySelector('div.productGrid.paginationBar.bottom.clearfix>div.right>ul.pagination>li.next>a');

    return ResultSelector;
  });

  const pagesLength = await context.evaluate(() => {
    const allProductsString = document.querySelector('div.totalResults.cartReviewTotal').textContent.match(/(.*[0-9])/);
    const allProductsNumber = parseInt(allProductsString);
    const productsPerPage = document.querySelectorAll('div.productGrid>div>div').length;

    const pagesNumber = (allProductsNumber / productsPerPage);

    return pagesNumber;
  });

  await context.extract(productDetails);

  if (nextSelector !== null && nextSelector !== undefined) {
    while (true) {
      await new Promise((resolve, reject) => setTimeout(resolve, 6000));

      const isPopupPresent = await context.evaluate(async () => {
        return document.querySelector('div.cc_css_reboot.cc_dialog.light.interstitial');
      });
      // when the popup is present it returns undefined, when not - null
      if (isPopupPresent !== null) {
        await context.evaluate(() => {
          document.querySelector('div.cc_css_reboot.cc_dialog.light.interstitial').remove();
          document.querySelector('.cc_overlay_lock').remove();
        });
      }

      await new Promise((resolve, reject) => setTimeout(resolve, 3000));

      extract.push(await context.extract(productDetails));

      await context.evaluate(() => {
        document.querySelector('div.productGrid.paginationBar.bottom.clearfix>div.right>ul.pagination>li.next>a').click();
      });

      await new Promise((resolve, reject) => setTimeout(resolve, 60000));

      return extract;
    }
  };
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'alcampo',
    transform: null,
    domain: 'alcampo.es',
    zipcode: '',
  },
  implementation,
};
