const { transform } = require('./transform');
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
  const { productDetails } = dependencies;

  async function getVariants () {
    const variants = await context.evaluate(function () {
      const variantList = [];
      const elements = document.querySelectorAll('li[data-defaultasin]');
      for (let i = 0; i < elements.length; i++) {
        console.log(i);
        const element = elements[i];
        if (element == null) {
          continue;
        }
        const vasin = element.getAttribute('data-defaultasin');
        if (vasin !== '') {
          variantList.push(vasin);
        }
      }

      return variantList;
    });
    return variants;
  };

  async function buttonCheck () {
    return await context.evaluate(function () {
      const button = document.querySelector('#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a');
      if (button != null) {
        return 'true';
      } else {
        return 'false';
      }
    });
  }

  async function getLbb () {
    const sellersShowButton = '#olpLinkWidget_feature_div span[data-action="show-all-offers-display"] a';
    if (await buttonCheck() === 'true') {
      const [response] = await Promise.all([
        context.waitForNavigation({ timeout: 20000 }),
        context.click(sellersShowButton),
      ]);
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
    url = (splits.length > 0) ? splits[splits.length - 1] : '';
    addHiddenDiv('added-asin', url);
  }


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
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'amazon',
    transform: transform,
    domain: 'amazon.com',
  },
  implementation,
};
