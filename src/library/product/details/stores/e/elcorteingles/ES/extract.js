
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'ES',
    store: 'elcorteingles',
    transform: null,
    domain: 'elcorteingles.es',
  },

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      // function to append the elements to DOM
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }

      // function to get the json data from the string
      function findJsonData (scriptSelector, startString, endString) {
        try {
          const xpath = `//script[contains(.,'${scriptSelector}')]`;
          const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          const scriptContent = element.textContent;
          const startIdx = scriptContent.indexOf(startString);
          const endIdx = scriptContent.indexOf(endString);
          let jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
          jsonStr = jsonStr.trim();
          return JSON.parse(jsonStr);
        } catch (error) {
          console.log(error.message);
        }
      }

      // function to get the json data from the textContent
      function findJsonObj (scriptSelector) {
        try {
          const xpath = `//script[contains(.,'${scriptSelector}')]`;
          const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
          let jsonStr = element.textContent;
          jsonStr = jsonStr.trim();
          return JSON.parse(jsonStr);
        } catch (error) {
          console.log(error.message);
        }
      }

      const imageData = findJsonObj('ImageObject');
      // Check for the data and append to DOM
      if (imageData) {
        addElementToDocument('product_image', `https:${imageData.contentUrl}`);
        addElementToDocument('product_description', imageData.description);
      }

      // elements from data Layer object
      const dataObj = findJsonData('dataLayer', '=', ';');
      // Check for the data and append to DOM
      if (dataObj) {
        if (dataObj[0].product) {
          if (dataObj[0].product.status.toLowerCase() === 'available') {
            addElementToDocument('availability', 'In Stock');
          } else {
            addElementToDocument('availability', 'Out Of Stock');
          }
          // Check for the brand  and append to DOM
          if (dataObj[0].product.brand) {
            addElementToDocument('brand', dataObj[0].product.brand);
          }
          // Check for the product id  and append to DOM
          if (dataObj[0].product.id) {
            if (dataObj[0].product.id.match(/[0-9](.*)___/)) {
              const retailerProductCode = dataObj[0].product.id.match(/[0-9](.*)___/)[1];
              addElementToDocument('retailer_product_code', retailerProductCode);
            }
          }
          // Check for the quantity  and append to DOM
          if (dataObj[0].product.quantity) {
            addElementToDocument('quantity', dataObj[0].product.quantity);
          }
        }
      }

      // function to get the sodium, magnesium, calcium values
      function ingredientContent (ingredientName, text) {
        const content = document.querySelectorAll('div.pdp-info-container div.info');
        // Check for length
        if (content && content.length > 1) {
          // Check for ingredientName
          if (ingredientName) {
            // Check for the content has text or not
            if (content[1].textContent) {
              if (content[1].textContent.includes(ingredientName)) {
                let calcium;
                // Check for calcium
                if (ingredientName.toLowerCase() === 'calcio') {
                  // Check for the calcium with given text if it is present get the value and add it to DOM
                  if (content[1].textContent.includes(text)) {
                    calcium = content[1].textContent.replace(/(.+Calcio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$2');
                    addElementToDocument('calcium', calcium);
                    // If calcium has data get the unit
                    if (calcium) {
                      const calciumUnit = content[1].textContent.replace(/(.+Calcio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$3');
                      addElementToDocument('calciumUnit', calciumUnit);
                    }
                    // if calcium didn't match with given text then get the calcium value and append to DOM
                  } else {
                    calcium = content[1].textContent.replace(/(.+Calcio)\s(\d+,\d+)\s(.*)/g, '$2');
                    addElementToDocument('calcium', calcium);
                  }
                  // Check for sodium
                } else if (ingredientName.toLowerCase() === 'sodio') {
                  // Check for the sodium with given text if it is present get the value and add it to DOM
                  let sodium;
                  if (content[1].textContent.includes(text)) {
                    sodium = content[1].textContent.replace(/(.+Sodio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$2');
                    addElementToDocument('sodium', sodium);
                    // If sodium has data get the unit
                    if (sodium) {
                      const sodiumUnit = content[1].textContent.replace(/(.+Sodio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$3');
                      addElementToDocument('sodiumUnit', sodiumUnit);
                    }
                    // if sodium didn't match with given text then get the sodium value and append to DOM
                  } else {
                    sodium = content[1].textContent.replace(/(.+Sodio)\s(\d+,\d+)[.\s](.*)/g, '$2');
                    addElementToDocument('sodium', sodium);
                  }
                  // Check for magnesium
                } else if (ingredientName.toLowerCase() === 'magnesio') {
                  let magnesium;
                  // Check for the magnesium with given text if it is present get the value and add it to DOM
                  if (content[1].textContent.includes(text)) {
                    magnesium = content[1].textContent.replace(/(.+Magnesio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$2');
                    addElementToDocument('magnesium', magnesium);
                    // If magnesium has data get the unit
                    if (magnesium) {
                      const magnesiumUnit = content[1].textContent.replace(/(.+Magnesio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$3');
                      addElementToDocument('magnesiumUnit', magnesiumUnit);
                    }
                    // if magnesium didn't match with given text then get the magnesium value and append to DOM
                  } else {
                    magnesium = content[1].textContent.replace(/(.+Magnesio)\s(\d+,\d+)\s(.*)/g, '$2');
                    addElementToDocument('magnesium', magnesium);
                  }
                }
              }
            }
          }
        }
      }
      ingredientContent('Calcio', 'Calcio (');
      ingredientContent('Magnesio', 'Magnesio (');
      ingredientContent('Sodio', 'Sodio (');

      // Get the ratingCount
      const reviewsCount = document.querySelector('div.bv-content-pagination-pages-current');
      let ratingCount;
      if (reviewsCount) {
        ratingCount = reviewsCount.textContent.trim().match(/[^\s]+(?=\sOpiniones)/);
        if (ratingCount) {
          addElementToDocument('ratingCount', ratingCount[2]);
        }
      } else if (document.querySelector('h4[itemprop="headline"]')) {
        ratingCount = document.querySelector('h4[itemprop="headline"]').textContent.trim().match(/\d+/);
        if (ratingCount) {
          addElementToDocument('ratingCount', ratingCount[0]);
        }
      }

      // Function to remove the `\n` from the textContent
      function textContent (element, attributeName) {
        const text = (element && element.textContent.trim()
          .split(/[\n]/)
          .filter((ele) => ele)
          .join(' ')) ||
          '';
        addElementToDocument(attributeName, text);
      }

      textContent(document.querySelector('div.pdp-info-container div.info'), 'bulletDescription');
      textContent(document.querySelectorAll('div.pdp-info-container div.info')[1], 'ingredient');
    });
    await context.extract(productDetails);
  },
};
