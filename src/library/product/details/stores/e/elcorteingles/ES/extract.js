
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    transform: null,
    domain: 'elcorteingles.es',
  },
  // @ts-ignore
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      function findJsonData (scriptSelector, startString, endString) {
        try {
          const xpath = `//script[contains(.,'${scriptSelector}')]`;
          const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          // @ts-ignore
          const scriptContent = element.innerText;
          const startIdx = scriptContent.indexOf(startString);
          const endIdx = scriptContent.indexOf(endString);
          let jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
          jsonStr = jsonStr.trim();
          return JSON.parse(jsonStr);
        } catch (error) {
          console.log(error.message);
        }
      }

      function findJsonObj (scriptSelector) {
        try {
          const xpath = `//script[contains(.,'${scriptSelector}')]`;
          const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          // @ts-ignore
          let jsonStr = element.innerText;
          jsonStr = jsonStr.trim();
          return JSON.parse(jsonStr);
        } catch (error) {
          console.log(error.message);
        }
      }

      const imageData = findJsonObj('image');
      if (imageData) {
        addElementToDocument('product_image', `https:${imageData.image}`);
        addElementToDocument('product_description', imageData.description);
        addElementToDocument('sku', imageData.sku);
      }

      // elements from data Layer object
      const dataObj = findJsonData('dataLayer', '=', ';');
      if (dataObj) {
        if (dataObj[0].product.status.toLowerCase() === 'available') {
          addElementToDocument('availability', 'In Stock');
        } else {
          addElementToDocument('availability', 'Out Of Stock');
        }
        addElementToDocument('brand', dataObj[0].product.brand);
        if (dataObj[0].product.id) {
          if (dataObj[0].product.id.match(/[0-9](.*)___/)) {
            const retailerProductCode = dataObj[0].product.id.match(/[0-9](.*)___/)[1];
            addElementToDocument('retailer_product_code', retailerProductCode);
          }
        }
        if (dataObj[0].product.quantity) {
          addElementToDocument('quantity', dataObj[0].product.quantity);
        }
      }

      function ingredientContent (ingredientName, text) {
        const content = document.querySelectorAll('div.pdp-info-container div.info');
        if (content.length > 1) {
          if (content[1].textContent.includes(ingredientName)) {
            let calcium;
            if (ingredientName.toLowerCase() === 'calcio') {
              if (content[1].textContent.includes(text)) {
                calcium = content[1].textContent.replace(/(.+Calcio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$2');
                addElementToDocument('calcium', calcium);
                if (calcium) {
                  const calciumUnit = content[1].textContent.replace(/(.+Calcio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$3');
                  addElementToDocument('calciumUnit', calciumUnit);
                }
              } else {
                calcium = content[1].textContent.replace(/(.+Calcio)\s(\d+,\d+)\s(.*)/g, '$2');
                addElementToDocument('calcium', calcium);
              }
            } else if (ingredientName.toLowerCase() === 'sodio') {
              let sodium;
              if (content[1].textContent.includes(text)) {
                sodium = content[1].textContent.replace(/(.+Sodio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$2');
                addElementToDocument('sodium', sodium);
                if (sodium) {
                  const sodiumUnit = content[1].textContent.replace(/(.+Sodio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$3');
                  addElementToDocument('sodiumUnit', sodiumUnit);
                }
              } else {
                sodium = content[1].textContent.replace(/(.+Sodio)\s(\d+,\d+)[.\s](.*)/g, '$2');
                addElementToDocument('sodium', sodium);
              }
            } else if (ingredientName.toLowerCase() === 'magnesio') {
              let magnesium;
              if (content[1].textContent.includes(text)) {
                magnesium = content[1].textContent.replace(/(.+Magnesio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$2');
                addElementToDocument('magnesium', magnesium);
                if (magnesium) {
                  const magnesiumUnit = content[1].textContent.replace(/(.+Magnesio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$3');
                  addElementToDocument('magnesiumUnit', magnesiumUnit);
                }
              } else {
                magnesium = content[1].textContent.replace(/(.+Magnesio)\s(\d+,\d+)\s(.*)/g, '$2');
                addElementToDocument('magnesium', magnesium);
              }
            }
          }
        }
      }
      ingredientContent('Calcio', 'Calcio (');
      ingredientContent('Magnesio', 'Magnesio (');
      ingredientContent('Sodio', 'Sodio (');

      const reviewsCount = document.querySelector('div.bv-content-pagination-pages-current');
      let reviewCount;
      if (reviewsCount) {
        reviewCount = reviewsCount.textContent.trim().match(/(.*)de\s(.*)\sOpiniones/);
        if (reviewCount) {
          addElementToDocument('reviewCount', reviewCount[2]);
        }
      } else if (document.querySelector('h4[itemprop="headline"]')) {
        reviewCount = document.querySelector('h4[itemprop="headline"]').textContent.trim().match(/\d+/);
        if (reviewCount) {
          addElementToDocument('reviewCount', reviewCount[0]);
        }
      }

      function textContent (selector, attributeName) {
        try {
          const text = (selector && selector.textContent.trim()
            .split(/[\n]/)
            .filter((element) => element)
            .join(' ')) ||
            '';
          addElementToDocument(attributeName, text);
        } catch (error) {
          console.log(error.message);
        }
      }

      textContent(document.querySelector('div.pdp-info-container div.info'), 'bulletDescription');
      textContent(document.querySelectorAll('div.pdp-info-container div.info')[1], 'ingredient');
    });
    await context.extract(productDetails);
  },
};
