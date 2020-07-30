const { transform } = require('./format');
async function implementation (
  // @ts-ignore
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  async function setZipCode () {
    const isZipCodePresent = await context.evaluate(async function () {
      let isZipCodePresent = document.querySelector('#glow-ingress-block');
      isZipCodePresent = isZipCodePresent ? isZipCodePresent.innerText.includes('75019') : '';
      return !!isZipCodePresent;
    });
    if (!isZipCodePresent) {
      await context.waitForSelector('#nav-packard-glow-loc-icon');
      await context.click('#nav-packard-glow-loc-icon');
      await context.waitForSelector('input#GLUXZipUpdateInput');
      try {
        await context.click('a#GLUXChangePostalCodeLink');
      } catch (error) {
        console.log('Element not visible');
      }
      await context.setInputValue('input#GLUXZipUpdateInput', '75019');
      await context.waitForSelector('#GLUXZipUpdate input');
      await new Promise(resolve => setTimeout(resolve, 2000));
      await context.click('#GLUXZipUpdate input');
      try {
        await context.waitForSelector('button[name="glowDoneButton"]');
        await context.click('button[name="glowDoneButton"]');
      } catch (error) {
        console.log('Done button not found');
      }
      await context.waitForNavigation();
    }
  }

  async function waitForAplus () {
    // Scrolling to bottom of page where aplus images are located
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await context.evaluate(async function () {
      const element = document.getElementById('aplus');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        await new Promise((resolve) => setTimeout(resolve, 2500));
      }
    });
    try {
      await context.waitForXPath('//div[@id="aplus"]/..//h2 | //div[@id="aplus"]/..//div[contains(@class, "celwidget aplus-module")] | //div[@class="apm-hovermodule-slides-inner"]');
    } catch (error) {
      console.log('error: ', error);
    }
    await new Promise((resolve) => setTimeout(resolve, 2500));

    async function addUrl () {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      let url = window.location.href;
      if (url.includes('?th=1')) {
        url = url.replace('?th=1', '');
      }
      addHiddenDiv('added-searchurl', url);
    }
    await context.evaluate(addUrl);
  }

  // Adding other seller info to DOM
  const otherSellerInfo = async () => {
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    function getOtherSellersInfo (otherSellersDocument) {
      const sellerNames = [];
      const sellerPrices = [];
      const sellerPrime = [];
      const sellerShipping = [];

      // Adding single seller and product price if other seller is not present
      if (!otherSellersDocument) {
        const otherSellerPriceElem = document.querySelector('[id="priceblock_ourprice"], [class*="a-color-price a-color-price"], div[id="olp-new"] span[class*="a-color-price"]');
        let otherSellerPrice = otherSellerPriceElem ? otherSellerPriceElem.innerText : '';
        otherSellerPrice = otherSellerPrice ? otherSellerPrice.replace(/€|EUR/gm, '').trim() : '';
        otherSellerPrice = otherSellerPrice ? otherSellerPrice.replace(/\./g, '').replace(/,/g, '.') : '';
        otherSellerPrice && addElementToDocument('pd_otherSellersPrice', otherSellerPrice);

        let otherSellerNameElem = document.querySelector('a[id*="sellerProfile"]');
        let otherSellerName = otherSellerNameElem ? otherSellerNameElem.innerText : '';
        otherSellerName = otherSellerName ? otherSellerName.trim() : '';
        otherSellerName && addElementToDocument('pd_otherSellerName', otherSellerName);
        return;
      }

      const otherSellerBlock = otherSellersDocument.querySelectorAll('div[id="olpOfferList"] div[class*="olpOffer"]');
      for (let i = 0; i < otherSellerBlock.length; i++) {
        const otherSellerELem = otherSellerBlock[i];

        let otherSellerNameSelector = otherSellerELem.querySelector('h3[class*="olpSellerName"] a');
        let otherSellerName = otherSellerNameSelector ? otherSellerNameSelector.innerText : '';
        if (!otherSellerName) {
          otherSellerNameSelector = otherSellerELem.querySelector('h3[class*="olpSellerName"] img');
          otherSellerName = otherSellerNameSelector ? otherSellerNameSelector.alt : '';
        }
        otherSellerName = otherSellerName ? otherSellerName.trim() : '';
        sellerNames.push(otherSellerName);

        const otherSellerPriceSelector = otherSellerELem.querySelector('span[class*="olpOfferPrice"]');
        let otherSellerPrice = otherSellerPriceSelector ? otherSellerPriceSelector.innerText : '';
        otherSellerPrice = otherSellerPrice ? otherSellerPrice.replace(/€|EUR/gm, '').trim() : '';
        otherSellerPrice = otherSellerPrice ? otherSellerPrice.replace(/\./g, '').replace(/,/g, '.') : '';
        sellerPrices.push(otherSellerPrice);

        const otherSellerShippingSelector = otherSellerELem.querySelector('p[class="olpShippingInfo"]');
        let otherSellerShipping = otherSellerShippingSelector ? otherSellerShippingSelector.innerText : '';
        if (otherSellerShipping && otherSellerShipping.toLowerCase().includes('GRATUITE'.toLowerCase())) {
          otherSellerShipping = '0.00';
        } else {
          if (otherSellerShipping) {
            otherSellerShipping = otherSellerShipping ? otherSellerShipping.replace('+', '').replace('.', '').replace(',', '.').trim() : '';
          }
        } if (!otherSellerShipping) {
          otherSellerShipping = '0.00';
        }
        sellerShipping.push(otherSellerShipping);

        const otherSellerPrimeSelector = otherSellerELem.querySelector('i[class*="a-icon-prime"]');
        const otherSellerPrime = otherSellerPrimeSelector ? 'Yes' : 'No';
        sellerPrime.push(otherSellerPrime);
      }
      sellerNames.length && addElementToDocument('pd_otherSellerName', sellerNames.join('|'));
      sellerPrices.length && addElementToDocument('pd_otherSellersPrice', sellerPrices.join('|'));
      sellerShipping.length && addElementToDocument('pd_otherSellersShipping2', sellerShipping.join('|'));
      sellerPrime.length && addElementToDocument('pd_otherSellersPrime', sellerPrime.join('|'));
    }

    let otherSellers = document.querySelector('#olp-new > span a');
    otherSellers = otherSellers ? otherSellers.href : '';
    if (otherSellers) {
      const otherSellersHtml = await fetch(otherSellers, {
        headers: {
          cookie: document.cookie,
        },
      }).then(res => res.text());
      const pageNotFound = document.evaluate('//title[contains(text(),"Page Not Found")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      if (!pageNotFound) {
        const domParser = new DOMParser();
        const otherSellersDocument = domParser.parseFromString(otherSellersHtml, 'text/html');
        getOtherSellersInfo(otherSellersDocument);
      } else {
        getOtherSellersInfo(null);
      }
    } else {
      getOtherSellersInfo(null);
    }
  };

  const productPrimeCheck = async () => {
    let primeValue = 'No';
    const buyBoxSpans = document.querySelectorAll('div#buybox');
    const metaNames = document.querySelectorAll('meta[name=title]');

    const findMatchingString = (nodeList) => {
      return new Promise((resolve, reject) => {
        for (const node of nodeList) {
          const text = node.tagName === 'META' ? node.content : node.textContent;
          if (text.match(/vendu par amazon/ig)) {
            return resolve('Yes - Shipped and Sold');
          } else if (text.match(/rempli par amazon/ig)) {
            return resolve('Yes - Fulfilled');
          } else if (text.match(/prime pantry/ig)) {
            return resolve('Prime Pantry');
          }
        }
        return resolve(undefined);
      });
    };

    if (buyBoxSpans && buyBoxSpans.length) {
      const res = await findMatchingString(buyBoxSpans);

      if (res) {
        primeValue = res;
      }
    }

    if (metaNames && metaNames.length) {
      const res = await findMatchingString(metaNames);
      if (res) {
        primeValue = res;
      }
    }
    const catElement = document.createElement('div');
    catElement.id = 'pd_primeValue';
    catElement.textContent = primeValue;
    catElement.style.display = 'none';
    document.body.appendChild(catElement);
  };

  await waitForAplus();
  const aplusFlag = await context.evaluate(function () {
    const aplusSelector = document.querySelector('div[id="aplus_feature_div"]');
    if (aplusSelector) {
      return true;
    } else {
      location.reload();
      return false;
    }
  });

  if (!aplusFlag) {
    console.log('page reloading');
    await setZipCode();
    await context.waitForXPath('(//img[@id="landingImage"])[1]/@data-old-hires | (//img[@id="landingImage"])[1]/@src');
    await waitForAplus();
  }
  await context.evaluate(productPrimeCheck);
  await context.evaluate(otherSellerInfo);
  await new Promise(resolve => setTimeout(resolve, 2000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'amazon',
    transform,
    domain: 'amazon.fr',
    zipcode: '75019',
  },
  implementation,
};
