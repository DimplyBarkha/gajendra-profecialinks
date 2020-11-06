
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'FR',
    store: 'carrefour',
    transform: null,
    domain: 'carrefour.fr',
    zipcode: '',
  },
  implementation,
};

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
  let list = await context.evaluate(() => !document.querySelector('section.side-template__section div.product-list ul#data-plp_produits:nth-child(3)'))
  if (!list) {
    async function firstItemLink() {
      return await context.evaluate(function () {
        let firstItem = document.querySelector('li.product-grid-item article a')
        // @ts-ignore
        firstItem = firstItem ? firstItem.href : '';
        console.log('firstItem: ', firstItem);
        let finalLink
        // @ts-ignore
        if (firstItem.includes('http') & firstItem !== '') {
          finalLink = firstItem
          // @ts-ignore
        } else if (firstItem !== '') {
          finalLink = 'https://www.carrefour.fr' + firstItem;
        }
        return finalLink;
      });
    }
    const url = await firstItemLink();
    if (url !== null) {
      await context.goto(url, { timeout: 10000, waitUntil: 'load', checkBlocked: true });
    }
    await context.waitForNavigation();
  }
  await new Promise((resolve, reject) => setTimeout(resolve, 8000));
  //-------------------------
  await context.evaluate(async (parentInput) => {
  
    function addElementToDocument (key, value) {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    }
    });
    return await context.extract(productDetails, { transform });
    }
