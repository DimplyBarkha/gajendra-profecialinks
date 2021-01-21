async function implementation(inputs, parameters, context, dependencies){
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
  try{
    let jsonString = await getElementByXpath('//script[@id="hz-ctx"]/text()');
    var jsonParsed = JSON.parse(jsonString);
    var datavar = Object.keys(jsonParsed.data.stores.data.ProductVariationsStore.data)[0]
    var variantsArr = Object.keys(jsonParsed.data.stores.data.ProductVariationsStore.data[datavar].variationProducts)
  
    allVariants = variantsArr.filter(function (item, pos) {
      return variantsArr.indexOf(item) === pos;
    });
  }catch(e){
    console.log("Variants not available")
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
}
module.exports = {
  implements: 'product/details/variants/variantsExtract',
  parameterValues: {
    country: 'US',
    store: 'houzz',
    transform: null,
    domain: 'houzz.com',
    zipcode: '',
  },
  implementation,  
}
