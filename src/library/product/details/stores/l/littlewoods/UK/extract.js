const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'UK',
    store: 'littlewoods',
    transform: cleanUp,
    domain: 'littlewoods.com',
    zipcode: '',
  },

  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument (key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      // Method to Retrieve Xpath content of a Multiple Nodes
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
        // @ts-ignore
      const category=window.universal_variable.product.category
        // @ts-ignore
      const subcategory=window.universal_variable.product.subcategory
      const totalCategory=[]
      const totalSubCategory=[]
      totalCategory.push(category)
      totalSubCategory.push(subcategory)
      addElementToDocument('detail-category', totalCategory);
      addElementToDocument('detail-category', totalSubCategory);
      // Single Pipe Concatenation
      const pipeSeparatorSingle = (id, data) => {
        var singleSeparatorText = data.join(' | ');
        addElementToDocument(id, singleSeparatorText);
      };

      // Double Pipe Concatenation
      const pipeSeparatorDouble = (id, data) => {
        var doubleSeparatorText = data.join(' || ');
        addElementToDocument(id, doubleSeparatorText);
      };

      // Default value added for variant count field
      var variantCount = 0;
      addElementToDocument('addedVariantCount', variantCount);

      // XPATH Data Extraction For Additional Description Bullet
      const addDescBulletInfo = getAllXpath("//*[@id='productDescription']/table/tbody/tr[1]/td[2]/span/ul/li/text()",'nodeValue');
      pipeSeparatorDouble('addDescBulletInfo', addDescBulletInfo);

      // XPATH Data Extraction For Product Description/
      var addProductDescription = getAllXpath("//*[@id='productDescription']/table/tbody/tr[1]/td[2]/span/strong/following-sibling::br/following-sibling::text() | //*[@id='productDescription']/table/tbody/tr[1]/td[2]/span/p/strong/following-sibling::br/following-sibling::text()", 'nodeValue');
      if (addProductDescription !== null && addProductDescription.length > 0) {
        pipeSeparatorSingle('addProductDescription', addProductDescription);
      }
     
        // XPATH Data Extraction For Product Specification
        var specificationsList = getAllXpath("//*[@id='productSpecification']/table/tbody/tr/td/text()", 'nodeValue');
        if (specificationsList !== null && specificationsList.length > 0) {
          pipeSeparatorDouble('addedProductSpecification', specificationsList);
        }
    });
    await context.extract(productDetails);
  },
};