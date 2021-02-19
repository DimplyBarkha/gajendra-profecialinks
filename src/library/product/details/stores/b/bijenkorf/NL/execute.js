
module.exports = {
  implements: 'product/details/execute',
  parameterValues: {
    country: 'NL',
    store: 'bijenkorf',
    domain: 'debijenkorf.nl',
    loadedSelector: 'div.dbk-productdetail__container',
    noResultsXPath: '//div[contains(@class, "div.dbk-search-empty")]',
    zipcode: '',
  },
  implementation: async function (
    inputs,
    parameters,
    context,
    dependencies,
  ) {
    let productDetailsLink = null;

    async function navigateWithProductId () {
      if (inputs.id) {
        const searchUrl = `https://ceres-catalog.debijenkorf.nl/catalog/product/show?productVariantCode=${inputs.id}&cached=false&locale=nl_NL&api-version=2.34`;
        try {
          await context.goto(searchUrl, {
            timeout: 30000,
            waitUntil: 'load',
            checkBlocked: true,
            js_enabled: true,
            css_enabled: false,
            random_move_mouse: true,
          });
        } catch (e) {
          console.log(e);
        }
        productDetailsLink = await context.evaluate(function () {
          let url = null;
          let htmlContent = document.querySelector('pre').textContent;
          if (htmlContent) {
            htmlContent = JSON.parse(htmlContent);
            if (htmlContent.data && htmlContent.data.product && htmlContent.data.product.currentVariantProduct) {
              console.log(htmlContent.data.product.currentVariantProduct.url);
              url = htmlContent.data.product.currentVariantProduct.url;
              return url;
            } else if (htmlContent.data && htmlContent.data.product) {
              console.log(htmlContent.data && htmlContent.data.product.url);
              url = htmlContent.data && htmlContent.data.product.url;
            }
          }
          return `https:${url}`;
        });
      } else if (inputs.url) {
        productDetailsLink = inputs.url;
      }
    }
    await navigateWithProductId();

    console.log('product url', productDetailsLink);
    if (productDetailsLink) {
      // const url = `https:${productDetailsLink}`;
      const finalUrl = `${productDetailsLink}`;
      await context.setBlockAds(false);
      await context.setLoadAllResources(true);
      await context.setLoadImages(true);
      await context.goto(finalUrl, {
        timeout: 30000,
        waitUntil: 'load',
        checkBlocked: true,
        js_enabled: true,
        css_enabled: false,
        random_move_mouse: true,
      });
    } else {
      return false;
    }
    async function autoScroll (page) {
      await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
          var totalHeight = 0;
          var distance = 100;
          var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;
            if (totalHeight >= scrollHeight) {
              clearInterval(timer);
              resolve();
            }
          }, 100);
        });
      });
    }
    await autoScroll(context);
    return await context.evaluate(function (xp) {
      const r = document.evaluate(xp, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      console.log(xp, r);
      const e = r.iterateNext();
      console.log(e);
      return !e;
    }, parameters.noResultsXPath);
  },
};
