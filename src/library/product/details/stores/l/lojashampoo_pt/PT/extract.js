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
        addElementToDocument('nopageurl', window.document.URL);
        return;
      } else {
        addElementToDocument('pgurl', getXpath('//div[@id="breadcrumb"]/ol/li[@class="last"]/a/@href', 'nodeValue'));
      }

      // remove apostrophe
      const removeApostrphy = (x) => {
        return x.replace("'", '');
      };

      //name and extended name  
      var name = getXpath('//h1[@class="title-product"]/text()', 'nodeValue');
      if (name != null) {
        addElementToDocument('name', removeApostrphy(name));
      }

      // Image ALT text
      var imgAlt = getXpath('//div/a/img[@itemprop="image"]/@alt', 'nodeValue');
      if (imgAlt != null) {
        addElementToDocument('imgAlt', removeApostrphy(imgAlt));
      }

      // Category
      var category = getAllXpath('((//div[@id="breadcrumb"]/ol/li)[position()>1])//text()', 'nodeValue');
      if (category.length >= 1) {
        for (var i = 0; i < category.length; i++) {
          addElementToDocument('category', removeApostrphy(category[i]));
        }
        // addElementToDocument('category', removeApostrphy(category));
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
        // var desc = d.replaceAll(/\n+/gm, '\n').replaceAll('•' || '●', '||').replaceAll('’', '').replaceAll('-', '').replace('Descrição', '');
        // addElementToDocument('descrip', d);
      };
      // Description
      try {
        var description = document.querySelector('div[id="tab-description"]');
        if (description != null) {
          description = description.innerText;
          addElementToDocument('descrip', (description.split('Ingredientes')[0]).split(description.match(/(Como.+)/gm))[0].split('Descrição')[1]);
        }
      } catch (error) { }

      // Availability
      var availability = getXpath('//button[@id="button-cart"]/span[contains(text(),"COMPRA JÁ")]/text()', 'nodeValue');
      if (availability != null) {
        addElementToDocument('availability', 'In Stock');
      }
      // quantitty 
      var quantity = getXpath('//h1[@class="title-product"]/text()', 'nodeValue');
      if (quantity != null) {
        addElementToDocument('quantity', quantity.match(/((\d+\.)?\d+\s?(ml|g|gr|Cápsulas)$)/gm));
      }

      // packsize
      var packSize = getXpath('//h1[@class="title-product"]/text()', 'nodeValue');
      if (packSize != null && packSize.match(/((\d+)x(\d+\.)?\d+\s?(ml|g|gr|Cápsulas))$/m) != null) {
        addElementToDocument('packsize', packSize.match(/((\d+)x(\d+\.)?\d+\s?(ml|g|gr|Cápsulas))$/m)[2]);
      }


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
      try {
        var sku = getXpath('(//div[@class="NETREVIEWS_PRODUCT_STARS"]/@data-product-id)[1]', 'nodeValue');
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'https://cl.avis-verifies.com/pt/cache/a/e/a/aea5d810-72dc-eaa4-5d4d-d752dc9b21fe/AWS/PRODUCT_API/REVIEWS/' + sku + ".json");
        xhr.responseType = 'json';
        xhr.send();
        xhr.onload = function () {
          let responseObj = xhr.response;
          for (var i = 0; i < responseObj.length; i++) {

          }
          addElementToDocument('ratings', responseObj.length);
          console.log(responseObj);
        };
      } catch (error) { }

    });
    await context.extract(productDetails);
  },
};