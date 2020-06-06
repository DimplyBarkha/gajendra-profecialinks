
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
        const xpath = `//script[contains(.,'${scriptSelector}')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // @ts-ignore
        const scriptContent = element.innerText;
        const startIdx = scriptContent.indexOf(startString);
        const endIdx = scriptContent.indexOf(endString);
        let jsonStr = scriptContent.substring(startIdx + startString.length, endIdx);
        jsonStr = jsonStr.trim();
        return JSON.parse(jsonStr);
      }

      function findJsonObj (scriptSelector) {
        const xpath = `//script[contains(.,'${scriptSelector}')]`;
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // @ts-ignore
        let jsonStr = element.innerText;
        jsonStr = jsonStr.trim();
        return JSON.parse(jsonStr);
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
        if (dataObj[0].product.status.toLowerCase() === "available") {
          addElementToDocument('availability', "In Stock");
        } else {
          addElementToDocument('availability', "Out Of Stock");
        }
        addElementToDocument('brand', dataObj[0].product.brand);
        if (dataObj[0].product.id) {
          if (dataObj[0].product.id.match(/[0-9](.*)___/)) {
            let retailer_product_code = dataObj[0].product.id.match(/[0-9](.*)___/)[1];
            addElementToDocument('retailer_product_code', retailer_product_code);
          }
        }

      }

      function ingredientContent (ingredientName) {
        const content = document.querySelectorAll('div.pdp-info-container div.info');
        if (content.length > 1) {
          if (content[1].textContent.includes(ingredientName)) {
            if (ingredientName.toLowerCase() === 'calcio') {
              const calcium = content[1].textContent.replace(/(.+Calcio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$2');
              addElementToDocument('calcium', calcium);
              const calciumUnit = content[1].textContent.replace(/(.+Calcio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$3');
              addElementToDocument('calciumUnit', calciumUnit);
            } else if (ingredientName.toLowerCase() === 'magnesio') {
              const magnesium = content[1].textContent.replace(/(.+Magnesio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$2');
              addElementToDocument('magnesium', magnesium);
              const magnesiumUnit = content[1].textContent.replace(/(.+Magnesio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$3');
              addElementToDocument('magnesiumUnit', magnesiumUnit);
            } else if (ingredientName.toLowerCase() === 'sodio') {
              const sodium = content[1].textContent.replace(/(.+Sodio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$2');
              addElementToDocument('sodium', sodium);
              const sodiumUnit = content[1].textContent.replace(/(.+Sodio)\s\(([0-9.]+)\s(\w+\/\w+)(.+)/g, '$3');
              addElementToDocument('sodiumUnit', sodiumUnit);
            }
          }
        }
      }
      ingredientContent('Calcio');
      ingredientContent('Magnesio');
      ingredientContent('Sodio');

      let reviewsCount = document.querySelector('div.bv-content-pagination-pages-current');
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
        const text = (selector && selector.textContent.trim()
          .split(/[\n]/)
          .filter((element) => element)
          .join(' ')) ||
          '';
        addElementToDocument(attributeName, text);
      }

      textContent(document.querySelector('div.pdp-info-container div.info'), 'bulletDescription');
      textContent(document.querySelectorAll('div.pdp-info-container div.info')[1], 'ingredient');

      // @ts-ignore
      const breadcrumb = [...document.querySelectorAll("li.breadcrumbs-item")]
      if (breadcrumb) {
        const subCategory = breadcrumb.map(i => i.innerText).join('>');
        addElementToDocument('sub_category', subCategory);
      }
    });
    await context.extract(productDetails);
  },
};
