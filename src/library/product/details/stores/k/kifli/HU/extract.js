async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;


  await new Promise((resolve, reject) => setTimeout(resolve, 3000));

  await context.evaluate(async function () {
    function addHiddenDiv(id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // @ts-ignore
    const jsonString = document.querySelector("script[type='application/ld+json']").innerText;
    let jsonParsed = {};
    if (jsonString && jsonString.trim()) {
      jsonParsed = JSON.parse(jsonString);
      let availabilityText;
      let productName;
      let availabilityTextStr = jsonParsed.offers["availability"]
      if (availabilityTextStr.search("InStock")) {
        availabilityText = "In Stock";
      } else {
        availabilityText = "'Out of stock";
      }

      let priceCurrency = jsonParsed.offers["priceCurrency"]
      //  let price = jsonParsed.offers["price"]
      if (jsonParsed.name) {
        //alert(jsonParsed.name)
        productName = jsonParsed.name;
        var brandName = productName.replace(/ .*/,'');
      }
      addHiddenDiv('brandName_id', brandName);
      addHiddenDiv('priceCurrency_id', priceCurrency);
      addHiddenDiv('availabilityText_id', availabilityText);
      //addHiddenDiv('price_id', price);
    }
  });

  return await context.extract(productDetails, { transform });
}

const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'HU',
    store: 'kifli',
    transform: cleanUp,
    domain: 'kifli.hu',
  },
  inputs: [
  ],
  dependencies: {
    productDetails: 'extraction:product/details/stores/${store[0:1]}/${store}/${country}/extract',
  },
  path: './stores/${store[0:1]}/${store}/${country}/extract',
  implementation,

};