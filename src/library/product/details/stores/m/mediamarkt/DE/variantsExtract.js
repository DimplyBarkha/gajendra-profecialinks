
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { variants } = dependencies;
  async function getElementByXpath (xpath) {
    return await context.evaluate((xpath) => {
      const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      console.log('Element' + element);
      const text = element ? element.textContent : null;
      return text;
    }, xpath);
  }

  async function getVariants (productID) {
    return context.evaluate(async function (productID) {
      let result = [];
      console.log(productID);
      const productIDText = productID.replace('| Art.-Nr. ', '').replace(' | ', '').trim();
      const graphQLCall = `GraphqlProduct:${productIDText}`;
      console.log(graphQLCall);
      // @ts-ignore
      if (window.__PRELOADED_STATE__ && window.__PRELOADED_STATE__.apolloState && window.__PRELOADED_STATE__.apolloState[graphQLCall]) {
        // @ts-ignore
        console.log(window.__PRELOADED_STATE__.apolloState[graphQLCall]);
        // @ts-ignore
        if (window.__PRELOADED_STATE__.apolloState[graphQLCall].variants) {
          // @ts-ignore
          const productVariants = window.__PRELOADED_STATE__.apolloState[graphQLCall].variants;
          try {
            result = productVariants[0].variantProducts.map(el => el.productId);
            console.log(result);
          } catch (e) {
            console.log(e);
            console.log('Could not extract variants');
          }
        }
      }
      return result;
    }, productID);
  }

  const productID = await getElementByXpath('(//span[contains(@class, "DetailsHeader__")]//span)[1]');

  const variantArr = await getVariants(productID);

  await context.evaluate(async ({ variantArr }) => {
    const addElementToDocument = (key, value) => {
      const catElement = document.createElement('div');
      catElement.id = key;
      catElement.textContent = value;
      catElement.style.display = 'none';
      document.body.appendChild(catElement);
    };
    for (let i = 0; i < variantArr.length; i++) {
      addElementToDocument('product_variant', variantArr[i]);
    }
  }, { variantArr });
  return await context.extract(variants);
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'DE',
    store: 'mediamarkt',
    transform: null,
    domain: 'mediamarkt.de',
    zipcode: "''",
  },
  implementation,
};
