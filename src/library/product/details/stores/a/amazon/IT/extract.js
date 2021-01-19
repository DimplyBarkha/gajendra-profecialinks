async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.evaluate(function () {
    function getVariants () {
      const variantList = [];
      const variantCards = document.querySelectorAll('li[data-defaultasin]');
      const variantDropdown = document.querySelectorAll('[id*="variation"] option');
      const variantBooks = document.querySelectorAll('[id*="Swatches"]>ul>li a[id][href*="dp"]');

      if (variantBooks) {
        for (let i = 0; i < variantBooks.length; i++) {
          const element = variantBooks[i];
          if (element == null) {
            continue;
          }
          const vasinRaw = element.getAttribute('href');
          if (vasinRaw !== '') {
            const regex = /\/dp\/([A-Za-z0-9]{10,})/s;
            const vasin = vasinRaw.match(regex) ? vasinRaw.match(regex)[1] : '';
            if (vasin !== '') {
              variantList.push(vasin);
            }
          }
        }
      }
      if (variantDropdown) {
        for (let i = 0; i < variantDropdown.length; i++) {
          const element = variantDropdown[i];
          if (element == null) {
            continue;
          }
          const vasinRaw = element.getAttribute('value');
          if (vasinRaw !== '') {
            const regex = /[0-9]{1,},([0-9a-zA-Z]{10,})/s;
            const vasin = vasinRaw.match(regex) ? vasinRaw.match(regex)[1] : '';
            if (vasin !== '') {
              variantList.push(vasin);
            }
          }
        }
      }
      if (variantCards) {
        for (let i = 0; i < variantCards.length; i++) {
          const element = variantCards[i];
          if (element == null) {
            continue;
          }
          let vasin = element.getAttribute('data-dp-url');
          if (vasin && vasin.includes('/dp/') && vasin.includes('/ref=')) {
            const vasinArr = vasin.split('/dp/');
            vasin = vasinArr.length === 2 ? vasinArr[1].split('/ref=')[0] : '';
            if (vasin !== '') {
              variantList.push(vasin);
            }
          } else {
            vasin = element.getAttribute('data-defaultasin');
          }
        }
      }
      return variantList;
    }

    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      return newDiv;
    }
    const url = window.location.href;
    const mainId = url && url.split('dp/')[1] ? url.split('dp/')[1].replace(/\?(.*)/, '') : [];

    let variantIds = '';
    const allVariants = [...new Set(getVariants())];
    if (allVariants.length > 0) {
      allVariants.push(mainId);
    }
    for (let i = 0; i < allVariants.length; i++) {
      variantIds += `${allVariants[i]} | `;
    }
    variantIds = variantIds.slice(0, -3);

    addHiddenDiv('ii_variant', variantIds);
  });

  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    const additionalDescBullets = document.querySelector('div#feature-bullets');
    if (additionalDescBullets && additionalDescBullets.innerHTML) {
      const ii_additionalDescBullets = additionalDescBullets.innerHTML.replace(/<li>/gm, ' || ').replace(/<.*?>/gm, '').replace(/&nbsp;/g, '').trim();
      addHiddenDiv('ii_additionalDescBullets', ii_additionalDescBullets);
    }

    // ManufacturerDescription
    const manufacturerDesc = document.querySelector('div#aplus');
    if (manufacturerDesc && manufacturerDesc.innerText) {
      const ii_manufacturerDesc = manufacturerDesc.innerText.replace(/\n/g, '');
      addHiddenDiv('ii_manufacturerDesc', ii_manufacturerDesc);
    }

    // Description
    const descBullets = document.querySelectorAll('#feature-bullets li');
    const descParagraph = document.querySelector('#productDescription');

    let ii_desc = '';
    if (descBullets) {
      descBullets.forEach(item => {
        ii_desc += `|| ${item.innerText.replace(/\n \n/g, ':')}`;
      });
    }
    let descriptionBottom = '';
    if (descParagraph && descParagraph.innerText) {
      descriptionBottom = ` | ${descParagraph.innerText}`;
    }
    ii_desc += descriptionBottom;
    addHiddenDiv('ii_desc', ii_desc);

    // Specifications
    const specsArrSelector = document.querySelectorAll('table#productDetails_techSpec_section_1 tr');
    if (specsArrSelector) {
      const specsArr = [];
      for (let i = 0; i < specsArrSelector.length; i++) {
        specsArr.push(specsArrSelector[i].querySelector('th').innerText + ': ' + specsArrSelector[i].querySelector('td').innerText);
      }
      const specs = specsArr.join(' || ');
      addHiddenDiv('specsArr', specs);
    }

    // Product other information
    const prodOtherInfo = document.querySelectorAll('#productDescription p');
    if (prodOtherInfo) {
      const prodOtherInfoArr = [];
      for (let i = 0; i < prodOtherInfo.length; i++) {
        prodOtherInfoArr.push(prodOtherInfo[i].innerText);
      }
      const prodOtherInformation = prodOtherInfoArr.join(' || ');
      addHiddenDiv('prodOtherInformationFetched', prodOtherInformation);
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
        } else {
          sellerNames.push(name.innerText.trim());
        }
      });
      sellerNames && addElementToDocument('pd_otherSellerName', sellerNames.join('|'));
      const sellerPrices = [];
      const otherSellersPrice = otherSellersDocument.querySelectorAll(sellerPricesSelector);
      otherSellersPrice && otherSellersPrice.forEach(price => {
        if (price.innerText) {
          sellerPrices.push(price.innerText.trim().replace('$', ''));
        }
      });
      sellerPrices && addElementToDocument('pd_otherSellersPrice', sellerPrices.join('|'));

      const sellerPrime = [];
      const otherSellersPrime = otherSellersDocument.querySelectorAll(sellerPrimeSelector);
      otherSellersPrime && otherSellersPrime.forEach(prime => {
        if (prime.querySelector('i.a-icon-prime')) {
          sellerPrime.push('Yes');
        } else {
          sellerPrime.push('No');
        }
      });
      sellerPrime && addElementToDocument('pd_otherSellersPrime', sellerPrime.join('|'));

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
      sellerShipping && addElementToDocument('pd_otherSellersShipping2', sellerShipping.join('|'));
    }
    let otherSellers = document.querySelector('div.olp-link-widget a') ? document.querySelector('div.olp-link-widget a') : document.querySelector('div#mbc span#mbc-olp-link a');
    otherSellers = otherSellers ? otherSellers.href : '';
    if (otherSellers) {
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

    if (CurrentSeller && CurrentSeller.search('vendido por Amazon') < 0 && CurrentSeller.match(/vendido por (?:(.*) y |(.*).)/i)) {
      CurrentSeller = (CurrentSeller.match(/vendido por (?:(.*) y |(.*).)/i)[1]) ? CurrentSeller.match(/vendido por (?:(.*) y |(.*).)/i)[1] : CurrentSeller.match(/vendido por (?:(.*) y |(.*).)/i)[2];
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
        if (shipping && shipping.includes('gratis')) {
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
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'IT',
    store: 'amazon',
    transform: null,
    domain: 'amazon.it',
    zipcode: '20019',
  },
  implementation,
};
