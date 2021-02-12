const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'meijer_49684',
    transform: cleanUp,
    domain: 'meijer.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {
      try{
        // @ts-ignore
        document.querySelector('span[class="glyphicon glyphicon-edit js-change-store-link"]').click()
        await new Promise(r => setTimeout(r, 4000));
        console.log("waiting for open store input box")
        // @ts-ignore
        document.querySelector('a[class="StoreFlyout__changeStore"]').click()
        await new Promise(r => setTimeout(r, 4000));
        console.log("waiting for send store id to input link")
        var att = document.createAttribute('value')
        att.value = "49684"
        document.querySelector('input[id="store-flyout-address"]').setAttributeNode(att)
        // @ts-ignore
        document.querySelector('button[class="StoreFlyout__search-button btn btn-primary"]').click()
        await new Promise(r => setTimeout(r, 5000));
        console.log("waiting for search link")
        // @ts-ignore
        document.querySelector('button[class="StoreFlyout__myStore btn btn-primary StoreFlyout__selectOptions"]').click()
        // await new Promise(r => setTimeout(r, 5000));
        console.log("waiting for submit link")
        }
        catch(e)
        {
        
        }
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      const getXpath = (xpath, prop) => {
        const elem = document.evaluate(xpath, document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null);
        let result;
        if (prop && elem && elem.singleNodeValue) result = elem.singleNodeValue[prop];
        else result = elem ? elem.singleNodeValue : '';
        return result && result.trim ? result.trim() : result;
      };
      try {
        const size = getXpath("//div[@class='lsection mobile-product-name h6']//text()", 'nodeValue');
        var nameArr = size.split(',');
        addElementToDocument('size', nameArr[nameArr.length - 1])
        const price = getXpath("//div[@class='display-price']//span[@itemprop='price']/text() | (//div[@class='display-price sale-price']/text())[1]", 'nodeValue');
        if (price.includes('$')) {
          addElementToDocument('price', price);
        }
        else {
          addElementToDocument('price', '$' + price);
        }
      } catch (error) {

      }
      try {
        var stock = "In Stock"
        const availability = getXpath('//div[@class="rsection stock-container"]//img/@alt//text()', 'nodeValue');
        if (availability == "Success") {
          addElementToDocument('stock', stock);
          console.log(stock)
        }
        // else {
        //   stock = "Out Of Stock"
        //   console.log(stock)
        //   addElementToDocument('availability', stock);
        // }
      } catch (error) {

      }
      function addclass(xpathforpagination) {
          var elems = document.querySelectorAll(xpathforpagination);
          elems[0].classList.add('pagination');
        }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
