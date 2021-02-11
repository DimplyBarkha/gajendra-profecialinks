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
    await new Promise(r => setTimeout(r, 5000));
    console.log("waiting for first link")
    try{
      // @ts-ignore
      document.querySelector('span[class="glyphicon glyphicon-edit js-change-store-link"]').click()
      await new Promise(r => setTimeout(r, 4000));
    console.log("waiting for open store input box")
      // @ts-ignore
      document.querySelector('a[class="StoreFlyout__changeStore"]').click()
      await new Promise(r => setTimeout(r, 4000));
    console.log("waiting for send store id to input link")
      var att = document.createAttribute('value')
      att.value = "49684"
      document.querySelector('input[id="store-flyout-address"]').setAttributeNode(att)
      // @ts-ignore
      document.querySelector('button[class="StoreFlyout__search-button btn btn-primary"]').click()
      await new Promise(r => setTimeout(r, 5000));
    console.log("waiting for search link")
      // @ts-ignore
      document.querySelector('button[class="StoreFlyout__myStore btn btn-primary StoreFlyout__selectOptions"]').click()
     // await new Promise(r => setTimeout(r, 5000));
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
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class="tile-row details-container"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      const URL = window.location.href;
      try {
        document.getElementById('pd_url').remove();
      } catch (error) {
      }
      addElementToDocument('pd_url', URL);
  });
  //await context.waitForSelector('div[class="tile-column quickview-mouseover-container"] a[class="thumb"] img');
  await context.evaluate(async function () {
    function addclass(xpathforpagination) {
      var elems = document.querySelectorAll(xpathforpagination);
      elems[0].classList.add('pagination');
    }
  });
  return await context.extract(productDetails, { transform });
}