<<<<<<< Updated upstream
const { transform } = require('../../../../sharedAmazon/transformNew');
=======
const { transform } = require('./transform');
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
  const { goto, productDetails, Helpers: { Helpers } } = dependencies;

  const helpers = new Helpers(context);
  async function loadContent () {
    try {
      await context.evaluate(() => {
        document.querySelector('#reviewsMedley').scrollIntoView({
          behavior: 'smooth',
        });
      });
      await context.waitForNavigation({ waitUntil: 'networkidle0' });
      await context.waitForSelector('[data-feature-name="productDetails"],[data-feature-name="detailBullets"]');
      return true;
    } catch (err) {
      return false;
    }
  }

  const MAX_TRIES = 3;
  let counter = 1;
  let loaded = false;
  const pageUrl = await context.evaluate(() => window.location.href);
  do {
    loaded = await loadContent();
    if (!loaded) {
      await goto({ url: pageUrl });
    }
    counter++;
  } while (!loaded && counter <= MAX_TRIES);
  if (!loaded) {
    throw new Error('Product detail not loaded.');
  }
  async function getOtherSellerInfo (id) {
    const asin = id || document.querySelector('#added-asin').innerText.match(/\w+/)[0];
    // Should we consider getting data from first page(max 10).
    let page = 1;
    let api = `/gp/aod/ajax?asin=${asin}&pageno=${page}`;
    let notLastPage = true;
    let data = [];
    let totalCount = 0;
    while (notLastPage) {
      const response = await fetch(api);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');
      if (page === 1) {
        totalCount = doc.querySelector('#aod-total-offer-count').value;
        const primeFlag = doc.querySelector('div[id^="aod-bottlingDepositFee-0"]+span>a') && 'Yes - Shipped and Sold';
        if (primeFlag) {
          document.body.setAttribute('prime-flag', primeFlag);
        }
      }
      const sellerData = Array.from(doc.querySelectorAll('#aod-offer')).map(offer => {
        const sellerPrice = offer.querySelector('div[id^="aod-price"] span[class="a-offscreen"]') && offer.querySelector('div[id^="aod-price"] span[class="a-offscreen"]').innerText || '';
        const sellerName = offer.querySelector('div[id="aod-offer-soldBy"] a, div[id="aod-offer-soldBy"] div[class="a-fixed-left-grid-col a-col-right"] > span[class="a-size-small a-color-base"]') && offer.querySelector('div[id="aod-offer-soldBy"] a,div[id="aod-offer-soldBy"] div[class="a-fixed-left-grid-col a-col-right"] > span[class="a-size-small a-color-base"]').innerText || '';
        const shippingPrice = offer.querySelector('div[id^="aod-bottlingDepositFee"]+span>span') && offer.querySelector('div[id^="aod-bottlingDepositFee"]+span>span').textContent || '0.00';
        const sellerPrime = offer.querySelector('div[id^="aod-bottlingDepositFee"]+span>a') && 'YES' || 'NO';
        return { sellerPrice, sellerName, shippingPrice, sellerPrime };
      });
      data = data.concat(sellerData);
      notLastPage = Number(totalCount) > data.length;
      api = `/gp/aod/ajax?asin=${asin}&pageno=${++page}`;
    }
    const lbb = data.find(elm => elm.sellerName.includes('Amazon')) ? 'YES' : 'NO';
    document.body.setAttribute('is-llb', lbb);
    const sellerPrice = data.map(seller => seller.sellerPrice.trim()).join('|');
    const sellerName = data.map(seller => seller.sellerName.trim()).join('|');
    const shippingPrice = data.map(seller => {
      const price = seller.shippingPrice.replace('+', '').trim();
      return price.match(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/) ? price.match(/\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?/)[0] : '0.00';
    }).join('|');
    const sellerPrime = data.map(seller => seller.sellerPrime.trim()).join('|');
    document.body.setAttribute('seller-price', sellerPrice);
    document.body.setAttribute('seller-name', sellerName);
    document.body.setAttribute('shipping-price', shippingPrice);
    document.body.setAttribute('seller-prime', sellerPrime);
    console.log(data);
    return data;
  }

  async function pageData () {
    return await context.evaluate(async () => {
      const pageContext = {};
      // get variants
      pageContext.variants = window.isTwisterPage ? [...new Set(Object.keys(window.twisterController.initTwisterState.twisterVariationsData.dimensionValuesDisplay))] : null;
      // get parentAsin
      pageContext.parentAsin = window.isTwisterPage ? window.twisterController.twisterJSInitData.parent_asin : null;
      // get currentAsin
      pageContext.currentAsin = window.isTwisterPage ? window.twisterController.twisterJSInitData.current_asin : window.ue_pti;
      // get largeImageCount
      pageContext.largeImageCount = document.evaluate('//script[contains(text(), "ImageBlockATF")]/text()', document.body, null, XPathResult.ANY_TYPE, null).iterateNext() ? document.evaluate('//script[contains(text(), "ImageBlockATF")]/text()', document.body, null, XPathResult.ANY_TYPE, null).iterateNext().toString().split('SL1500').length : 0;
      // check for additionalRatings
      pageContext.additionalRatings = !!document.querySelector('table#histogramTable');

      return pageContext;
    });
  }

  async function appendData (d, c) {
    const append = { d, c };
    return await context.evaluate(async (data) => {
      if (Array.isArray(data.d)) {
        data.d.map(item => {
          const div = document.createElement('div');
          div.setAttribute('id', item);
          div.setAttribute('class', data.c);
          document.body.appendChild(div);
        });
      } else {
        const div = document.createElement('div');
        document.body.appendChild(div);
        div.setAttribute('id', data.d);
        div.setAttribute('class', data.c);
      }
    }, append);
  }

  async function pageManipulation (page) {
    if (page.additionalRatings) {
      await context.evaluate(async (page) => {
        document.querySelector('table#histogramTable').scrollIntoView();
      }, page);
      await context.waitForXPath('//div[@data-hook="cr-summarization-attributes-list"]//span[contains(@class,"a-size-base")]', { timeout: 5000 })
        .catch(() => console.log('no additional ratings'));
    }
  }

  const pageContext = await pageData();

  await appendData(pageContext.variants, 'my-variants');
  await appendData(pageContext.parentAsin, 'my-parent-asin');
  await appendData(pageContext.currentAsin, 'my-current-asin');
  await appendData(pageContext.largeImageCount, 'my-large-image-count');
  await helpers.addURLtoDocument('added-url');
  await helpers.addURLtoDocument('added-asin', true);

  const zoomXpath = '//span[@id="canvasCaption" and contains(text(),  "Roll over")]';
  await helpers.getAndAddElem(zoomXpath, 'added-imageZoomFeaturePresent', { callback: val => val ? 'Yes' : 'No' });

  const xpath360 = '//li[contains(@class, "pos-360") and not(contains(@class, "aok-hidden"))]//img';
  await helpers.getAndAddElem(xpath360, 'added-image360Present', { property: 'src', callback: val => val ? 'Yes' : 'No' });

  try {
    await context.evaluate(getOtherSellerInfo);
  } catch (err) {
    console.log('Error while adding other seller info');
  }

  await pageManipulation(pageContext);
  await context.extract(productDetails, { transform });
