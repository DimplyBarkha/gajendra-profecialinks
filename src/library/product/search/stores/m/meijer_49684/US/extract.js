const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'meijer_49684',
    transform: transform,
    domain: 'meijer.com',
    zipcode: '',
  },
  implementation,
};
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async function () {
    // await new Promise(r => setTimeout(r, 5000));
    // console.log("waiting for first link")
    // try{
    //   // @ts-ignore
    //   document.querySelector('span[class="glyphicon glyphicon-edit js-change-store-link"]').click()
    //   await new Promise(r => setTimeout(r, 4000));
    // console.log("waiting for open store input box")
    //   // @ts-ignore
    //   document.querySelector('a[class="StoreFlyout__changeStore"]').click()
    //   await new Promise(r => setTimeout(r, 4000));
    // console.log("waiting for send store id to input link")
    //   var att = document.createAttribute('value')
    //   att.value = "49684"
    //   document.querySelector('input[id="store-flyout-address"]').setAttributeNode(att)
    //   // @ts-ignore
    //   document.querySelector('button[class="StoreFlyout__search-button btn btn-primary"]').click()
    //   await new Promise(r => setTimeout(r, 5000));
    // console.log("waiting for search link")
    //   // @ts-ignore
    //   document.querySelector('button[class="StoreFlyout__myStore btn btn-primary StoreFlyout__selectOptions"]').click()
    //  // await new Promise(r => setTimeout(r, 5000));
    // console.log("waiting for submit link")
    //   }
    //   catch(e)
    //   {
  
    //   }
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.id = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
      }
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div.product-item > div.tile-row.details-container > div.tile-column.details > a')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      try {
        console.log("creating prices")
        var len = document.querySelectorAll('div.product-item > div.tile-row.details-container > div.tile-column.details > a').length
        var a = document.querySelectorAll('div[class="for-tile"] span[itemprop="price"],div[class="for-tile"] div[class="display-price sale-price"]')
        for (let i = 0; i < len; i++) {
          // @ts-ignore
          var price = a[i].innerText.split(" ")
          if (price[0].charAt(0) == "$") {
            addHiddenDiv('price', price[0], i)
            console.log(i,"price=",price[0])
          }
          else {
            var r = price[0].slice(0, 0) + "$" + price[0].slice(0);
            addHiddenDiv('price', r, i)
            console.log(i," price= ",price[0])
          }
        }
      }
      catch (e) {
  
      }
      // Method to Retrieve Xpath content of a Single Node
    //   try{
    //   function addclass(xpathforpagination) {
    //     var elems = document.querySelectorAll(xpathforpagination);
    //     elems[0].classList.add('pagination');
    //   }
    // }
    //   catch(e){}
      const URL = window.location.href;
      try {
        document.getElementById('pd_url').remove();
      } catch (error) {
      }
      addElementToDocument('pd_url', URL);
  });
  //await context.waitForSelector('div[class="tile-column quickview-mouseover-container"] a[class="thumb"] img');
  return await context.extract(productDetails, { transform });
}