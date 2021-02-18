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
      const getAllXpath = (xpath, prop) => {
        const nodeSet = document.evaluate(
          xpath,
          document,
          null,
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null
        );
        const result = [];
        for (let index = 0; index < nodeSet.snapshotLength; index++) {
          const element = nodeSet.snapshotItem(index);
          if (element) result.push(prop ? element[prop] : element.nodeValue);
        }
        return result;
      };
      //custom code to concatenate
      var manufacturerDesc = getAllXpath("//div[@class='wc-rich-content-description']//text()","nodeValue");
      // custom code to get price with $
      // console.log('abc'+manufacturerDesc)
      let final_manufacturerDesc;
      for (let index = 0; index < manufacturerDesc.length; index++) {
        final_manufacturerDesc += manufacturerDesc[index]
      }
      console.log('Saipavan'+final_manufacturerDesc)
      addElementToDocument('final_manufacturerDesc', final_manufacturerDesc)
      try {
        const size = getXpath("//div[@class='lsection mobile-product-name h6']//text()", 'nodeValue');
        console.log('Raghav'+size);
        var nameArr = size.split(',');
        console.log('Sai'+nameArr);
        console.log('Rahul'+nameArr[nameArr.length - 1]);
        addElementToDocument('size', nameArr[nameArr.length - 1])
      //   const price = getXpath("//div[@class='display-price']//span[@itemprop='price']/text() | (//div[@class='display-price sale-price']/text())[1]", 'nodeValue');
      //   if (price.includes('$')) {
      //     addElementToDocument('price', price);
      //   }
      //   else {
      //     addElementToDocument('price', '$' + price);
      //   }
      } catch (error) {

      }
      // try {
      //   var stock = "In Stock"
      //   const availability = getXpath('//h2[@itemprop="availability"]/text()', 'nodeValue');
      //   if (availability.includes("In Stock")) {
      //     addElementToDocument('availability', stock);
      //     console.log(stock)
      //   }
      //   else {
      //     stock = "Out Of Stock"
      //     console.log(stock)
      //     addElementToDocument('availability', stock);
      //   }
      // } catch (error) {

      // }
      // try{
      // function addclass(xpathforpagination) {
      //     var elems = document.querySelectorAll(xpathforpagination);
      //     elems[0].classList.add('pagination');
      //   }
      // }
      // catch(e){

      // }
    });
    await context.extract(productDetails, { transform: transformParam });
  },
};
