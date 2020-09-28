const { transform } = require('../../../../sharedAmazon/transformNew');
/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails, Helpers: { Helpers } } = dependencies;

  const helpers = new Helpers(context);
  const setCity = async () => {
    try {
      await context.waitForSelector('#nav-packard-glow-loc-icon');
      await context.click('#nav-packard-glow-loc-icon');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await context.waitForSelector('#GLUXCityList');
      await context.click('#GLUXCityList');
      await new Promise(resolve => setTimeout(resolve, 1000));
      await context.waitForSelector('a[data-value*="Dubai"]');
      await context.click('a[data-value*="Dubai"]');
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (e) {
      console.log(e);
    }
  };
  // Code to fetch aplus (enhanced content)
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
  }
  await setCity();
  await waitForAplus();
  const aplusFlag = await context.evaluate(function () {
    const aplusSelector = document.querySelector('div#aplus');
    if (aplusSelector) {
      return true;
    } else {
      location.reload();
      return false;
    }
  });

  if (!aplusFlag) {
    console.log('page reloading');
    await setCity();
    await context.waitForXPath('(//img[@id="landingImage"])[1]/@data-old-hires | (//img[@id="landingImage"])[1]/@src');
    await waitForAplus();
  }
  // Code to get lbb and adding new div in dom for customise fields.
  await context.evaluate(async () => {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    async function getLbb (otherSellersDocument) {
      if (otherSellersDocument) {
        const otherSellersDiv = "div#olpOfferList div[class*='olpOffer']";
        const shipFromOri = document.querySelector('div#buybox-tabular tr:nth-child(1) td:nth-child(2)');
        const soldByOri = document.querySelector('div#buybox-tabular tr:nth-child(2) td:nth-child(2)');

        const otherSellers = otherSellersDocument.querySelectorAll(otherSellersDiv)
          ? otherSellersDocument.querySelectorAll(otherSellersDiv) : [];
        const price = document.querySelector('span#price_inside_buybox');
        if (shipFromOri && soldByOri && price) {
          const priceText = parseFloat(price.innerText.replace(/.*\s(.*)/, '$1').replace(/,/, ''));
          if ((!shipFromOri.innerText.includes('Amazon') || !soldByOri.innerText.includes('Amazon')) && otherSellers) {
            otherSellers.forEach((seller) => {
              const sellerPrice = seller.querySelector('span.olpOfferPrice') ? seller.querySelector('span.olpOfferPrice').innerText.trim() : '';
              const priceNum = sellerPrice ? parseFloat(sellerPrice.replace(/.*\s(.*)/, '$1').replace(/,/, '')) : 0;
              const shipsFrom = seller.querySelector('div.olpBadge') ? seller.querySelector('div.olpBadge').innerText.trim() : '';
              const soldBy = seller.querySelector('h3.olpSellerName span') ? seller.querySelector('h3.olpSellerName span').innerText.trim() : '';

              if (shipsFrom.toLowerCase().includes('amazon') && soldBy.toLowerCase().includes('amazon') && priceNum > priceText) {
                addHiddenDiv('ii_lbb', 'YES');
                addHiddenDiv('ii_lbbPrice', `${priceNum}`);
              }
            });
          }
        }
      }
    }

    const shipFromOri = document.querySelector('div#buybox-tabular tr:nth-child(1) td:nth-child(2)');
    const soldByOri = document.querySelector('div#buybox-tabular tr:nth-child(2) td:nth-child(2)');
    if ((shipFromOri && !shipFromOri.innerText.includes('Amazon')) || (soldByOri && !soldByOri.innerText.includes('Amazon'))) {
      const otherSellerNew = (document.querySelector('#olp_feature_div span[data-action="show-all-offers-display"] a'))
        ? document.querySelector('#olp_feature_div span[data-action="show-all-offers-display"] a').getAttribute('href') : '';
      if (otherSellerNew) {
        // Other sellers list is available
        const otherSellersHtml = await fetch(otherSellerNew, {
          headers: {
            cookie: document.cookie,
          },
          method: 'GET',
          mode: 'cors',
          credentials: 'include',
        }).then(res => res.text());
        const domParser = new DOMParser();
        const otherSellersDocument = domParser.parseFromString(otherSellersHtml, 'text/html');
        const pageNotFound = document.evaluate('//title[contains(text(),"Page Not Found")]', otherSellersDocument, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (!pageNotFound) {
          await getLbb(otherSellersDocument);
        }
      }
    }

    // Description has Li and <P>. Handled it wisely
    const description = document.querySelector('div#productDescription');
    const additionalDescription = document.querySelector('div#feature-bullets > ul');
    const additionalDescriptionText = additionalDescription && additionalDescription.innerHTML
      ? additionalDescription.innerHTML.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/&nbsp;/g, '').trim() : '';
    const descriptionText = description && description.innerHTML
      ? description.innerHTML.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/&nbsp;/g, '').trim() : '';
    const formattedDescriptionText = additionalDescriptionText ? descriptionText ? additionalDescriptionText + ' | ' + descriptionText : additionalDescriptionText : descriptionText;
    addHiddenDiv('productDescriptionExtract', formattedDescriptionText);

    const shippingInfo = document.querySelector('div#buybox-tabular > table > tbody');
    let shippingInfoText = shippingInfo && shippingInfo.innerHTML
      ? shippingInfo.innerHTML.replace(/<tr>/gm, '').replace(/<td>/gm, '').replace(/<span>/gm, '').replace(/<.*?>/gm, '').replace(/&nbsp;/g, '').trim() : '';
    shippingInfoText = shippingInfoText.replace(/\s+/g, ' ');
    addHiddenDiv('shippingInfo', shippingInfoText);

    const color = document.querySelector('div#variation_color_name > div > span') || document.querySelector('div#prodDetails > span > strong');
    addHiddenDiv('productColor', color);

    const weight = document.querySelector('table#productDetails_techSpec_section_1 > tbody');
    let weightText = weight && weight.innerHTML ? weight.innerHTML.replace(/<tr>/gm, '').replace(/<.*?>/gm, '').replace(/\s+/gm, ' ').replace(/(\sItem\sWeight\s.*)(")/gm, '$1').trim() : '';
    weightText = weightText.replace(/(\s\d.*)/gm, '$1');
    addHiddenDiv('productWeight', weightText);

    const technicalInfo = document.querySelector('div#prodDetails span[data-action="enhanced-content-open-file"] a')
      ? document.querySelector('div#prodDetails span[data-action="enhanced-content-open-file"] a').getAttribute('href') : '';
    const info = technicalInfo.length > 1 ? 'Yes' : 'No';
    addHiddenDiv('technicalDescription', info);

    const weight1 = document.querySelector('div#productDescription');
    if (weight1.innerHTML.includes('Item Weight')) {
      const weightText1 = weight1.innerHTML.replace(/.*Item Weight: (.*)/, '$1').replace(/^((?:\S+\s+){2}\S+).*/, '$1');
      addHiddenDiv('productWeight1', weightText1);
    }

    const color1 = document.querySelector('div#productDescription');
    if (color1.innerHTML.includes('Color Category')) {
      const colorDemo1 = color1.innerHTML.replace(/.*Color Category: (.*)/, '$1').replace(/^((?:\S+)).*/, '$1');
      addHiddenDiv('productColor1', colorDemo1);
    } else if (color1.innerHTML.includes('Color')) {
      let colorDemo1 = color1.innerHTML.replace(/.*Color: (.*)/, '$1').replace(/^((?:\S+)).*/, '$1');
      colorDemo1 = colorDemo1.replace(/<br>.*/, '');
      addHiddenDiv('productColor1', colorDemo1);
    }

    const mpc1 = document.querySelector('div#productDescription');
    if (mpc1.innerHTML.includes('Model Number')) {
      const mpcDemo1 = mpc1.innerHTML.replace(/.*Model Number: (.*)/, '$1').replace(/^((?:\S+\s+){2}\S+).*/, '$1');
      addHiddenDiv('productMpc', mpcDemo1);
    }
  });
  await helpers.addURLtoDocument('added-url');
  await helpers.addURLtoDocument('added-asin', true);
  await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AE',
    store: 'amazon',
    transform,
    domain: 'amazon.ae',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
