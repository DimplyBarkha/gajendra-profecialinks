const { transform } = require('./shared');

module.exports = {
  implements: 'product/reviews/extract',
  parameterValues: {
    country: 'AU',
    store: 'liquorland',
    transform,
    domain: 'liquorland.com.au',
    zipcode: '',
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { transform } = parameters;
    const { productReviews } = dependencies;
    await context.waitForXPath('//*[contains (@class, "bv-content-list-reviews")]');
    // ----------------------------------------------
    const cssShowMore = '.bv-content-btn-pages-load-more';

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
          const reviewsButton = document.querySelector('.bv-content-btn-pages-load-more');
          if (reviewsButton) {
            reviewsButton.click();
            await new Promise((resolve, reject) => setTimeout(resolve, 4000));
          } else {
            moreReviews = false;
          }
        }
      });
    }
    // ----------------------------------------------
    await context.evaluate(async () => {
      try{
        const mainUrl = window.location.href;
        let productName = document.querySelector('h1 > .product-name')
                          ? document.querySelector('h1 > .product-name').textContent
                          : '';
        let sku = document.querySelector('[data-bv-product-id]')
                  ? document.querySelector('[data-bv-product-id]').getAttribute('data-bv-product-id')
                  : '';
        let aggrRating = '';
        let gtin = '';
        let brandText = '';
  
        const productProps = document.querySelectorAll('.product-properties li');
        productProps.forEach(productProp => {
          if(productProp.textContent.match(/Brand/gmi)){
            brandText = productProp.querySelector('.val').textContent;
          }
          if(productProp.textContent.match(/gtin/gmi)){
            gtin = productProp.querySelector('.val').textContent;
          }
        });
        

        const jsonObject = document.querySelector('.PDP.loaded script')
                          ? JSON.parse(document.querySelector('.PDP.loaded script').textContent)
                          : {};
        console.log(jsonObject);
        if(jsonObject.aggregateRating && jsonObject.aggregateRating.ratingValue){
          aggrRating = Number(jsonObject.aggregateRating.ratingValue).toFixed(1);
        }

        const reviewItems = document.querySelectorAll('.bv-content-list-reviews>li.bv-content-review, .ReviewTileExpert');
        reviewItems.forEach(reviewItem => {
          reviewItem.setAttribute('lq-brand-text', brandText);
          reviewItem.setAttribute('lq-productName', productName);
          reviewItem.setAttribute('lq-sku', sku);
          reviewItem.setAttribute('lq-gtin', gtin);
          reviewItem.setAttribute('lq-url', mainUrl);
          reviewItem.setAttribute('lq-aggr-rating', aggrRating);
        });
      }catch(e){
        console.log(e);
        document.body.setAttribute('lq-error', e);
      }
    });
    return await context.extract(productReviews, { transform });
  }
};
