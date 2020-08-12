const { transform } = require('../shared');

async function implementation (inputs,
  parameters,
  context,
  dependencies) {
  const clickPopup = async function (context) {
    const allowCookies = await context.evaluate((selector) => !!document.querySelector(selector), 'a.cc-primary-btn');

    if (allowCookies) {
      await context.click('a.cc-primary-btn');
    }

    const deliveryType = await context.evaluate((selector) => !!document.querySelector(selector), '#fulf-select-D');

    if (deliveryType) {
      await context.click('#fulf-select-D');
      await context.waitForNavigation();
    }
  };

  try {
    await clickPopup(context);
  } catch (err) {
    console.log('Error while clicking allow cookies button');
  }

  try {
    const resultsPagePrimaryProduct = await context.evaluate(async function () {
      const primaryEle = document.querySelector('#shop-products > li');
      if (primaryEle) {
        return true;
      }
      return false;
    });

    if (resultsPagePrimaryProduct) {
      await context.clickAndWaitForNavigation('#shop-products > li', {}, { timeout: 50000 });
    }
  } catch (err) {
    console.log('Error while navigating to primary product of the results page' + err);
  }

  await context.waitForFunction(function (sel, noResultsSel) {
    return Boolean(document.querySelector(sel) || document.querySelector(noResultsSel));
  }, { timeout: 30000 }, 'div.productpagedetail', 'div.curved-shadow');

  const productPageNotFound = await context.evaluate(async function () {
    const doesProductAvailable = document.querySelector('div.productpagedetail');
    if (!doesProductAvailable) {
      return true;
    }
    return false;
  });

  if (productPageNotFound) {
    console.log('Product not found');
    return;
  }

  try {
    const tabsCount = await context.evaluate(async function () {
      // @hack - Sometimes info inside tabs is not populating
      return document.querySelectorAll('#tabnav > li > a').length;
    });

    if (tabsCount) {
      for (let i = tabsCount, j = tabsCount; i > 0; i--) {
        const clickSelector = `#tabnav > li:nth-child(${i + j - 1}) > a`;
        await context.click(clickSelector);
        await context.waitForSelector(`#content${j - 1}`);
        j--;
      }
    }
  } catch (err) {
    console.log('Error while navigating b/w tabs' + err);
  }

  try {
    await context.evaluate(async function () {
      const doesProductAvailable = getEleByXpath('//div[contains(@class,"productpagedetail")]');
      if (!doesProductAvailable) {
        return;
      }
      // Getting the available details from script
      const productData = findProductDetails();
      addEleToDoc('productId', productData.id);
      addEleToDoc('productName', productData.name);
      addEleToDoc('productPrice', productData.price);

      // Normalizing & Adding nutritional info to DOM as there are lot of escape formats involved
      addNutritionalEle('saltPerServing', '/html/body//table//th[contains(text(), \'Salt\')]/following-sibling::td[1]', 'saltPerServingUom');
      addNutritionalEle('servingSize', '//h2[contains(.,"Nutritional Information")]/following-sibling::table//tr[1]/th[2]', 'servingSizeUom');

      const multiNutriObj = {
        totalFatPerServing: 'Fat',
        saturatedFatPerServing: 'Saturates',
        totalCarbPerServing: 'Carbohydrate',
        dietaryFibrePerServing: 'Fibre',
        totalSugarsPerServing: 'Sugars',
        proteinPerServing: 'Protein',
        calciumPerServing: 'Calcium',
        vitaminCPerServing: 'Vitamin C',
      };

      addMultipleNutritionalEle(multiNutriObj);

      const servingSuggestHeader = getEleByXpath('//th[contains(.,\'Serving Suggestion\')]');
      const servingSuggest = getEleByXpath('//th[contains(.,\'Serving Suggestion\')]/following-sibling::td');
      if (servingSuggestHeader) {
        addEleToDoc('servingSuggest', `${servingSuggestHeader} : ${servingSuggest}`);
      }

      function getEleByXpath (xpath) {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const text = element ? element.textContent : null;
        return text;
      }

      function addNutritionalEle (property, xpath, propertyUom) {
        const servingProp = getEleByXpath(xpath);
        let normalizedServingProp = '';
        if (servingProp) {
          if (property === 'servingSize') {
            normalizedServingProp = servingProp.replace('mg', '').replace('g', '').replace('ml', '').replace('Per', '').trim();
          } else {
            normalizedServingProp = servingProp.replace('mg', '').replace('g', '').replace('ml', '').replace('Per', '').replace(':', '').split('(')[0].trim();
          }
          addEleToDoc(property, normalizedServingProp);
          if (servingProp.includes('mg')) {
            addEleToDoc(propertyUom, 'mg');
          } else if (servingProp.includes('g')) {
            addEleToDoc(propertyUom, 'g');
          } else if (servingProp.includes('ml')) {
            addEleToDoc(propertyUom, 'ml');
          } else if (servingProp.includes('%')) {
            addEleToDoc(propertyUom, '%');
          }
        }
      }

      function addMultipleNutritionalEle (propertiesObj) {
        for (const prop in propertiesObj) {
          const xpath = `//th[contains(.,'${propertiesObj[prop]}') or contains(.,'${propertiesObj[prop].toLowerCase()}')]/following-sibling::td[1]`;
          addNutritionalEle(`${prop}`, xpath, `${prop}Uom`);
        }
      }

      function findProductDetails () {
        const xpath = '//script[contains(.,\'productDetails\')]';
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        console.log('Element' + element);
        const scriptContent = element.textContent;
        let scriptContentArr = scriptContent.split(';');
        scriptContentArr = scriptContentArr.filter(function (item) { if (item.includes('productsObject.')) return item; });
        const productDetails = {};
        for (let i = 0; i < scriptContentArr.length; i++) {
          const chunk = scriptContentArr[i];
          const productProp = chunk.substring(chunk.indexOf('productsObject.') + 'productsObject.'.length, chunk.indexOf(' ='));
          const productPropVal = chunk.substring(chunk.indexOf(`productsObject.${productProp} = "`) + `productsObject.${productProp} = "`.length, chunk.lastIndexOf('"'));
          productDetails[productProp] = productPropVal;
        }
        return productDetails;
      }

      function addEleToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }
    });
  } catch (err) {
    console.log('Error while adding nutritional elements to the DOM' + err);
  }

  try {
    await context.evaluate(function () {
      const manufacturerNodeList = document.evaluate("//h2[contains(text(), 'Manufacturer’s Address')]/following-sibling::p/text()", document.body, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      const length = manufacturerNodeList.snapshotLength;
      if (length !== 0) {
        let text = '';
        if (manufacturerNodeList.snapshotItem(0).textContent.match(/bottle/ig) || manufacturerNodeList.snapshotItem(0).textContent.match(/produce/ig) || manufacturerNodeList.snapshotItem(0).textContent.match(/brewed/ig) || manufacturerNodeList.snapshotItem(0).textContent.match(/manufacture/ig) || manufacturerNodeList.snapshotItem(0).textContent.match(/distilled/ig) || manufacturerNodeList.snapshotItem(0).textContent === 'GB:' || manufacturerNodeList.snapshotItem(0).textContent === 'UK:') {
          text = manufacturerNodeList.snapshotItem(1).textContent;
        } else {
          text = manufacturerNodeList.snapshotItem(0).textContent;
        }
        text = text.trim();
        if (text[text.length - 1] === ',') {
          text = text.substring(0, text.length - 1);
        }
        const mfgEle = document.createElement('div');
        mfgEle.id = 'manufacturer';
        mfgEle.textContent = text;
        mfgEle.style.display = 'none';
        document.body.appendChild(mfgEle);
      }
    });
  } catch (err) {
    console.log('Error while evaluating manufacturing info' + err);
  }

  const { productDetails } = dependencies;
  const { transform } = parameters;
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'bestwaywholesale',
    transform,
    domain: 'bestwaywholesale.co.uk',
    zipcode: '',
  },
  implementation,
};
