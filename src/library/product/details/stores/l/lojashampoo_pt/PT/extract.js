module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'PT',
    store: 'lojashampoo_pt',
    transform: null,
    domain: 'lojashampoo.pt',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain }, context, { productDetails }) => {
    await context.evaluate(async function () {
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };

      // Method to Retrieve Xpath content of a Multiple Nodes

      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      // Page Not Found
      if (getXpath('//img[@id="imagerror"]/@id', 'nodeValue') != null) {
        return;
      }

      // Alternate images
      var altImages = getAllXpath('(//div[contains(@id,"image-additional-carousel")]/div/a/img)[position()>1]/@src', 'nodeValue');
      if (altImages.length >= 1) {
        addElementToDocument('altImages', altImages.join(' | '));
      }

      // Variants
      var variants = getAllXpath('//div[contains(@id,"option_")]/@id', 'nodeValue');
      if (variants.length >= 1) {
        // @ts-ignore
        for (var i = 0; i < variants.length; i++) {
          variants[i] = variants[i].match(/\d+/gm);
        }
        addElementToDocument('variants', variants.join(' | '));
      } else {
        addElementToDocument('variants', getXpath('(//b[contains(text(),"EAN")]/following-sibling::span)//text()', 'nodeValue'));
      }
      const getDescription = (d) => {
        var desc = d.replaceAll(/\n+/gm, '\n').replaceAll('•' || '●', '||').replaceAll('’', '').replaceAll('-', '').replace('Descrição', '');
        addElementToDocument('descrip', desc);
      };
      // Description
      try {
        var description = document.querySelector('div[id="tab-description"]');
        if (description != null) {
          getDescription(description.innerText);
        }
      } catch (error) { }

      // Ingredients
      try {
        var ing = document.querySelector('div[id="tab-description"]');
        if (ing != null) {
          var desc = ing.innerText;
          addElementToDocument('ingredients', desc.split('Ingredientes')[1]);
        }
      } catch (error) { }

      // Brand Text
      var brand = getXpath('//div[@class="description"]/p/a/text()', 'nodeValue');
      if (brand != null) {
        addElementToDocument('brandText', brand.replace("'", ''));
      }

      // Product Video
      var pctVideo = getXpath('//div[@class="flexible-container"]/iframe/@src', 'nodeValue');
      if (pctVideo != null) {
        addElementToDocument('prdVideo', 'https:'.concat(pctVideo));
      } else {
        addElementToDocument('prdVideo', getXpath('//*[@id="footer"]//a[3]/@href', 'nodeValue'));
      }

      // Directions
      var desc = document.querySelector('div[id="tab-description"]');
      if (description != null) {
        var desc1 = desc.innerText;
        addElementToDocument('directions', (desc1.split('Ingredientes')[0]).split(desc1.match(/(Como.+)/gm))[1]);
      }

      // Price
      var price = getXpath('(//span[@class="price-new"])[1]/text()', 'nodeValue');
      if (price != null) {
        addElementToDocument('oprice', price.replace('.', ','));
      }
      //Rating Count
      try{
       document.querySelector('div[id="tabs"] li.last a').click()
       var ratingCount = getXpath('//*[@id="netreviews_rating_section"]//p[@class="netreviews_subtitle"]//text()', 'nodeValue');
      if (ratingCount != null) {  
        addElementToDocument('ratingC', ratingCount.match(/(\d+)/gm).join());
      }
      }catch(error){}
    });
    await context.extract(productDetails);
  },
};