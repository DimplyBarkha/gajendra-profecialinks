const getStockFunc = async function ({ context, sellerId, id }) {
  const pageContext = async () => {
    return await context.evaluate(() => {
      console.log('context.evaluate');
      const selectors = {
        isCaptchaPage: 'img[src*="/captcha/"]',
        is400Page: 'a[href*="404_logo"]',
        is500Page: 'img[src*="500-title"], a[href*="503_logo"], a img[src*="503.png"], a[href*="ref=cs_503_link"]',
        hasProdDetails: '#prodDetails, #detailBullets_feature_div',
        hasSalesRank: '#detailBullets_feature_div a[href*="bestsellers"], #detailBullets a[href*="bestsellers"], #prodDetails a[href*="bestsellers"], #SalesRank',
        hasSalesRankBadge: '#ppd i[class*="best-seller-badge"]',
        hasAplus: '#aplus',
        hasProductDescription: '#productDescription',
        hasShippingDetails: '#contextualIngressPtLabel_deliveryShortLine',
        hasCookieAcceptRequest: '#sp-cc-accept',
        hasDogsofAmazon: 'img[alt*="Dogs of Amazon"]',
        hasTitle: 'title, #gouda-common-atf h1',
        hasToCartBtn: '#hlb-view-cart-announce',
        hasProdsToDeleteInCart: 'div[data-asin] div[class*=removed]:not([style=""]) + div input[value*="Delete"], .sc-list-item-content input[data-action=delete]',
        hasAddOnModal: '#attach-popover-lgtbox:not([style*="display: none"])',
        hasToCartFromModal: 'input[type=submit][aria-labelledby*="cart"]',
        hasItemsInCart: '#nav-cart-count:not([class*="cart-0"])',
        hasdropDownQuantity: '[import=element] span[data-action*=dropdown]',
        hasBuyNewBtn: '#buyNew_cbb',
        hasNoThanksAddOn: '#buybox-see-all-buying-choices-announce',
      };

      const elementChecks = {};

      for (var prop in selectors) {
        if (document.querySelector(selectors[prop])) {
          elementChecks[prop] = true;
        } else { elementChecks[prop] = false; }
      }

      elementChecks.hasShoppingCart = window.ue_pty ? window.ue_pty.includes('ShoppingCart') : false;
      elementChecks.isCartPage = window.ue_pty ? window.ue_pty.includes('ShoppingCart') && !elementChecks.hasToCartBtn : false;
      elementChecks.isCartTransitionPage = window.ue_pty ? window.ue_pty.includes('ShoppingCart') && elementChecks.hasToCartBtn : false;
      elementChecks.isBestSellerPage = window.ue_pty ? window.ue_pty.includes('zeitgeist') : false;
      elementChecks.isSearchPage = window.ue_pty ? window.ue_pty.includes('Search') : false;
      elementChecks.isReviewsPage = window.ue_pty ? window.ue_pty.includes('CustomerReviews') : false;
      elementChecks.isProductPage = window.ue_pty ? window.ue_pty.includes('Detail') : false;
      elementChecks.isOffersPage = window.ue_pty ? window.ue_pty.includes('OfferListing') : false;
      elementChecks.hasVariants = !!window.isTwisterPage;
      elementChecks.windowLocation = window.location ? window.location : {};
      if (document.body) {
        document.body.setAttribute('current_page_url', window.location.href);
      }
      return elementChecks;
    });
  };

  // find product&seller in cart
  const productSellerFound = async (sellerId, id) => {
    return await context.evaluate(async (a, b) => {
      const productXpath = `//div[@data-asin="${b}" and //*[contains(@href, "${a}")]]/*[1]`;
      const el = document.evaluate(productXpath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
      if (el) {
        console.log('found product');
        el.parentElement.setAttribute('import', 'element');
        return !!document.querySelector('div[data-asin][import]:not([data-removed])');
      }
    }, sellerId, id);
  };

  // find product in cart
  const productFound = async (id) => {
    return await context.evaluate(async (b) => {
      const productXpath = `//div[@data-asin="${b}"]/*[1]`;
      const el = document.evaluate(productXpath, document, null, XPathResult.ANY_TYPE, null).iterateNext();
      if (el) {
        console.log('found product');
        el.parentElement.setAttribute('prod', 'product');
        return !!document.querySelector('div[data-asin][prod="product"]:not([data-removed])');
      }
    }, id);
  };

  const artifactCartItems = async () => {
    return await context.evaluate(async () => {
      if (document.querySelector('div[data-asin]:not([import]):not([data-removed]) input[value*="Delete"]')) {
        console.log('found artifact prod in cart');
        return true;
      }
    });
  };

  let page = await pageContext();

  if (page.hasBuyNewBtn) {
    await context.click('#buyNew_cbb');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  if (page.hasNoThanksAddOn) {
    await context.click('#beuybox-see-all-buying-choices-announce');
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  if (!sellerId) {
    sellerId = await context.evaluate(() => document.querySelector('#addToCart  > input#merchantID').value);
  }
  if (!id) {
    id = await context.evaluate(() => document.querySelector('#addToCart  > input#ASIN').value);
  }
  await context.click('#add-to-cart-button:not([style*="not-allowed"])');
  await context.waitForNavigation();
  await new Promise(resolve => setTimeout(resolve, 3000));

  page = await pageContext();

  // decline add ons from pop out modal with cart button or addons
  if (page.hasAddOnModal) {
    await context.evaluate(async () => {
      if (document.querySelector('#attachSiNoCoverage-announce')) {
        document.querySelector('#attachSiNoCoverage-announce').click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      } else if (document.querySelector('#attach-popover-lgtbox:not([style*="display: none"])')) {
        document.querySelector('#attach-popover-lgtbox:not([style*="display: none"])').click();
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    });
    await new Promise(resolve => setTimeout(resolve, 1000));
    page = await pageContext();
  }

  let pageCheck = 0;
  while (!page.isCartPage && pageCheck < 5) {
    if (page.hasToCartFromModal) {
      await context.click('input[type=submit][aria-labelledby*="cart"]');
    } else if (page.isCartTransitionPage) {
      await context.click('#hlb-view-cart-announce');
    } else if (!page.hasToCartFromModal && !page.hasAdOnModal && page.hasItemsInCart) {
      await context.click('#nav-cart');
    }
    pageCheck++;
    await context.waitForNavigation();
    await new Promise(resolve => setTimeout(resolve, 2000));
    page = await pageContext();
  }

  if (page.isCartPage) {
    if(await productFound(id)){
      console.log('successssss')
      await context.waitForSelector('span.quantity span span,input.sc-quantity-textfield');
      if (await productSellerFound(sellerId, id)) {
        while (await artifactCartItems()) {
          console.log('deleting prods');
          await context.waitForSelector('div[data-asin][import]:not([data-removed])');
          await context.click('div[data-asin]:not([import]):not([data-removed]) input[value*="Delete"]');
          await new Promise(resolve => setTimeout(resolve, 2000));
          await productSellerFound(sellerId, id);
          console.log('artifact deleted');
        }
        await productSellerFound(sellerId, id);
        page = await pageContext();
        if (page.hasdropDownQuantity) {
          await context.click('[import=element] span[data-action*=dropdown]');
          await context.waitForSelector('li.quantity-option:last-child a');
          await context.click('li.quantity-option:last-child a');
        }
        await context.setInputValue('[import=element] input.sc-quantity-textfield', '999');
        await context.click('[import=element] span.sc-update-link a');
        await new Promise(resolve => setTimeout(resolve, 2000));
        if (!await productSellerFound(sellerId, id)) {
          console.log('no product found');
          return;
        };
        await context.waitForSelector('div[data-asin][import]:not([data-removed])');
      }
    }else{
      throw Error('Product not added to cart.');
    }
  }
};
module.exports = { getStockFunc };
