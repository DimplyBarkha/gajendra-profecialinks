const { transform } = require('../format');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PL',
    store: 'euro',
    transform: transform,
    domain: 'euro.com.pl',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const cssProduct = '.product-header';
    const cssProductDetails = 'a[href*="opis"]';
    await context.evaluate(async () => {
      const noResults = document.querySelector('div#empty-search');
      const noResultsSelector = document.querySelector('div.suggestion-try');
      if (noResults || noResultsSelector) {
        throw new Error('No Results found for SKU');
      }
    });
    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    console.log('.....waiting......');
    await context.waitForSelector(cssProduct, { timeout: 10000 });

    const productAvailable = await isSelectorAvailable(cssProduct);
    console.log(`productAvailable: ${productAvailable}`);
    if (productAvailable) {
      console.log('clicking product link');
      const productDescAvailable = await isSelectorAvailable(cssProductDetails);
      await context.waitForSelector(cssProductDetails, { timeout: 10000 });
      if (productDescAvailable) {
        await context.click(cssProductDetails);
        await context.waitForNavigation({ timeout: 10000, waitUntil: 'load' });
        // await context.waitForSelector(cssProductDetails);
        // const productDetailsAvailable = await isSelectorAvailable(cssProductDetails);
        console.log(`productDescAvailable: ${productDescAvailable}`);
        if (!productDescAvailable) {
          //  throw new Error('ERROR: Failed to load product details page');
        }
        console.log('navigation complete!!');
      }
    }

    await context.evaluate(async () => {
      const descEl = document.querySelector('.description-content-inner');

      if (descEl) {
        const readMoreText = document.querySelector('button[data-read-more="Rozwiń pełny opis"]');
        if (readMoreText) {
          readMoreText.remove();
        }
        const styleEl = descEl.querySelectorAll('style');
        const scriptEl = descEl.querySelectorAll('script');

        for (const el of styleEl) {
          el.remove();
        }

        for (const el of scriptEl) {
          el.remove();
        }
      }

      const videoThumbnailEl = document.querySelector('.miniatures-video a');

      if (videoThumbnailEl) {
        videoThumbnailEl.click();
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(6000);
        const videoLoaded = document.querySelectorAll('#multimedia-preview li.video');

        for (const item of videoLoaded) {
          const newEl = document.createElement('import-video');
          newEl.setAttribute('data', item.getAttribute('data-src'));
          document.body.appendChild(newEl);
        }
      }
    });
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.extract(productDetails, { transform });
  },
};
