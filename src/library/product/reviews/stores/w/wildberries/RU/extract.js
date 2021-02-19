const { transform } = require('./shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'RU',
    store: 'wildberries',
    transform,
    domain: 'wildberries.ru',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productReviews } = dependencies;
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop <= 20000) {
        await stall(100);
        scrollTop += 1000;
        window.scroll(0, scrollTop);
        if (scrollTop === 20000) {
          await stall(1000);
          break;
        }
      }
      function stall (ms) {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
    });
    await context.waitForXPath('//*[contains (@id, "Comments")]');
    // ----------------------------------------------
    const cssShowMore = '#Comments a.show-more[data-link]';

    const isSelectorAvailable = async (cssSelector) => {
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };
  
    const showMoreAvailable = await isSelectorAvailable(cssShowMore);
    console.log(`showMoreAvailable: ${showMoreAvailable}`);
    if (showMoreAvailable) {
      await context.waitForNavigation({ timeout: 2000, waitUntil: 'load' });
      await context.evaluate(async function () {
        let moreReviews = true;
        while (moreReviews) {
        const reviewsButton = document.querySelector('#Comments a.show-more[data-link]');
          if (reviewsButton.style.display !== 'none') {
            reviewsButton.click();
            console.log('Click', reviewsButton);
            await new Promise((resolve, reject) => setTimeout(resolve, 2000));
          } else {
            moreReviews = false;
            console.log('Click else');

          }
        }
      });
    }
    // ----------------------------------------------
    await context.evaluate(async () => {
      try{
        const mainUrl = window.location.href;
        let productName = document.querySelector('span.name ')
                          ? document.querySelector('span.name ').textContent
                          : '';
        let sku = document.querySelector('[data-nm-id]')
                  ? document.querySelector('[data-nm-id]').getAttribute('data-nm-id')
                  : '';
        let aggrRating = document.querySelector('.result-value')
                       ? document.querySelector('.result-value').textContent
                       : '';
        let gtin = '';
        let brandText = document.querySelector('meta[itemprop="brand"]')
                      ? document.querySelector('meta[itemprop="brand"]').getAttribute('content')
                      : '';
        let commentCount = document.querySelector('#a-Comments').textContent.replace(/\D/gmi, '');
          


        const reviewItems = document.querySelectorAll('.comment.j-b-comment');
        reviewItems.forEach(reviewItem => {
          let commentText = '';
          reviewItem.querySelectorAll('p[itemprop="reviewBody"]').forEach(textPar => {
            commentText = commentText + ' ' + textPar.textContent;
          });

          reviewItem.setAttribute('wd-brand-text', brandText);
          reviewItem.setAttribute('wd-productName', productName);
          reviewItem.setAttribute('wd-sku', sku);
          reviewItem.setAttribute('wd-gtin', gtin);
          reviewItem.setAttribute('wd-url', mainUrl);
          reviewItem.setAttribute('wd-aggr-rating', aggrRating);
          reviewItem.setAttribute('wd-comments-count', `${commentCount}`);
          reviewItem.setAttribute('wd-comments-text', `${commentText.trim()}`);
        });
      }catch(e){
        console.log(e);
        document.body.setAttribute('lq-error', e);
      }
    });
    return await context.extract(productReviews, { transform });
  }
};
