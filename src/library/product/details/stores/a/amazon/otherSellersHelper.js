
// module.exports.implementation = ({ productPageSelector = defaultproductPageSelector } = {}) =>
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
//   const { productDetails, Helpers } = dependencies;
//   const helpers = new Helpers(context);
  const { transform } = parameters;
  const { productDetails, Helpers: { Helpers }, AmazonHelp: { AmazonHelp } } = dependencies;

  const helpers = new Helpers(context);
  const amazonHelp = new AmazonHelp(context, helpers);

  console.log('21inputs12');

  console.log(inputs);

  console.log(parameters);

  console.log(parameters.country);

  let free = '';
  let soldByAmazon = '';
  let soldByAmazonRegex = null;
  if (parameters.country === 'DE') {
    free = 'kostenlose';
    soldByAmazon = '';
    soldByAmazonRegex = /Verkauf durch (?:(.*) und |(.*).)/i;
  } else if (parameters.country === 'ES') {
    free = 'gratis';
    soldByAmazon = '';
    soldByAmazonRegex = /vendido por (?:(.*) y |(.*).)/i;
  }

  const enhancedContent = await context.evaluate(async function () {
    let allText = '';
    [...document.querySelectorAll('div.apm-hovermodule-slides')].filter(element => element.style.display !== 'block').forEach((element) => {
      if (element.querySelector('.apm-hovermodule-slides-inner')) {
        allText += element.querySelector('.apm-hovermodule-slides-inner').innerText;
      }
    });
    return document.querySelector('div#aplus') ? document.querySelector('div#aplus').innerText + allText : '';
  });

  let CurrentSeller = await context.evaluate(async function () {
    return document.querySelector('div[id="merchant-info"]') ? document.querySelector('div[id="merchant-info"]').innerText : '';
  });

  const CurrentSellerPrice = await context.evaluate(async function () {
    return document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']") ? document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']").innerText : '';
  });

  let CurrentSellerShipping = await context.evaluate(async function () {
    return document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';
  });

  let CurrentSellerPrime = await context.evaluate(async function () {
    return document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';
  });

  if (CurrentSeller && CurrentSeller.search(soldByAmazon) < 0 && CurrentSeller.match(soldByAmazonRegex)) {
    CurrentSeller = (CurrentSeller.match(soldByAmazonRegex)[1]) ? CurrentSeller.match(soldByAmazonRegex)[1] : CurrentSeller.match(soldByAmazonRegex)[2];
    if (!CurrentSellerShipping) CurrentSellerShipping = '!0.00';
    if (CurrentSellerPrime.includes('Details')) {
      CurrentSellerPrime = 'YES';
    } else {
      CurrentSellerPrime = 'NO';
    }

    await helpers.addItemToDocument('ii_otherSellersName', CurrentSeller);
    await helpers.addItemToDocument('ii_otherSellersPrice', CurrentSellerPrice);
    await helpers.addItemToDocument('ii_otherSellersShipping', CurrentSellerShipping);
    await helpers.addItemToDocument('ii_otherSellersPrime', CurrentSellerPrime);
    console.log('CurrentSeller', CurrentSeller);
    console.log('CurrentSellerPrice', CurrentSellerPrice);
    console.log('CurrentSellerShipping', CurrentSellerShipping);
    console.log('CurrentSellerPrime', CurrentSellerPrime);
  }

  async function getOtherSellersInfo (otherSellersDocument, sellerNamSelector, sellerPricesSelector, sellerPrimeSelector, sellerShippingSelector) {
    const samePageFlag = !otherSellersDocument ? 1 : 0;
    otherSellersDocument = otherSellersDocument || document;
    let sellerNames = null;
    sellerNames = await context.evaluate(async function () {
      const sellerNames = null;
      const otherSellersName = otherSellersDocument.querySelectorAll(sellerNamSelector);
      otherSellersName && otherSellersName.forEach(name => {
        if (name.tagName === 'IMG') {
          sellerNames.push(name.alt);
        } else {
          sellerNames.push(name.innerText.trim());
        }
      });
      return sellerNames;
    });
    sellerNames && await helpers.addItemToDocument('pd_otherSellerName', sellerNames.join('|'));
    console.log('sellerNames', sellerNames);
    let sellerPrices = null;
    sellerPrices = await context.evaluate(async function () {
      const sellerPrices = [];
      const otherSellersPrice = otherSellersDocument.querySelectorAll(sellerPricesSelector);
      otherSellersPrice && otherSellersPrice.forEach(price => {
        if (price.innerText) {
          sellerPrices.push(price.innerText.trim());
          //   addHiddenDiv('pd_otherSellersPrice', price.innerText.trim());
        }
      });
      return sellerPrices;
    });
    sellerPrices && await helpers.addItemToDocument('pd_otherSellersPrice', sellerPrices.join('|'));
    console.log('sellerPrices', sellerPrices);
    let sellerPrime = null;
    sellerPrime = await context.evaluate(async function () {
      const sellerPrime = [];
      const otherSellersPrime = otherSellersDocument.querySelectorAll(sellerPrimeSelector);
      otherSellersPrime && otherSellersPrime.forEach(prime => {
        if (prime.innerText.includes('Details') && samePageFlag) {
          sellerPrime.push('Yes');
        } else if (prime.querySelector('i.a-icon-prime')) {
          sellerPrime.push('Yes');
        } else {
          sellerPrime.push('No');
        }
      });
      return sellerPrime;
    });
    sellerPrime && await helpers.addItemToDocument('pd_otherSellersPrime', sellerPrime.join('|'));
    console.log('sellerPrime', sellerPrime);
    let sellerShipping = null;
    sellerShipping = await context.evaluate(async function () {
      const sellerShipping = [];
      const otherSellersShipping2 = otherSellersDocument.querySelectorAll(sellerShippingSelector);
      otherSellersShipping2 && otherSellersShipping2.forEach(shipping => {
        shipping = shipping ? shipping.innerText.toLowerCase() : '';
        if (shipping && shipping.includes(free)) {
          sellerShipping.push('0.00');
        } else if (shipping && shipping.match(/.([\d]+(?:.[\d]+)?)/)) {
          sellerShipping.push(shipping.match(/.([\d]+(?:.[\d]+)?)/)[1]);
        }
      });
      while (sellerShipping.length !== sellerNames.length) {
        sellerShipping.push('0.00');
      }
      return sellerShipping;
    });
    sellerShipping && await helpers.addItemToDocument('pd_otherSellersShipping2', sellerShipping.join('|'));
    console.log('sellerShipping', sellerShipping);
  }

  async function getLbb (otherSellersDocument) {
    const button = await helpers.checkCSSSelector('#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a, #mbc-olp-link');

    console.log('##############################', button);
    if (button) {
      console.log('trying button', button);
      const llbInfo = await context.evaluate(async function () {
        const llb = [];
        const llbPrices = [];
        const otherSellersDiv = "div#olpOfferList div[class*='olpOffer']";
        if (otherSellersDocument.querySelector(otherSellersDiv)) {
          const firstCheck = (document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div')) ? document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div') : '';
          const otherSellers = (otherSellersDocument.querySelectorAll(otherSellersDiv)) ? otherSellersDocument.querySelectorAll(otherSellersDiv) : '';
          const price = (document.querySelector("#priceblock_ourprice, [class*='offer-price'], span[id='priceblock_saleprice']")) ? document.querySelector("#priceblock_ourprice, [class*='offer-price'], span[id='priceblock_saleprice']") : '';
          console.log('Verkauf durch box, otherSellers, Actual-price', firstCheck, otherSellers, price);
          if (firstCheck && price) {
            // @ts-ignore
            const priceText = parseFloat((price.innerText).slice(1));
            // @ts-ignore
            if (!(firstCheck.innerText.toLowerCase().includes('verkauf durch amazon')) && otherSellers) {
              otherSellers.forEach((seller) => {
                const sellerPrice = (seller.querySelector('span.olpOfferPrice')) ? seller.querySelector('span.olpOfferPrice').innerText.trim() : '';
                const priceNum = parseFloat(sellerPrice.slice(1));
                const soldBy = (seller.querySelector('h3.olpSellerName span , h3.olpSellerName img')) ? seller.querySelector('h3.olpSellerName span , h3.olpSellerName img') : '';
                let sellerNames;
                if (soldBy.tagName === 'IMG') {
                  sellerNames = (soldBy.alt);
                } else {
                  sellerNames = (soldBy.innerText.trim());
                }
                console.log('Name of seller', sellerNames, priceNum, priceText);
                // @ts-ignore
                if (sellerNames.toLowerCase().includes('amazon.de') && priceNum >= priceText) {
                //   addHiddenDiv('ii_lbb', 'YES');
                  llb.push('Yes');
                  //   addHiddenDiv('ii_lbbPrice', `${priceNum}`);
                  llbPrices.push(priceNum);
                }
              });
            }
          }
        }
        return { llb: llb, llbPrices: llbPrices };
      });
      if (llbInfo && llbInfo.llb && llbInfo.llb.length) {
        await helpers.addItemToDocument('pd_otherSellersShipping2', llbInfo.llb.join('|'));
      }
      if (llbInfo && llbInfo.llbPrices && llbInfo.llbPrices.length) {
        await helpers.addItemToDocument('pd_otherSellersShipping2', llbInfo.llbPrices.join('|'));
      }
    }
  }
  const otherSellersInfo = await context.evaluate(async function () {
    const otherSellerNew = (document.querySelector("span[data-action='show-all-offers-display'] > a")) ? document.querySelector("span[data-action='show-all-offers-display'] > a").getAttribute('href') : null;
    if (otherSellerNew) {
      async function getData() {
        const otherSellersHtml = await fetch(otherSellerNew, {
          headers: {
            cookie: document.cookie,
          },
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        }).then(res => res.text());
        return otherSellersHtml;
      }

      const otherSellersHtml = await getData();
      return await doSomething();
      //   console.log('otherSellersHtml', otherSellersHtml);
      //   return otherSellersHtml;
      async function doSomething() {
        var domParser = new DOMParser();
        console.log('og123')
        var otherSellersDocument = domParser.parseFromString(otherSellersHtml, 'text/html');
        console.log(otherSellersDocument);
        // return otherSellersDocument
        console.log('no123')
        const pageNotFound = document.evaluate('//title[contains(text(),"Page Not Found")]', otherSellersDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log(pageNotFound);
        return pageNotFound !== null ? null : otherSellersDocument;
      }
      }
    
    return null;
  });

  console.log('21otherSellersInfo12')

  console.log(otherSellersInfo)

  if (otherSellersInfo) {
    getLbb(otherSellersInfo);
    getOtherSellersInfo(otherSellersInfo, 'h3.olpSellerName span , h3.olpSellerName img', 'div.olpOffer span.olpOfferPrice', 'div.olpOffer', 'div.olpOffer .olpShippingInfo');
  } else {
    getOtherSellersInfo('', '#mbc span.mbcMerchantName, #ii_otherSellersName', 'div[id*="mbc"] span[id*="mbc-price"], #ii_otherSellersPrice', "span[id*='mbc-shipping'], #ii_otherSellersPrime", 'div[id*="mbc"] span[id*="mbc-shipping"], #ii_otherSellersShipping');
  }

  await helpers.addItemToDocument('added-enhanced-content', enhancedContent);

  await helpers.addURLtoDocument('added-url');
  await helpers.addURLtoDocument('added-asin', true);

  //   await context.extract(productDetails, { transform });
  return await context.extract(productDetails, { transform: parameters.transform });
};
module.exports = { implementation };
