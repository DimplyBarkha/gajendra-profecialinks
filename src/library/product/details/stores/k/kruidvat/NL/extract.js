module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'NL',
    store: 'kruidvat',
    transform: null,
    domain: 'kruidvat.nl',
    zipcode: '',
  },
  implementation: async ({ inputstring }, { country, domain }, context, { productDetails }) => {
    try {
      // @ts-ignore
      document.querySelector('#onetrust-accept-btn-handler').click()
      await new Promise((resolve) => setTimeout(resolve, 5000));
      console.log('----------------------------------cookies')
      // }
    }
    catch (error) {

    }
    await context.evaluate(async function () {
      let scrollTop = 0;
      while (scrollTop !== 2000) {
        await stall(500);
        scrollTop += 500;
        window.scroll(0, scrollTop);
        if (scrollTop === 1000) {
          await stall(500);
          break;
        }
      }
      function stall(ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

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
      var image = getAllXpath('//div[@class="product-thumbnails__preview"]/img[position()>1]/@src', 'nodeValue');
      console.log(image,'image-------------------')
      var productperpage = getAllXpath('//div[@class="select__options-container"]//ul/li//text()','nodeValue');
      console.log(productperpage,'productperpage-------------------')
      var totalproduct=0
      if (productperpage != null && productperpage.length != 0){
        totalproduct=(productperpage.length)+1
      }
      else{
        totalproduct=0
      }      
      var xyz = []
      var v1=''
      for (var i = 0; i < image.length; i++) {
        if(image[i].length > 1){
          v1="https://www.kruidvat.nl"+image[i]
          xyz.push(v1);
          } 
        }
       var v =  xyz.join(" | ");
      addElementToDocument('xyz', v);
      var bullet = getAllXpath('//div[@class="product-information__wrapper"]/p//text()', 'nodeValue');
      var count = 0
      for (var i = 0; i < bullet.length; i++) {
        if (bullet[i].includes('•')) {
          var z = bullet[i].toString()
          count = count + 1
        }
      }
      addElementToDocument('total', totalproduct);
      console.log(count, '-------------------count')
      addElementToDocument('count', count);
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      // var elmnt = document.getElementById("myAnchor");
      // var attr = elmnt.getAttributeNode("target").value;
      // var ing=''
      // var ing1=''
      // var ingrediant = getXpath("//*[contains(text(),'Ingredientendeclaratie')]/following::p[1]//text()",'node');
      // if (ingrediant != null){
      //     ing = ingrediant.replace('ingredienten:','')
      //     ing1=ing.replace('Ingrediënten:','')

      // }
      // addElementToDocument('ing1', ing1);
      var backgroundURL = getXpath('//span[@itemprop="availability"]').innerText;
      var price = getXpath('//span[@itemprop="price"]').innerText;
      var upc1 = ''
      var upc = ''
      var price1 = ''
      upc1 = getXpath('(//p[@class="product-information__text product-information__ean"])').innerText;
      console.log(backgroundURL, 'backgroundurl-----------')
      if (backgroundURL.includes('InStock')) {
        var availabilty = "In Stock"
      }
      else if (backgroundURL.includes('Limi')) {
        var availabilty = "In Stock"
      }
      else {
        var availabilty = "Out of Stock"
      }
      if (upc1.length > 0) {
        upc = upc1.replace('EAN code:', '')
      }
      else {
        upc = ''
      }
      if (price.length > 0) {
        price1 = price
      }
      else {
        price1 = ''
      }
      console.log(price, '-----------------------PRICE')
      addElementToDocument('price', price1);
      addElementToDocument('availabilty', availabilty);
      addElementToDocument('upc', upc);



    });






    await context.extract(productDetails);

  },

};