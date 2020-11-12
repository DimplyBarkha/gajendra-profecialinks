/* eslint-disable no-unmodified-loop-condition */
async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;

  const nextLink = await context.evaluate(() => {
    const nextSelector = document.querySelector('div.productGrid.paginationBar.bottom.clearfix>div.right>ul.pagination>li.next>a');

    return nextSelector;
  });

  // manually added clicking in nextLink button

  do {
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
      const manufacturer = document.querySelectorAll('.marca');
      const price = document.querySelectorAll('.priceContainer');
      const productUrlAll = document.querySelectorAll('a.productMainLink.productTooltipClass');
      let productUrl;
      // let productUrlIteration;
      let priceIteration;
      let manufacturerIteration;
      let words;

      // there are same number of products so i < price.length will work for i < manufacturer.length

      for (let i = 0; i < price.length; i++) {
        priceIteration = price[i].textContent;

        priceIteration = priceIteration.replace(/\s\s+/g, '');
        priceIteration = priceIteration.replace('Unidad', '');

        document.querySelectorAll('.priceContainer')[i].setAttribute('price', priceIteration);

        // productUrlIteration = productUrlAll[i].href;

        if (productUrlAll[i].href.includes('https')) {
          productUrl = productUrlAll[i].href;
        } else {
          productUrl = 'https://www.alcampo.es/' + productUrlAll[i].href;
        };

        document.querySelectorAll('a.productMainLink.productTooltipClass')[i].setAttribute('producturl', productUrl);

        manufacturerIteration = manufacturer[i].textContent;
        manufacturerIteration.replace(/\s\s+/g, '');
        words = manufacturerIteration.match(/([\w+]+)/g);

        if (words.length <= 1) {
          manufacturerIteration = words;
        } else {
          manufacturerIteration = words[0] + ' ' + words[1];
        };

        document.querySelectorAll('.marca')[i].setAttribute('manufacturer', manufacturerIteration);

        document.querySelectorAll('div.fila4.productGridRow>div>div')[i].setAttribute('rank', `${i + 1}`);
        // @ts-ignore
        document.querySelectorAll('div.fila4.productGridRow>div>div')[i].setAttribute('rankorganic', `${i + 1}`);
      };
    });

    await context.evaluate(async () => {
      // scroll
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      var match = document.querySelectorAll('li.product-item--row.js_item_root')
        .length;

      let scrollTop = 0;
      const scrollLimit = match * 334;
      while (scrollTop <= scrollLimit) {
        scrollTop += 1006;
        window.scroll(0, scrollTop);
        await stall(10000);
      }
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
  } while (nextLink !== null);
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
