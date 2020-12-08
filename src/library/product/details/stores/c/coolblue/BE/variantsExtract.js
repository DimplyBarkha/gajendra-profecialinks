module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'BE',
    store: 'coolblue',
    transform: null,
    domain: 'coolblue.be',
    zipcode: "''",
  },
  implementation: async (inputs, parameters, context, dependencies) => {
    const { variants } = dependencies;
    async function getElementByXpath (xpath) {
      return await context.evaluate((xpath) => {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const text = element ? element.textContent : null;
        return text;
      }, xpath);
    }
    let allVariants = [];
    try {
      let variantsText = await getElementByXpath('//div[contains(@class,"multi-discriminant-collection")]/../../@data-component');
      if (!variantsText) variantsText = await getElementByXpath('//div[contains(@data-component,"collectionEntranceDropDown")]/../../div/@data-component');
      const variantsArr = JSON.parse(variantsText)[0].options.ga.label.replace(/\|/g, ',').split(',');
      allVariants = variantsArr.filter(function (item, pos) {
        return variantsArr.indexOf(item) === pos;
      });
    } catch (e) {
      console.log('Variants not available');
    }
    console.log(allVariants);
    await context.evaluate(async ({ allVariants }) => {
      const addElementToDocument = (key, value) => {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      };
      if (!allVariants.length) {
        allVariants.push(window.location.href.match(/\/product\/(\d+)/)[1]);
      }
      for (let i = 0; i < allVariants.length; i++) {
        addElementToDocument('product_variant', allVariants[i]);
      }
    }, { allVariants });
    return await context.extract(variants);
  },
};