=======
  const { productDetails } = dependencies;

  async function setLocale () {
    async function openNewLocaleModalBtnCheck () {
      console.log('openNewLocaleModalBtnCheck() in  progress')
      return await context.evaluate(function () {
        const button = '#nav-global-location-slot a';
        if (!!document.querySelector(button)){
          return button
        }
        else{
          return 'false';
        }
      });
    }
    async function changeLocaleBtnCheck () {
      console.log('changeLocaleBtnCheck() in  progress')
      return await context.evaluate(function () {
        const button = 'a[id*="ChangePostalCodeLink"]';
        if (!!document.querySelector(button)){
          return button
        }
        else{
          return 'false';
        }
      });
    }
    async function localeInputCheck () {
      console.log('localeInputCheck')
      return await context.evaluate(function () {
        const input = 'input[data-action*=PostalInputAction]';
        if (!!document.querySelector(input)){
          return input
        }
        else{
          return 'false';
        }
      });
    }
    async function setNewLocalBtnCheck () {
      console.log('setNewLocalBtnCheck() in  progress')
      return await context.evaluate(function () {
        const button = '[data-action*="GLUXPostalUpdateAction"] input';
        if (!!document.querySelector(button)){
          return button
        }
        else{
          return 'false';
        }
      });
    }
    async function setNewLocalDoneCheck () {
      console.log('setNewLocalDoneCheck() in  progress')
      return await context.evaluate(function () {
        const button = 'button[name=glowDoneButton]';
        if (!!document.querySelector(button)){
          return button
        }
        else{
          return 'false';
        }
      });
    }
    const openNewLocaleModalBtn = await openNewLocaleModalBtnCheck()
    if(openNewLocaleModalBtn !== 'false'){
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.click(openNewLocaleModalBtn)
      ]);
    };
    const changeLocaleBtn = await changeLocaleBtnCheck()
    if(changeLocaleBtn !== 'false'){
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.click(changeLocaleBtn)
      ]);    
    }
    await new Promise(r => setTimeout(r, 2000));
    const localeInput = await localeInputCheck()
    if(localeInput !== 'false'){
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.setInputValue(localeInput, "10001")
      ]);
    }
    await new Promise(r => setTimeout(r, 2000));
    const setNewLocalBtn = await setNewLocalBtnCheck()
    if(setNewLocalBtn !== 'false'){
      const [response] = await Promise.all([
        // context.waitForMutuation('#GLUXZipConfirmationSection', { timeout: 5000 }),
        context.waitForNavigation({ timeout: 20000 }),
        context.click(setNewLocalBtn)
      ]);
    }
    const setNewLocalDone = await setNewLocalDoneCheck()
    if(setNewLocalDone !== 'false'){
      console.log('here')
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.click(setNewLocalDone)
      ]);
    }
    await new Promise(r => setTimeout(r, 2000));
    return
  }

  async function getVariants () {
    const variants = await context.evaluate(function () {
      const variantList = [];
      const variantCards = document.querySelectorAll('li[data-defaultasin]');
      const variantDropdown = document.querySelectorAll('[id*="variation"] option');
      const variantBooks = document.querySelectorAll('[id*="Swatches"]>ul>li a[id][href*="dp"]');
      // const parentVariant = document.evaluate("//script[contains(@type,'a-state') and contains(text(), 'parentAsin')]", document, null, XPathResult.ANY_TYPE, null) ? document.evaluate("//script[contains(@type,'a-state') and contains(text(), 'parentAsin')]", document, null, XPathResult.ANY_TYPE, null).iterateNext() : null;
      // if(parentVariant){
      //   const regex = /parentAsin\"\:\"([A-Za-z0-9]{10,})/s;
      //   let vasinRaw = parentVariant.innerText;
      //   const vasin = vasinRaw.match(regex) ? vasinRaw.match(regex)[1] : '';
      //   if(vasin !== ''){
      //     variantList.push(vasin);
      //     }
      // }
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
            if(vasin !== ''){
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
            if(vasin !== ''){
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
          const vasin = element.getAttribute('data-defaultasin');
          if (vasin !== ''){
            variantList.push(vasin);
          }
        }
      }
      return variantList;
    });
    return variants;
  };

  async function buttonCheck () {
    return await context.evaluate(function () {
      const button = '#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a';
      // const button2 = '#mbc-olp-link>a';
      // const button3 = '[data-show-all-offers-display] a';
      if (!!document.querySelector(button)){
        return button
      }
      // else if(!!document.querySelector(button2)){
      //   return button2
      // }else if(!!document.querySelector(button3)){
      //   return button3
      // }
      else{
        return 'false';
      }
    });
  }

  async function checkNavigation() {
    return await context.evaluate(function () {
      function checkNav (id, content) {
        const url = window.location.href;
        if(url.includes('offer')){
          console.log("@@@@@@@@@@@@@@@@@ we navigated")
        }else{
          console.log("@@@@@@@@@@@@@@@@@ we didnt navigated")
        }
      }
    });
  }

  async function getLbb () {
    const button = await buttonCheck();
    console.log('##############################' ,  button)
    if ( button !== 'false' ) {
        console.log('trying button', button)
        const [response] = await Promise.all([
          context.waitForNavigation({ timeout: 20000 }),
          context.click(button),
        ]);
      await checkNavigation();

      const otherSellersDiv = 'div#all-offers-display div#aod-offer div[id*="aod-price"]';
      await context.waitForSelector(otherSellersDiv, { timeout: 20000 });

      return await context.evaluate(function () {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }

        const firstCheck = document.querySelector('div#shipsFromSoldByInsideBuyBox_feature_div');
        const otherSellers = document.querySelectorAll('div#aod-offer');
        const price = document.querySelector('span#price_inside_buybox');
        if (firstCheck && price) {
          const priceText = parseFloat((price.innerText).slice(1));
          if (firstCheck.innerText !== 'Ships from and sold by Amazon.com.' && otherSellers) {
            otherSellers.forEach((seller) => {
              const sellerPrice = seller.querySelector('span.a-offscreen').innerText;
              const priceNum = parseFloat(sellerPrice.slice(1));
              const shipsFrom = seller.querySelector('div#aod-offer-shipsFrom div.a-column.a-span9.a-span-last');
              const soldBy = seller.querySelector('div#aod-offer-soldBy div.a-column.a-span9.a-span-last');
              if (shipsFrom.innerText === 'Amazon.com' && soldBy.innerText === 'Amazon.com' && priceNum > priceText) {
                addHiddenDiv('ii_lbb', 'YES');
                addHiddenDiv('ii_lbbPrice', `${priceNum}`);
              }
            });
          }
        }
      });
    }
  }

  async function addUrl () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    let url = window.location.href;
    const splits = url ? url.split('/') : [];
    let asinRaw = (splits.length > 0) ? splits[splits.length - 1] : '';
    addHiddenDiv('added-url', url);
    addHiddenDiv('added-asin', asinRaw);
  }

  await setLocale();
  // @ts-ignore
  const allVariants = [...new Set(await getVariants())];
  await getLbb();
  await context.evaluate(addUrl);
  console.log('getting variants');
  await context.extract(productDetails, { transform, type: 'APPEND' });
  console.log('#### of Variants:', allVariants.length);
  console.log('#### Variants:', allVariants);
  for (let i = 0; i < allVariants.length; i++) {
    const id = allVariants[i];
    const url = await dependencies.createUrl({ id });
    await dependencies.goto({ url });
    await context.evaluate(addUrl);
    await getLbb();
    await context.extract(productDetails, { transform, type: 'APPEND' });
    const pageVariants = await getVariants();
    console.log('#### of Variants:', allVariants.length);
    console.log('#### Variants:', allVariants);
    for (let j = 0; j < pageVariants.length; j++) {
      const pageVariant = pageVariants[j];
      if (allVariants.indexOf(pageVariant) === -1) {
        allVariants.push(pageVariant);
        console.log('new variant: ' + pageVariant);
        console.log(allVariants);
      }
    }
  }

  // return await context.extract(productDetails, { transform });
>>>>>>> Stashed changes
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    transform: transform,
    domain: 'amazon.com',
  },
<<<<<<< Updated upstream
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
    goto: 'action:navigation/goto',
  },
=======
>>>>>>> Stashed changes
  implementation,
};

