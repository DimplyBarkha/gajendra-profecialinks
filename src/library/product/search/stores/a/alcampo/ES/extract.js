async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;

  const nextLink = await context.evaluate(() => {
    const nextSelector = document.querySelector('div.productGrid.paginationBar.bottom.clearfix>div.right>ul.pagination>li.next>a');

    return nextSelector;
  });

  await context.extract(productDetails);

  // manually added clicking in nextLink button

  if (nextLink) {
    while (nextLink) {
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

      await context.evaluate(() => {
        function addProp (selector, iterator, propName, value) {
          document.querySelectorAll(selector)[iterator].setAttribute(propName, value);
        };

        const manufacturer = document.querySelectorAll('.marca');
        const price = document.querySelectorAll('.priceContainer');
        let priceIteration;
        let manufacturerIteration;
        let words;

        document.querySelector('ul.dpd-cortesia').setAttribute('searchUrl', window.location.href);

        // there are same number of products so i < price.length will work for i < manufacturer.length

        for (let i = 0; i < price.length; i++) {
          priceIteration = price[i].textContent;

          priceIteration = priceIteration.replace(/\s\s+/g, '');
          priceIteration = priceIteration.replace('Unidad', '');

          manufacturerIteration = manufacturer[i].textContent;
          manufacturerIteration.replace(/\s\s+/g, '');
          words = manufacturerIteration.match(/([\w+]+)/g);

          if (words.length <= 1) {
            manufacturerIteration = words;
          } else {
            manufacturerIteration = words[0] + ' ' + words[1];
          };

          addProp('.priceContainer', i, 'price', priceIteration);
          addProp('.marca', i, 'manufacturer', manufacturerIteration);
          addProp('div.fila4.productGridRow>div>div', i, 'rank', `${i + 1}`);
          addProp('div.fila4.productGridRow>div>div', i, 'rankorganic', `${i + 1}`);
        };
      });

      // if nextLinkSelector is null extract page and break loop, else click in it

      if (await context.evaluate(() => {
        return document.querySelector('div.productGrid.paginationBar.bottom.clearfix>div.right>ul.pagination>li.next>a'); 
      }) === null) {
        return await context.extract(productDetails);
      } else {
        await context.extract(productDetails);

        await new Promise((resolve, reject) => setTimeout(resolve, 5000));
        await context.evaluate(() => {
          document.querySelector('div.productGrid.paginationBar.bottom.clearfix>div.right>ul.pagination>li.next>a').click();
        });
      }

      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
    }
  } else {
    return await context.extract(productDetails);
  }
};

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
