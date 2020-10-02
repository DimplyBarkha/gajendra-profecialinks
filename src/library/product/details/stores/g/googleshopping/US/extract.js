const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  // Function to check whether manufacturer content exists

  async function moreFromManufacturer () {
    return await context.evaluate(async function () {
      const imgSelector = document.evaluate('//a[@class="Lx5QBd internal-link"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const manImg = imgSelector ? imgSelector.href : '';
      if (manImg) {
        return manImg;
      } else {
        return false;
      }
    });
  }

  async function checkmanufacturerContent () {
    return await context.evaluate(async function () {
      const dtlSelector = document.evaluate('//a[@class="internal-link VXlrBe"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const dtlSrc = dtlSelector ? dtlSelector.href : '';
      if (dtlSrc) {
        return dtlSrc;
      } else {
        return false;
      }
    });
  }

  // Function to fetch manufacturer content and mnufacturer images after visiting iframe URL
  async function fetchSpecs (url) {
    await context.goto(url, { timeout: 15000, waitUntil: 'load', checkBlocked: true });
    return await context.evaluate(async function () {
      const weightNetPath = "//div[contains(text(),'Weight')]//..//following-sibling::td/text()";
      const weightNet = document.evaluate(weightNetPath, document, null, XPathResult.STRING_TYPE, null).stringValue;
      let warranty = '';
      try {
        const warrantytPath = "//div[contains(text(),'Warranty')]//..//following-sibling::td/text()";
        const WText = document.evaluate(warrantytPath, document, null, XPathResult.STRING_TYPE, null).stringValue;
        if (WText) warranty = WText;
      } catch (err) { }

      let brandText = '';
      try {
        const brandTextPath = "//div[contains(text(),'Brand')]//..//following-sibling::td/text() | //td[contains(text(),'Brand')]//following-sibling::td/text()";
        const bText = document.evaluate(brandTextPath, document, null, XPathResult.STRING_TYPE, null).stringValue;
        if (bText) brandText = bText;
      } catch (err) { }

      let shippingDimensions = '';
      try {
        const shippingDimensionsPath = "concat(//div[contains(text(),'Width (Shipping)')]//..//following-sibling::td/text(),'X',//div[contains(text(),'Depth (Shipping)')]//..//following-sibling::td/text(), 'X', //div[contains(text(),'Height (Shipping)')]//..//following-sibling::td/text())";
        let spText = document.evaluate(shippingDimensionsPath, document, null, XPathResult.STRING_TYPE, null).stringValue;
        if (spText) {
          if (spText === 'XX') spText = '';
        }
        if (spText) shippingDimensions = spText;
      } catch (err) { }

      let Dimensions = '';
      try {
        const DimensionsPath = "concat(//div[contains(text(),'Width (Shipping)')]//..//following-sibling::td/text(),'X',//div[contains(text(),'Depth (Shipping)')]//..//following-sibling::td/text(), 'X', //div[contains(text(),'Height (Shipping)')]//..//following-sibling::td/text())";
        let spText = document.evaluate(DimensionsPath, document, null, XPathResult.STRING_TYPE, null).stringValue;
        if (spText) {
          if (spText === 'XX') spText = '';
        }
        if (spText) Dimensions = spText;
      } catch (err) { }

      let shippingWeight = '';
      try {
        const shippingWeightPath = "//div[contains(text(),'Weight (Shipping)')]//..//following-sibling::td/text()";
        const swText = document.evaluate(shippingWeightPath, document, null, XPathResult.STRING_TYPE, null).stringValue;
        if (swText) shippingWeight = swText;
      } catch (err) { }

      let gtin = '';
      try {
        const gtinPath = "//div[contains(text(),'GTIN')]//..//following-sibling::td/text()";
        const gtinText = document.evaluate(gtinPath, document, null, XPathResult.STRING_TYPE, null).stringValue;
        if (gtinText) gtin = gtinText;
      } catch (err) { }

      const specifications = [];
      try {
        const specifiTextPath = "//tr[@class='vm91i']";
        const specIterator = document.evaluate(specifiTextPath, document, null, XPathResult.ANY_TYPE, null);
        let thisNode = specIterator.iterateNext();

        while (thisNode) {
          specifications.push(thisNode.outerText);
          thisNode = specIterator.iterateNext();
        }
      } catch (err) { }
      const colorPath = "//div[contains(text(),'Color')]//..//following-sibling::td/text()";
      const color = document.evaluate(colorPath, document, null, XPathResult.STRING_TYPE, null).stringValue;

      return { brandText, weightNet, color, warranty, shippingDimensions, Dimensions, shippingWeight, gtin, specifications };
    });
  }
  async function fetchManImg (url) {
    await context.goto(url, { timeout: 15000, waitUntil: 'load', checkBlocked: true });
    return await context.evaluate(async function () {
      const imageArray = [];
      const manufacturerDescription = document.body.innerText;
      try {
        const manufacturerImagesList = document.querySelectorAll('img');
        for (let i = 0; i < manufacturerImagesList.length; i++) {
          const imagUrl = manufacturerImagesList[i].getAttribute('src');
          if (imagUrl.indexOf('base64') > -1) continue;
          imagUrl && imageArray.push(imagUrl);
        }
      } catch (err) { }
      return { imageArray, manufacturerDescription };
    });
  }
  // Function to add manufacturer content and description to DOM
  async function addContentToDOM (manContentObj, manufacturerContentLink) {
    await context.evaluate(async function ([manContentObj, manufacturerContentLink]) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      if (manufacturerContentLink) {
        addHiddenDiv('added-weightNet', manContentObj.weightNet);
        addHiddenDiv('added-brandText', manContentObj.brandText);
        addHiddenDiv('added-color', manContentObj.color);
        addHiddenDiv('added-warranty', manContentObj.warranty);
        if (manContentObj.shippingDimensions) {
          addHiddenDiv('added-shippingDimensions', manContentObj.shippingDimensions);
        }
        addHiddenDiv('added-shippingWeight', manContentObj.shippingWeight);
        addHiddenDiv('added-gtin', manContentObj.gtin);
        addHiddenDiv('added-Dimensions', manContentObj.Dimensions);
        for (let i = 0; i < manContentObj.specifications.length; i++) {
          addHiddenDiv('added-spec-' + i, manContentObj.specifications[i]);
        }
      }
    }, [manContentObj, manufacturerContentLink]);
  }
  let manContentObj;

  async function addContentToDOM1 (manImageObj, imageLink) {
    await context.evaluate(async function ([manImageObj, imageLink]) {
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      if (imageLink) {
        for (let i = 0; i < manImageObj.imageArray.length; i++) {
          addHiddenDiv('added-manufacturerImages-' + i, manImageObj.imageArray[i]);
        }
        addHiddenDiv('added-manufacturer-description', manImageObj.manufacturerDescription);
      }
    }, [manImageObj, imageLink]);
  }
  const specsLink = await checkmanufacturerContent();
  const imageLink = await moreFromManufacturer();
  console.log('specsLink ...', specsLink);
  console.log('imageLink ...', imageLink);
  if (specsLink) {
    manContentObj = await fetchSpecs(specsLink);
    console.log('manContentObj', manContentObj);
    await context.goto(inputs.url, { timeout: 15000, waitUntil: 'load', checkBlocked: true });
  }
  let manImageObj;
  if (imageLink) {
    manImageObj = await fetchManImg(imageLink);
    console.log('manImageObj', manImageObj);
    await context.goto(inputs.url, { timeout: 15000, waitUntil: 'load', checkBlocked: true });
  }

  await addContentToDOM(manContentObj, specsLink);
  await addContentToDOM1(manImageObj, imageLink);

  await new Promise((resolve) => setTimeout(resolve, 10000));

  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'googleshopping',
    transform: transform,
    domain: 'shopping.google.com',
    zipcode: '',
  },
  implementation: implementation,
};
