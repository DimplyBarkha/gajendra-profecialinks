
async function implementation (
  // @ts-ignore
  // @ts-ignore
  // @ts-ignore
  { parentInput },
  parameters,
  context,
  dependencies,
) {
  // @ts-ignore
  const { transform } = parameters;
  // @ts-ignore
  const { productDetails } = dependencies;
  const warrantyNode = await context.evaluate(async (parentInput) => {
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
    addHiddenDiv('added-parentInput', parentInput);
    var element = (document.querySelectorAll("div[cel_widget_id*='aplus'] img")) ? document.querySelectorAll("div[cel_widget_id*='aplus'] img") : [];
    if (element) {
      element.forEach(async (node) => {
        node.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
        await new Promise((resolve) => {
          setTimeout(resolve, 1000);
        });
      });
    }
    // @ts-ignore
    var CurrentSeller = document.querySelector('div[id="merchant-info"]') ? document.querySelector('div[id="merchant-info"]').innerText : '';
    // @ts-ignore
    var CurrentSellerPrice = document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']") ? document.querySelector("#price_inside_buybox, div[class='olp-text-box'] span[class='a-size-base a-color-price']").innerText : '';
    // @ts-ignore
    var CurrentSellerShipping = document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';

    // @ts-ignore
    var CurrentSellerPrime = document.querySelector("div[class='olp-text-box'] span[class='a-color-base']") ? document.querySelector("div[class='olp-text-box'] span[class='a-color-base']").innerText : '';

    if (CurrentSeller && CurrentSeller.search('sold by amazon') < 0 && CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)) {
      CurrentSeller = (CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)[1]) ? CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)[1] : CurrentSeller.match(/sold by (?:(.*) and |(.*).)/i)[2];
      if (!CurrentSellerShipping) CurrentSellerShipping = '!0.00';
      if (CurrentSellerPrime.includes('Details')) {
        CurrentSellerPrime = 'YES';
      } else {
        CurrentSellerPrime = 'NO';
      }
      addHiddenDiv('ii_otherSellersName', CurrentSeller);
      addHiddenDiv('ii_otherSellersPrice', CurrentSellerPrice);
      addHiddenDiv('ii_otherSellersShipping', CurrentSellerShipping);
      addHiddenDiv('ii_otherSellersPrime', CurrentSellerPrime);
      console.log('CurrentSeller', CurrentSeller);
      console.log('CurrentSellerPrice', CurrentSellerPrice);
      console.log('CurrentSellerShipping', CurrentSellerShipping);
      console.log('CurrentSellerPrime', CurrentSellerPrime);
    }
    let manufacturerDescription = document.querySelector('.aplus-v2.desktop.celwidget');
    // @ts-ignore
    manufacturerDescription = manufacturerDescription !== null ? manufacturerDescription.innerText : '';
    addHiddenDiv('ii_manufacturerDescription', manufacturerDescription);
    // @ts-ignore
    let packSize = document.querySelector("h1[id*='title']").innerText;
    if (packSize.search(/pack of/gmi) > -1) {
      packSize = (packSize.match(/pack of (\d+)/i)[1]) ? packSize.match(/pack of (\d+)/i)[1] : '';
      addHiddenDiv('ii_packSize', packSize);
    }
    var xPathRes = document.evaluate("//td[contains(text(), 'Hersteller')]/following-sibling::*[1] | //th[contains(text(), 'Manufacturer')]/following-sibling::*[1] | //td[contains(text(),'Manufacturer')]/following-sibling::*[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    if (!xPathRes.singleNodeValue) {
      const manufacturerName = document.querySelector("meta[name='keywords']").getAttribute('content');
      if (manufacturerName && manufacturerName.split(',').length > 1) {
        const arr = manufacturerName.split(',');
        const val = arr[arr.length - 2].slice(0, 1).toUpperCase() + arr[arr.length - 2].slice(1);
        addHiddenDiv('ii_manufacturerName', val);
      }
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
        getOtherSellersInfo(otherSellersDocument, 'h3.olpSellerName span , h3.olpSellerName img', 'div.olpOffer span.olpOfferPrice', 'div.olpOffer', 'div.olpOffer .olpShippingInfo');
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
      sellerPrime && addHiddenDiv('pd_otherSellersPrime', sellerPrime.join('|'));
      console.log('sellerPrime', sellerPrime);
      const sellerShipping = [];
      const otherSellersShipping2 = otherSellersDocument.querySelectorAll(sellerShippingSelector);
      otherSellersShipping2 && otherSellersShipping2.forEach(shipping => {
        shipping = shipping ? shipping.innerText.toLowerCase() : '';
        if (shipping && shipping.includes('free')) {
          sellerShipping.push('0.00');
        } else if (shipping && shipping.match(/.([\d]+(?:.[\d]+)?)/)) {
          sellerShipping.push(shipping.match(/.([\d]+(?:.[\d]+)?)/)[1]);
        }
      });
      while (sellerShipping.length !== sellerNames.length) {
        sellerShipping.push('0.00');
      }
      sellerShipping && addHiddenDiv('pd_otherSellersShipping2', sellerShipping.join('|'));
      console.log('sellerShipping', sellerShipping);
    }
    // @ts-ignore
    async function getLbb (otherSellersDocument) {
      const button = await buttonCheck();
      const otherSellersDiv = "div#olpOfferList div[class*='olpOffer']";
      console.log('##############################', button);
      if (button !== 'false' && otherSellersDocument.querySelector(otherSellersDiv)) {
        console.log('trying button', button);
        const firstCheck = (document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div')) ? document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div') : '';
        const otherSellers = (otherSellersDocument.querySelectorAll(otherSellersDiv)) ? otherSellersDocument.querySelectorAll(otherSellersDiv) : '';
        const price = (document.querySelector("#priceblock_ourprice, [class*='offer-price'], span[id='priceblock_saleprice']")) ? document.querySelector("#priceblock_ourprice, [class*='offer-price'], span[id='priceblock_saleprice']") : '';
        console.log('Sold by box, otherSellers, Actual-price', firstCheck, otherSellers, price);
        if (firstCheck && price) {
          // @ts-ignore
          const priceText = parseFloat((price.innerText).slice(1));
          // @ts-ignore
          if (!(firstCheck.innerText.toLowerCase().includes('sold by amazon')) && otherSellers) {
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
              if (sellerNames.toLowerCase().includes('amazon.in') && priceNum >= priceText) {
                addHiddenDiv('ii_lbb', 'YES');
                addHiddenDiv('ii_lbbPrice', `${priceNum}`);
              }
            });
          }
        }
      }
    }
    // New code
    const altNode = document.querySelectorAll('li.imageThumbnail img');
    const altHref = [];
    if (altNode && altNode.length) {
      altNode.forEach((ele) => {
        var href = (ele.getAttribute('src')).replace('SS40', 'SX679');
        altHref.push(href);
      });
    }
    altHref.shift();
    if (altHref.length) {
      const altImgP = document.createElement('div');
      altImgP.id = 'alternate-images';
      altHref.forEach((ele) => {
        const s = document.createElement('span');
        s.innerText = ele;
        altImgP.appendChild(s);
      });
      document.body.appendChild(altImgP);
    }

    const desNode = document.querySelectorAll('#feature-bullets li');
    const btmDescNode = document.querySelector('#productDescription');
    var desText = '';
    var bulletsInfo = '';
    if (btmDescNode && btmDescNode.innerText) {
      desText += ' ' + btmDescNode.innerText;
      addHiddenDiv('product-btm-desc', clean(btmDescNode.innerText));
    }
    if (desNode && desNode.length) {
      var count = 0;
      desNode.forEach((ele) => {
        desText += ' || ' + ele.innerText;
        bulletsInfo += ' || ' + ele.innerText;
        count++;
      });
    }
    if (desText) {
      addHiddenDiv('product-description-bullets', desText);
      addHiddenDiv('additional-info-bullets', bulletsInfo);
      addHiddenDiv('bullets-count', count);
    }

    const fastNode = document.querySelector('#ddmDeliveryMessage');
    if (fastNode) {
      addHiddenDiv('fast-track-msg', fastNode.innerText);
    }

    const specNode = document.querySelectorAll('#detailBullets_feature_div > ul span.a-text-bold ');
    const specValuesNode = document.querySelectorAll('#detailBullets_feature_div > ul span.a-text-bold +span');
    var specKeys = [];
    var specValues = [];
    var specText = '';
    if (specNode && specNode.length) {
      specKeys = getItems(specNode);
    }
    if (specValuesNode && specValuesNode.length) {
      specValues = getItems(specValuesNode);
    }
    var tempSpec = {};
    if (specKeys.length && specValues.length) {
      for (var i = 0; i < specKeys.length; i++) {
        tempSpec[specKeys[i]] = specValues[i];
        specText += ' || ' + specKeys[i] + specValues[i];
      }
    }
    specKeys = [];
    specValues = [];
    const techSpecNode = document.querySelectorAll('#productDetails_techSpec_section_1 th');
    const techValuesNode = document.querySelectorAll('#productDetails_techSpec_section_1 td');
    if (techSpecNode && techSpecNode.length) {
      specKeys = getItems(techSpecNode);
    }
    if (techValuesNode && techValuesNode.length) {
      specValues = getItems(techValuesNode);
    }
    if (specKeys.length && specValues.length) {
      for (var s = 0; s < specKeys.length; s++) {
        if (!(tempSpec[specKeys[s]])) {
          specText += ' || ' + specKeys[s] + ' : ' + specValues[s];
        }
      }
    }
    if (specText) {
      addHiddenDiv('product-spec', specText.slice(3));
    }

    const manDescNode = document.querySelectorAll('.aplus-module-wrapper td.apm-top');
    var enhanceContent = '';
    if (manDescNode && manDescNode.length) {
      manDescNode.forEach((ele) => {
        enhanceContent += ' ' + clean(ele.innerText);
      });
    }
    if (enhanceContent) {
      addHiddenDiv('manufacturer-desc', enhanceContent);
    }

    // brandText
    const brandTextSelector = document.querySelector('#bylineInfo');
    if (brandTextSelector) {
      const brandText = clean(brandTextSelector.innerText);
      addHiddenDiv('fetchedBrandText', brandText);
    }
    // variants
    var variantNode = document.querySelector('#twisterJsInitializer_feature_div script');
    var variantScript = document.getElementsByTagName('script');
    var asinNode = document.querySelector('[data-asin]');
    var variantsText = [];
    var asinText = '';
    var variantAsinText = '';
    if (asinNode) {
      asinText = asinNode.getAttribute('data-asin');
    }
    if (variantNode && variantNode.innerText) {
      var temp = {};
      temp.text = variantNode.innerText;
      variantsText.push(temp);
    }
    for (var j = 0; j < variantScript.length; j++) {
      if (variantScript[j].innerText && variantScript[j].innerText.includes('ImageBlockBTF')) {
        var temp1 = {};
        temp1.text = variantScript[j].innerText;
        variantsText.push(temp1);
        break;
      }
    }
    if (variantsText.length) {
      let asinLength = 0;
      let asinValArr = [];
      variantsText.forEach(item => {
        const asinArr = item.text.match(/"asin":"(.*?)"/gmi);
        if (asinArr) {
          const asins = asinArr.map(el => el.replace(/.*?:"?(.*)/, '$1').slice(0, -1));
          asinValArr = asinValArr.concat(asins);
        }
      });
      const value = new Set(asinValArr);
      asinValArr = Array.from(value);
      if (asinValArr.length === 1 && asinText === asinValArr[0]) {
        asinValArr.pop();
      }
      if (asinValArr.length > 0) {
        asinLength = asinValArr.length;
        variantAsinText = asinValArr.join(' | ');
        addHiddenDiv('product-first-variant', asinValArr[0]);
      }
      addHiddenDiv('variant-count', asinLength);
      addHiddenDiv('variant-asin', variantAsinText);
    }

    const variantInfoNode = document.querySelectorAll("[id*='variation'] ul[class*='swatch'] li[class*='swatch'] img");
    const variantFlavor = document.querySelectorAll("#variation_flavor_name [class*='a-row']");
    const variantStyle = document.querySelectorAll("#variation_style_name [class*='a-row']");
    const variantPackage = document.querySelectorAll("#variation_item_package_quantity [class*='a-row']");
    const variantTwist = document.querySelectorAll("ul[class*='swatch'] li[class*='swatch'] div[class*='twisterText']");
    const variantDrop = document.querySelectorAll("[id*='variation'] select[name*='dropdown'] > option");
    var variantInfo = [];
    if (variantInfoNode && variantInfoNode.length) {
      variantInfoNode.forEach((ele) => {
        variantInfo.push(ele.getAttribute('alt'));
      });
    }
    variantInfo = getVariantInfo(variantStyle, variantInfo);
    variantInfo = getVariantInfo(variantFlavor, variantInfo);
    variantInfo = getVariantInfo(variantPackage, variantInfo);
    variantInfo = getVariantInfo(variantTwist, variantInfo);
    variantInfo = getVariantInfo(variantDrop, variantInfo);
    if (variantInfo.length) {
      addHiddenDiv('product-variant-info', variantInfo.join(' || '));
    }

    const ssoNode = document.querySelector('#SSOFpopoverLink');
    const merchantInfo = document.querySelector('#merchant-info');
    const metaInfo = document.getElementsByTagName('meta');
    var primeInfo = [];
    if (ssoNode) {
      primeInfo.push({ text: ssoNode.innerText });
    }
    if (merchantInfo) {
      primeInfo.push({ text: merchantInfo.innerText });
    }
    for (var k = 0; k < metaInfo.length; k++) {
      var atr = metaInfo[k].getAttribute('content');
      if (atr && atr.includes('Prime')) {
        var temp2 = {};
        temp2.text = atr;
        primeInfo.push(temp1);
        break;
      }
    }
    if (primeInfo.length) {
      let value = '';
      primeInfo.forEach(item => {
        if (!item.text.includes('NO')) {
          if (item.text.includes('sold by Amazon') && !value.includes('Yes - Shipped and Sold')) {
            value += 'Yes - Shipped and Sold | ';
          } else if (item.text.includes('Fulfilled by Amazon') && !value.includes('Yes - Fulfilled')) {
            value += 'Yes - Fulfilled | ';
          } else if (item.text.includes('Prime') && !value.includes('Prime')) {
            value += 'Prime Pantry | ';
          }
        }
      });
      if (value) {
        addHiddenDiv('prime-info', value.slice(0, value.length - 3));
      } else {
        addHiddenDiv('prime-info', 'NO');
      }
    }

    if (variantScript && variantScript.length) {
      for (var m = 0; m < variantScript.length; m++) {
        if (variantScript[m].getAttribute('type') === 'a-state' && variantScript[m].innerText && variantScript[m].innerText.includes('parentAsin')) {
          var pText = (JSON.parse(variantScript[m].innerText));
          if (pText && pText.pageRefreshUrlParams && pText.pageRefreshUrlParams.parentAsin) {
            addHiddenDiv('product-pasin', pText.pageRefreshUrlParams.parentAsin);
          }
        }
      }
    }

    const warningNode = document.querySelectorAll('#important-information div[class*="content"] h4');
    if (warningNode && warningNode.length) {
      warningNode.forEach(ele => {
        if (ele.innerText && ele.innerText.includes('Safety Information')) {
          var wText = ele.parentElement.innerText;
          wText = (wText.replace('Safety Information', ' ')).trim();
          addHiddenDiv('product-warnings', clean(wText));
        }
      });
    }
    const warrantyNode = document.querySelector('.warranty-content');
    if (warrantyNode) {
      warrantyNode.click();
      return warrantyNode;
    }
    function getVariantInfo (node, varinats) {
      if (node && node.length) {
        var a = getItems(node);
        if (a.length) {
          varinats = varinats.concat(a);
        }
      }
      return varinats;
    }

    function getItems (data) {
      var items = [];
      data.forEach(ele => {
        items.push(ele.innerText);
      });
      return items;
    }

    function clean (text) {
      text = text.toString()
        .replace(/\r\n|\r|\n/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/&amp;nbsp;/g, ' ')
        .replace(/&amp;#160/g, ' ')
        .replace(/\u00A0/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .replace(/"\s{1,}/g, '"')
        .replace(/\s{1,}"/g, '"')
        .replace(/^ +| +$|( )+/g, ' ')
        .replace(/[\x00-\x1F]/g, '')
        .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ')
        .replace(/&nbsp;/g, ' ');
      return text;
    }
    // @ts-ignore
  }, parentInput);
  if (warrantyNode) {
    await context.waitForSelector('.a-popover-content div[class*="icon-farm-bottom-sheet-content"]');
  }
  await context.evaluate(async () => {
    const warrantyNode = document.querySelector('.warranty-content');
    if (warrantyNode) {
      const contentNode = document.querySelector('.a-popover-content div[class*="icon-farm-bottom-sheet-content"]');
      if (contentNode) {
        addHiddenDiv('product-warranty', contentNode.innerText);
      }
    }
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IN',
    store: 'amazon',
    transform: null,
    domain: 'amazon.in',
    zipcode: '',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    AmazonHelp: 'module:helpers/amazonHelp',
  },
  implementation,
};
