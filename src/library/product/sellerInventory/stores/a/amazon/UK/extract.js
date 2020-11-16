const { transform } = require('../../../../shared');
async function getStockFunc ({ context, sellerId, id }) {

  const pageContext = async () => {
    return await context.evaluate(() => {
      console.log('context.evaluate');
      const selectors = {
        hasProdDetails: '#prodDetails, #detailBullets_feature_div',
        hasSalesRank: '#detailBullets_feature_div a[href*="bestsellers"], #detailBullets a[href*="bestsellers"], #prodDetails a[href*="bestsellers"], #SalesRank',
        isProductPage: 'link[rel*=canonical][href*="/dp/"]',
        isCartPage: '#sc-active-cart',
        isReviewsPage: 'link[rel*=canonical][href*=product-reviews]',
        isBestSellerPage: 'link[rel*=canonical][href*="/zgbs/"]',
        isSearchPage: '#search',
        isCartTransitionPage: '#huc-v2-confirm-text-container',
        hasSalesRankBadge: '#ppd i[class*="best-seller-badge"]',
        isCaptchaPage: 'img[src*="/captcha/"]',
        hasAplus: '#aplus',
        hasProductDescription: '#productDescription',
        hasShippingDetails: '#contextualIngressPtLabel_deliveryShortLine',
        hasCookieAcceptRequest: '#sp-cc-accept',
        hasDogsofAmazon: 'img[alt*="Dogs of Amazon"]',
        is400Page: 'a[href*="404_logo"]',
        is500Page: 'img[src*="500-title"], a[href*="503_logo"], a img[src*="503.png"], a[href*="ref=cs_503_link"]',
        hasTitle: 'title, #gouda-common-atf h1',
        hasProdsToDeleteInCart: 'div[data-asin] div[class*=removed]:not([style=""]) + div input[value*="Delete"], .sc-list-item-content input[data-action=delete]',
        hasAdOnModal: '#attach-popover-lgtbox:not([style*="display: none"])',
        hasToCartFromModal: 'input[type=submit][aria-labelledby*="cart"]',
        hasItemsInCart: '#nav-cart-count:not([class*="cart-0"])',
      };

      const elementChecks = {};

      for (var prop in selectors) {
        if (document.querySelector(selectors[prop])) {
          elementChecks[prop] = true;
        } else { elementChecks[prop] = false; }
      }
      elementChecks.isOffersPage = window.location.href.includes('offer-listing');
      elementChecks.hasVariants = !!window.isTwisterPage;
      elementChecks.windowLocation = window.location;
      return elementChecks;
    });
  };

  //find product&seller in cart
  const productSellerFound = async (sellerId, id) => {
      return await context.evaluate(async(a, b) => {
        let productXpath = `//div[@data-asin="${b}" and //*[contains(@href, "${a}")] and contains(@class, "list-item")]/*[1]`
        const quantityEl = document.evaluate(productXpath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
        if(quantityEl){
          quantityEl.parentElement.setAttribute('import', 'element')
          if(quantityEl.parentElement.querySelector('.sc-action-quantity>span>span.a-dropdown-container')){
            return 'drop'
          }
          return 'input'
        }
      },sellerId, id);
  }
  
  let page = await pageContext();

  //add product to cart
  await context.click('#add-to-cart-button:not([style*="not-allowed"])');
  await context.waitForNavigation();
  // await context.waitForSelector('#attachAccessoryModal_feature_div,input[type=submit][aria-labelledby*="cart"],#hlb-view-cart-announce');
  
  page = await pageContext();
  
  //decline add ons from pop out modal with cart button or addons
  if(page.hasAdOnModal){
    await new Promise(resolve => setTimeout(resolve, 1000));
    await context.evaluate(() => {
      document.querySelector('#attach-popover-lgtbox:not([style*="display: none"])').click()
    })
    await new Promise(resolve => setTimeout(resolve, 1000));
    page = await pageContext();
  }

  let pageCheck = 0
  while(!page.isCartPage && pageCheck < 5){
    if( page.hasToCartFromModal ){
      await context.click('input[type=submit][aria-labelledby*="cart"]')
    }else if( page.isCartTransitionPage ){
      await context.click('#hlb-view-cart-announce')
    }else if( !page.hasToCartFromModal && !page.hasAdOnModal && page.hasItemsInCart ){
      await context.click('#nav-cart')
    }
    pageCheck++
    await context.waitForNavigation()
    await new Promise(resolve => setTimeout(resolve, 2000));
    page = await pageContext()
  }

  if(page.isCartPage){
    await context.waitForSelector('span.quantity span span,input.sc-quantity-textfield');
    let seller = await productSellerFound(sellerId, id)
    if(!!seller){
      if(seller==='drop'){
        await context.click(`[import=element] span[data-action*=dropdown]`);
        await context.waitForSelector('li.quantity-option:last-child a');
        await context.click('li.quantity-option:last-child a');
      }
      await context.setInputValue(`[import=element] input.sc-quantity-textfield`, '999');
      await context.click('[import=element] span.sc-update-link a');
      await context.waitForNavigation()
      await context.waitForSelector('div.sc-quantity-update-message,span.sc-number-of-items');
      await context.evaluate(async() => {
        await new Promise(resolve => setTimeout(resolve, 2000));
        document.body.setAttribute('quantity', document.querySelector('span.sc-number-of-items').innerText.match(/[0-9]{1,}/g)[0]);
      });
      while(page.hasProdsToDeleteInCart){
        await context.click('div[data-asin] div[class*=removed]:not([style=""]) + div input[value*="Delete"], .sc-list-item-content input[data-action=delete]')
        await new Promise(resolve => setTimeout(resolve, 2000));
        page = await pageContext()
      }
    }
  }
}

module.exports = {
  implements: 'product/sellerInventory/extract',
  parameterValues: {
    country: 'UK',
    store: 'amazon',
    transform,
    getStockFunc,
    domain: 'amazon.co.uk',
    loadedSelector: '#add-to-cart-button:not([style*="not-allowed"])',
    zipcode: '',
  },
};

