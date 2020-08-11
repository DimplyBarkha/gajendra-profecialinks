const { transform } = require('../../../../sharedAmazon/transform');
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

  async function setLocale () {
    // openNewLocaleModalBtn
    await helpers.checkAndClick('#nav-global-location-slot a', 'css', 20000);
    // changeLocaleBtn
    await helpers.checkAndClick('a[id*="ChangePostalCodeLink"]', 'css', 20000);

    await new Promise(r => setTimeout(r, 2000));

    // localeInputCheck
    await helpers.checkAndClick('input[data-action*=PostalInputAction]', 'css', 20000, '10001');

    await new Promise(r => setTimeout(r, 2000));

    // setNewLocalBtnCheck
    await helpers.checkAndClick('[data-action*="GLUXPostalUpdateAction"] input', 'css', 20000);

    // setNewLocalDoneCheck
    await helpers.checkAndClick('button[name=glowDoneButton]', 'css', 20000);

    await new Promise(r => setTimeout(r, 2000));
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

  async function getLbb () {
    const elem = await helpers.checkXpathSelector("//div[contains(@id, 'glow-toaster-body') and //*[contains(text(), 'Amazon Fresh')]]/following-sibling::div[@class='glow-toaster-footer']//input[@data-action-type='SELECT_LOCATION']");
    if (elem) {
      await helpers.checkAndClick('#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a', 'css', 20000);
      // await helpers.checkURLFor('offer');

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

  await setLocale();

  const allVariants = [...new Set(await getVariants())];
  await getLbb();
  await helpers.addURLtoDocument('added-url');
  await helpers.addURLtoDocument('added-asin', true);

  await context.extract(productDetails, { transform, type: 'APPEND' });

  for (let i = 0; i < allVariants.length; i++) {
    const id = allVariants[i];
    const url = await dependencies.createUrl({ id });
    await dependencies.goto({ url });
    await helpers.addURLtoDocument('added-url');
    await helpers.addURLtoDocument('added-asin', true);
    await getLbb();
    await context.extract(productDetails, { transform, type: 'APPEND' });
    const pageVariants = await getVariants();

    for (let j = 0; j < pageVariants.length; j++) {
      const pageVariant = pageVariants[j];
      if (allVariants.indexOf(pageVariant) === -1) {
        allVariants.push(pageVariant);
      }
    }
  }

}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazonFresh',
    transform: transform,
    domain: 'amazon.com',
  },
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
    Helpers: 'module:helpers/helpers',
  },
  implementation,
};
