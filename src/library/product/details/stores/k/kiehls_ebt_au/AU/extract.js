
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'kiehls_ebt_au',
    transform: null,
    domain: 'kiehls.com.au',
    zipcode: '',
  },
  // @ts-ignore
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

      //name
      var pn = getAllXpath('(//div/h1[@class="product_name"]/span[1])/text()', 'nodeValue');
      var pq = getAllXpath('//div[@class="hidden-mobile b-product_name"]/h2/text()', 'nodeValue');
      if (pn != null && pq != null) {
        var ab1 = pn + ' | ' + pq;
        // @ts-ignore
        var ab = ab1.trim().replaceAll('’', '');
        addElementToDocument('ab', ab);
      }

      //nameExtended
      var x = getAllXpath('(//div/h1[@class="product_name"]/span[1])/text()', 'nodeValue');
      var y = getAllXpath('(//li[@class="selected"]/a/@title)[1]', 'nodeValue');
      if (x != null && y != null) {
        var xy = x + ' | ' + y;
        addElementToDocument('xy', xy);
      }
      else
      {
        var xy = '';
        addElementToDocument('xy', xy);
      }

      //variants
      var var1 = getAllXpath('//div/ul/li/a/@data-variantid','nodeValue');
      var var2 = var1.join(' | ');
      addElementToDocument('var2', var2);

      //alternate image
      var img1 = getAllXpath('//div/ul[@class="carousel_navigation_items"]/li[position()>1 and position() <= last()]/span/img/@src','nodeValue');
      var img = img1.join(' | ');
      addElementToDocument('img',img);

      //quantity
      var qty = getAllXpath('//div[@id="product_content"]/div[1]/ul[2]/li[1]/div/ul/li/a/span/text()','nodeValue');
      var qty1 = getAllXpath('//div[@id="product_content"]/div[1]/ul[1]/li[1]/div/ul/li[1]/a/span/text()','nodeValue');
      if(qty!=null)
      {
        var qty2 = qty.toString();
        addElementToDocument('qty2',qty2);
      }
      else if(qty1!=null)
      {
        var qty2 = qty1.toString();
        addElementToDocument('qty2',qty2);
      }

      //IngredientList
      // @ts-ignore
      
      var ing = document.querySelectorAll('div[id="tab_ingredients"] div[id="ing-copy"]');
      var ing1 = []
      for(var i=0;i<ing.length;i++){
            // @ts-ignore
            ing1.push(ing[i].innerText);
      }
      try{
      // @ts-ignore
      var ing2 = document.querySelector('div[class*="js-ingredients-dialog"][id*="ui-id"]').innerText;
      ing1.push(ing2);
      }
      catch(error){}
      // @ts-ignore
      var ingre = ing1.join('').trim().replaceAll(/\n+/gm,'\n').replaceAll('•'||'●','||').replaceAll('\n',',').replace('Print', '').replaceAll('. ,',',');
      addElementToDocument('ingre',ingre);

      //Brand
      try {
        // @ts-ignore
        var brand = window.backendGtmEvents[0].ecommerce.detail.products[0].brand;
        addElementToDocument('brand',brand);
        } catch (error) {}
 

     
      var direction = document.querySelector('div[id="tab_tips"]').innerText;
      var specs = direction.trim().replaceAll(/\n+/gm, '').replaceAll('•' || '●', '||').replaceAll('\n', '').replaceAll('’', '').replace('Print', '').replaceAll('-', '');
      addElementToDocument('specs', specs);

    

    // Product Description
    const getDescription = (d) => {
    var desc = d.replaceAll(/\n+/gm, '\n').replaceAll('•' || '●', '||').replaceAll('\n', '|').replaceAll('|||', '||').replaceAll('’', '').replace('Print', '').replaceAll('-', '');
    addElementToDocument('descrip', desc);
  };
  // @ts-ignore
      var description = document.querySelector('div[id="tab_details"]').innerText;
      getDescription(description);

      // Method to Retrieve Xpath content of a Multiple Nodes
      var getXpath = (xpath, prop) => {
        var elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };

      var aval = getXpath('//div[contains(@class,"availability")]/p[2]/span/text()', 'nodeValue');
      if (aval != null) {
        if (aval.includes('Out of stock')) {
            aval = 'Out Of Stock';
            addElementToDocument('aval', aval);
          } else if (aval.includes('In Stock')) 
          {
            aval = 'In Stock';
            addElementToDocument('aval', aval);
          }
      }
    });
    await context.extract(productDetails);
  },
};