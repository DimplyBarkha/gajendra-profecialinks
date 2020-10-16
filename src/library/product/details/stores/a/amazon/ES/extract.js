const { transform } = require('./transform');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails, Helpers: { Helpers }, AmazonHelp: { AmazonHelp } } = dependencies;

  const helpers = new Helpers(context);
  const amazonHelp = new AmazonHelp(context, helpers);


  await context.evaluate(async () => {
    var element = document.querySelectorAll("div[cel_widget_id*='aplus'] img");
    if (element) {
      element.forEach(async (node) => {
        node.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      });
    }
  });
  const otherSellerInfo = async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    function getOtherSellersInfo (otherSellersDocument, sellerNamSelector, sellerPricesSelector, sellerPrimeSelector, sellerShippingSelector) {
      otherSellersDocument = otherSellersDocument || document;
      const otherSellersName = otherSellersDocument.querySelectorAll(sellerNamSelector);
      const sellerNames = [];
      otherSellersName && otherSellersName.forEach(name => {
        if (name.tagName === 'IMG') {
          sellerNames.push(name.alt);
          addElementToDocument('pd_otherSellerName', name.alt);
        } else {
          sellerNames.push(name.innerText.trim());
          addElementToDocument('pd_otherSellerName', name.innerText.trim());
        }
      });
      // sellerNames && addElementToDocument('pd_otherSellerName', sellerNames.join(' | '));
      const sellerPrices = [];
      const otherSellersPrice = otherSellersDocument.querySelectorAll(sellerPricesSelector);
      otherSellersPrice && otherSellersPrice.forEach(price => {
        if (price.innerText) {
          sellerPrices.push(price.innerText.trim().replace('$', ''));
          addElementToDocument('pd_otherSellersPrice', price.innerText.trim().replace('$', ''));
        }
      });
      sellerPrices && addElementToDocument('pd_otherSellersPrice', sellerPrices.join(' | '));

      const sellerPrime = [];
      const otherSellersPrime = otherSellersDocument.querySelectorAll(sellerPrimeSelector);
      otherSellersPrime && otherSellersPrime.forEach(prime => {
        if (prime.querySelector('i.a-icon-prime')) {
          sellerPrime.push('Yes');
        } else {
          sellerPrime.push('No');
        }
      });
      sellerPrime && addElementToDocument('pd_otherSellersPrime', sellerPrime.join(' | '));

      const sellerShipping = [];
      const otherSellersShipping2 = otherSellersDocument.querySelectorAll(sellerShippingSelector);
      otherSellersShipping2 && otherSellersShipping2.forEach(shipping => {
        shipping = shipping ? shipping.innerText.toLowerCase() : '';
        if (shipping && shipping.includes('gratis')) {
          sellerShipping.push('0.00');
        } else {
          if (shipping) {
            sellerShipping.push(shipping.replace('+', '').replace('.', '').replace(',', '.').trim());
          }
        }
      });
      sellerShipping && addElementToDocument('pd_otherSellersShipping2', sellerShipping.join(' | '));
    }
    let otherSellers = document.querySelector('div.olp-link-widget a') ? document.querySelector('div.olp-link-widget a') : document.querySelector('div#mbc span#mbc-olp-link a');
    otherSellers = otherSellers ? otherSellers.href : '';
    if (otherSellers) {
      // @ts-ignore
      const otherSellersHtml = await fetch(otherSellers, {
        headers: {
          cookie: document.cookie,
        },
      }).then(res => res.text());
      const domParser = new DOMParser();
      const otherSellersDocument = domParser.parseFromString(otherSellersHtml, 'text/html');
      const pageNotFound = document.evaluate('//title[contains(text(),"Page Not Found")]', otherSellersDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (!pageNotFound) {
        getOtherSellersInfo(otherSellersDocument, 'h3.olpSellerName span , h3.olpSellerName img', 'div.olpOffer span.olpOfferPrice', 'div.olpOffer', 'div.olpOffer .olpShippingInfo');
      } else {
        getOtherSellersInfo('', '#mbc span.mbcMerchantName', '#mbc span.a-color-price.a-size-medium', '#mbc div.a-box.mbc-offer-row', '#mbc div.a-box.mbc-offer-row');
      }
    } else {
      getOtherSellersInfo('', '#mbc span.mbcMerchantName', '#mbc span.a-color-price.a-size-medium', '#mbc div.a-box.mbc-offer-row', '#mbc div.a-box.mbc-offer-row');
    }
  };
  await context.evaluate(otherSellerInfo);
  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    async function buttonCheck () {
      const button = '#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a, #mbc-olp-link';
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!document.querySelector(button)) {
        return button;
      } else {
        return 'false';
      }
    }
    // addHiddenDiv('added-parentInput', parentInput);
    var element = (document.querySelectorAll("div[cel_widget_id*='aplus'] img")) ? document.querySelectorAll("div[cel_widget_id*='aplus'] img") : [];
    if (element) {
      element.forEach(async (node) => {
        node.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      });
    }

    const otherSellerNew = (document.querySelector("span[data-action='show-all-offers-display'] > a")) ? document.querySelector("span[data-action='show-all-offers-display'] > a").getAttribute('href') : '';
    if (otherSellerNew) {
      const otherSellersHtml = await fetch(otherSellerNew, {
        headers: {
          cookie: document.cookie,
        },
        method: 'GET',
        mode: 'cors',
        credentials: 'include',
      }).then(res => res.text());
      // console.log('otherSellersHtml', otherSellersHtml);
      const domParser = new DOMParser();
      const otherSellersDocument = domParser.parseFromString(otherSellersHtml, 'text/html');
      const pageNotFound = document.evaluate('//title[contains(text(),"Page Not Found")]', otherSellersDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (!pageNotFound) {
        getLbb(otherSellersDocument);
        // getOtherSellersInfo(otherSellersDocument, 'h3.olpSellerName span , h3.olpSellerName img', 'div.olpOffer span.olpOfferPrice', 'div.olpOffer', 'div.olpOffer .olpShippingInfo');
      } else {
        getOtherSellersInfo('', '#mbc span.mbcMerchantName, #ii_otherSellersName', 'div[id*="mbc"] span[id*="mbc-price"], #ii_otherSellersPrice', "span[id*='mbc-shipping'], #ii_otherSellersPrime", 'div[id*="mbc"] span[id*="mbc-shipping"], #ii_otherSellersShipping');
      }
    } else {
      getOtherSellersInfo('', '#mbc span.mbcMerchantName, #ii_otherSellersName', 'div[id*="mbc"] span[id*="mbc-price"], #ii_otherSellersPrice', "span[id*='mbc-shipping'], #ii_otherSellersPrime", 'div[id*="mbc"] span[id*="mbc-shipping"], #ii_otherSellersShipping');
    }
    function getOtherSellersInfo (otherSellersDocument, sellerNamSelector, sellerPricesSelector, sellerPrimeSelector, sellerShippingSelector) {
      const samePageFlag = !otherSellersDocument ? 1 : 0;
      otherSellersDocument = otherSellersDocument || document;
      const otherSellersName = otherSellersDocument.querySelectorAll(sellerNamSelector);
      const sellerNames = [];
      otherSellersName && otherSellersName.forEach(name => {
        if (name.tagName === 'IMG') {
          sellerNames.push(name.alt);
        } else {
          sellerNames.push(name.innerText.trim());
        }
      });
      sellerNames && addHiddenDiv('pd_otherSellerName', sellerNames.join('|'));
      console.log('sellerNames', sellerNames);
      const sellerPrices = [];
      const otherSellersPrice = otherSellersDocument.querySelectorAll(sellerPricesSelector);
      otherSellersPrice && otherSellersPrice.forEach(price => {
        if (price.innerText) {
          sellerPrices.push(price.innerText.trim());
          addHiddenDiv('pd_otherSellersPrice', price.innerText.trim());
        }
      });
      // sellerPrices && addHiddenDiv('pd_otherSellersPrice', sellerPrices.join('|'));
      console.log('sellerPrices', sellerPrices);
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
      sellerPrime && addHiddenDiv('pd_otherSellersPrime', sellerPrime.join(' | '));
      console.log('sellerPrime', sellerPrime);
      const sellerShipping = [];
      const otherSellersShipping2 = otherSellersDocument.querySelectorAll(sellerShippingSelector);
      otherSellersShipping2 && otherSellersShipping2.forEach(shipping => {
        shipping = shipping ? shipping.innerText.toLowerCase() : '';
        if (shipping && shipping.includes('gratis')) {
          sellerShipping.push('0.00');
        } else if (shipping && shipping.match(/.([\d]+(?:.[\d]+)?)/)) {
          sellerShipping.push(shipping.match(/.([\d]+(?:.[\d]+)?)/)[1]);
        }
      });
      while (sellerShipping.length !== sellerNames.length) {
        sellerShipping.push('0.00');
      }
      sellerShipping && addHiddenDiv('pd_otherSellersShipping2', sellerShipping.join(' | '));
      console.log('sellerShipping', sellerShipping);
    }
    // @ts-ignore
    async function getLbb (otherSellersDocument) {
      const elem = await helpers.checkXpathSelector('//div[contains(@id,"olpLinkWidget_feature_div")]');
    console.log('elem!@');
    console.log(elem);
      console.log('TESTING!!!');
      // await helpers.checkAndClick('#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a', 'css', 20000);
      const otherSellersDiv = "div#olpOfferList div[class*='olpOffer']";
      console.log('##############################', elem);
      if (elem && otherSellersDocument.querySelector(otherSellersDiv)) {
        console.log('trying button', elem);
        const firstCheck = (document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div')) ? document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div') : '';
        const otherSellers = (otherSellersDocument.querySelectorAll(otherSellersDiv)) ? otherSellersDocument.querySelectorAll(otherSellersDiv) : '';
        const price = (document.querySelector("#priceblock_ourprice, [class*='offer-price'], span[id='priceblock_saleprice']")) ? document.querySelector("#priceblock_ourprice, [class*='offer-price'], span[id='priceblock_saleprice']") : '';
        console.log('vendido por box, otherSellers, Actual-price', firstCheck, otherSellers, price);
        if (firstCheck && price) {
          // @ts-ignore
          const priceText = parseFloat((price.innerText).slice(1));
          // @ts-ignore
          if (!(firstCheck.innerText.toLowerCase().includes('vendido por Amazon')) && otherSellers) {
            otherSellers.forEach((seller) => {
              // @ts-ignore
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
              if (sellerNames.toLowerCase().includes('amazon.es') && priceNum >= priceText) {
                addHiddenDiv('ii_lbb', 'YES');
                addHiddenDiv('ii_lbbPrice', `${priceNum}`);
              }
            });
          }
        }
      }
    }
  });


  // async function getLbb () {
  //   const elem = await helpers.checkXpathSelector('//div[contains(@id,"olpLinkWidget_feature_div")]');
  //   console.log('elem!@');
  //   console.log(elem);
  //   if (elem) {
  //     console.log('TESTING!!!');
  //     await helpers.checkAndClick('#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a', 'css', 20000);

  //     const otherSellersDiv = 'div#all-offers-display div#aod-offer div[id*="aod-price"]';
  //     await context.waitForSelector(otherSellersDiv, { timeout: 20000 });

  //     return await context.evaluate(function () {
  //       function addHiddenDiv (id, content) {
  //         const newDiv = document.createElement('div');
  //         newDiv.id = id;
  //         newDiv.textContent = content;
  //         newDiv.style.display = 'none';
  //         document.body.appendChild(newDiv);
  //       }

  //       const firstCheck = document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div');
  //       const otherSellers = document.querySelectorAll('div#aod-offer');
  //       const price = document.querySelector('span#price_inside_buybox');
  //       if (firstCheck && price) {
  //         const priceText = parseFloat((price.innerText).slice(1));
  //         if (firstCheck.innerText !== 'Ships from and sold by Amazon.com.' && otherSellers) {
  //           const sellerNames = [];
  //           const sellerPrices = [];
  //           const sellerShipping = [];

  //           otherSellers.forEach((seller) => {
  //             const sellerPrice = seller.querySelector('span.a-offscreen') ? seller.querySelector('span.a-offscreen').innerText : '';
  //             // const priceNum = parseFloat(sellerPrice.slice(1));
  //             const shipsFrom = seller.querySelector('div#aod-offer-shipsFrom div:nth-child(2) span');
  //             const soldBy = seller.querySelector('div#aod-offer-soldBy a:first-child') || seller.querySelector('div#aod-offer-soldBy div:nth-child(2) span');
  //             if (soldBy && soldBy.toLowerCase().includes('amazon.es') && priceNum > priceText) {
  //               addHiddenDiv('ii_lbb', 'YES');
  //               addHiddenDiv('ii_lbbPrice', `${sellerPrice}`);
  //             } else if (shipsFrom && soldBy) {
  //               sellerNames.push(soldBy.innerText);
  //               sellerPrices.push(sellerPrice);
  //               sellerShipping.push(shipsFrom.innerText);
  //               addHiddenDiv('pd_otherSellerName', soldBy.innerText);
  //               addHiddenDiv('pd_otherSellersShipping2', shipsFrom.innerText);
  //               addHiddenDiv('pd_otherSellersPrice', sellerPrice);
  //             }
  //           });
  //           // addHiddenDiv('pd_otherSellerName', sellerNames.join(' | '));
  //           // addHiddenDiv('pd_otherSellersShipping2', sellerShipping.join(' | '));
  //           // addHiddenDiv('pd_otherSellersPrice', sellerPrices.join(' | '));
  //         }
  //       }
  //     });
  //   }
  // }

  // await getLbb();
  await amazonHelp.addEnhancedContent();
  await amazonHelp.addCurrentSellerInfo('vendido por Amazon', /vendido por (?:(.*) y |(.*).)/i);

  await helpers.addURLtoDocument('added-url');
  await helpers.addURLtoDocument('added-asin', true);
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'amazon',
    transform,
    domain: 'amazon.es',
    // zipcode: '28010',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
