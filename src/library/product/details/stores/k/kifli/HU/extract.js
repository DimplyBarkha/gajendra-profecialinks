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
      let productName;
      let productUrl;
      let desc1;
      let desc2;
      let priceCurrency = jsonParsed.offers["priceCurrency"];
      if (priceCurrency != null) {
        addHiddenDiv('priceCurrency_id', priceCurrency);
      }
      productName = jsonParsed.name;
      if (productName != null) {
        var brandName = productName.replace(/ .*/, '');
        console.log(" brandName  " + brandName);
        addHiddenDiv('brandName_id', brandName);
      }
      let url = jsonParsed.offers["url"];
      if (productUrl != null) {
        addHiddenDiv('url_id', productUrl);
      }
    }
     // @ts-ignore
     let description = (document.querySelector("div.kContent"));
     if (description != null) {
      var desc1 = document.evaluate("//div[@class='ckContent']/p[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      var desc2 = document.evaluate("//div[@class='ckContent']/p[6]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      var desc = desc1.textContent +" | "+ desc2.textContent;
      addHiddenDiv('desc_i', desc);
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
  implementation,
};