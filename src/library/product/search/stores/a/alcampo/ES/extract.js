/* eslint-disable no-unmodified-loop-condition */

const { transform } = require('../../../../shared');

async function implementation (inputs, parameters, context, dependencies) {
  const { productDetails } = dependencies;
  const { transform } = parameters;

  // manually added clicking in nextLink button

  do {
    const isPopupPresent = await context.evaluate(async () => {
      return document.querySelector('div.cc_css_reboot.cc_dialog.light.interstitial');
    });
    // when the popup is present it returns undefined, when not - null
    await context.waitForSelector('div[class="cc_css_reboot cc_dialog light interstitial"]');

    if (isPopupPresent !== null) {
      await context.evaluate(() => {
        document.querySelector('div.cc_css_reboot.cc_dialog.light.interstitial').remove();
        document.querySelector('.cc_overlay_lock').remove();
      });
    }

    await context.evaluate(async () => {
      // scroll
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      let scrollTop = 0;
      const scrollLimit = 10000;
      while (scrollTop <= scrollLimit) {
        await stall(1000);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
      }
    });

    await context.evaluate(() => {
      const manufacturer = document.querySelectorAll('.marca');
      const price = document.querySelectorAll('.priceContainer');
      const productUrlAll = document.querySelectorAll('a.productMainLink.productTooltipClass');
      let productUrl;
      const productImage = document.querySelectorAll('div[class="thumb cut-alt-img"]>img');
      let image;
      let priceIteration;
      let manufacturerIteration;
      let words;

      // there are same number of products so i < price.length will work for i < manufacturer.length

      for (let i = 0; i < price.length; i++) {
        image = productImage[i].src;
        priceIteration = price[i].textContent;

        priceIteration = priceIteration.replace(/\s\s+/g, '');
        priceIteration = priceIteration.replace('Unidad', '');

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

        document.querySelectorAll('div.fila4.productGridRow>div>div')[i].setAttribute('rank', `${i + 1}`);
        document.querySelectorAll('div.fila4.productGridRow>div>div')[i].setAttribute('rankorganic', `${i + 1}`);
        document.querySelectorAll('.priceContainer')[i].setAttribute('price', priceIteration);
        document.querySelectorAll('.marca')[i].setAttribute('manufacturer', manufacturerIteration);
        document.querySelectorAll('div[class="thumb cut-alt-img"]')[i].setAttribute('imageurl', image);
      };
    });

    // if nextLinkSelector is null extract page and break loop, else click in it

    if (await context.evaluate(() => {
      return document.querySelector('div.productGrid.paginationBar.bottom.clearfix>div.right>ul.pagination>li.next>a');
    }) === null || await context.evaluate(() => {
      const page = window.location.href.match('page=([0-9]+)');
      if (page !== null) {
        if ((parseInt(page[1]) + 1) * 48 <= 200) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    })) {
      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      return await context.extract(productDetails, { transform });
    } else {
      await context.extract(productDetails, { transform });

      await new Promise((resolve, reject) => setTimeout(resolve, 3000));
      await context.evaluate(() => {
        document.querySelector('div.productGrid.paginationBar.bottom.clearfix>div.right>ul.pagination>li.next>a').click();
      });
    }
    await new Promise((resolve, reject) => setTimeout(resolve, 3000));
  } while (true);
};

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'ES',
    store: 'alcampo',
    transform,
    domain: 'alcampo.es',
    zipcode: '',
  },
  implementation,
};
