<<<<<<< HEAD
const { transform } = require('../../../../shared');
async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  await context.evaluate(async () => {
    while (!!document.querySelector('#ahl-product-list-app > div > div >button')) {
      document.querySelector('#ahl-product-list-app > div > div >button').click()
      await new Promise(r => setTimeout(r, 6000));
      function addElementToDocument(key, value) {
        const catElement = document.createElement('div');
        catElement.className = key;
        catElement.textContent = value;
        catElement.style.display = 'none';
        document.body.appendChild(catElement);
=======
const { cleanUp } = require('../../../../shared');
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    transform: cleanUp,
    domain: 'ahlens.se',
    zipcode: '',
  },
  implementation: async (inputs,
    parameters,
    context,
    dependencies,
  ) => {
    const { transform } = parameters;
    const { productDetails } = dependencies;
    await context.evaluate(async () => {
      while (!!document.querySelector('#ahl-product-list-app > div > div >button')) {
        document.querySelector('#ahl-product-list-app > div > div >button').click()
        await new Promise(r => setTimeout(r, 6000));
        function addElementToDocument(key, value) {
          const catElement = document.createElement('div');
          catElement.className = key;
          catElement.textContent = value;
          catElement.style.display = 'none';
          document.body.appendChild(catElement);
        }
      }
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('span[class="MuiCardActionArea-focusHighlight"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
      }
      function addHiddenDivPrice(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('span[class="MuiCardActionArea-focusHighlight"]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
>>>>>>> 45006a3c656b6d0f28162ff4c6c43c3ba89382b6
      }
      function addHiddenDiv(id, content, index) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        const originalDiv = document.querySelectorAll('div[class*=MuiCardContent-root]')[index];
        originalDiv.parentNode.insertBefore(newDiv, originalDiv);
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
<<<<<<< HEAD
      const sliceURL = (data) => {
        for (let index = 0; index < data.length; index++) {
          var temp;
          if (data[index].includes(",")) {
            temp = data[index].replace(",", ".");
          } else {
            temp = data[index];
          }
          addHiddenDiv('zz', temp, index);
        }
      };
      var backgroundURL = getAllXpath("//*[contains(@class,'MuiCardContent-root')]/div/div/span[1]/text()", 'nodeValue');
      sliceURL(backgroundURL);      
    }
  })
  return await context.extract(productDetails, { transform });
}
module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'SE',
    store: 'ahlens',
    transform: transform,
    domain: 'ahlens.se',
    zipcode: '',
=======

      let rankOrganic;
      let url = window.location.href;
      let checkPageNumber = url.split('&')[1];
      try {
        if (checkPageNumber.startsWith('p=')) {
          rankOrganic = checkPageNumber.replace('p=', '');
        }
      }
      catch (err) {
      }
      var dup = Number(rankOrganic);
      dup = dup - 1;

      if (!rankOrganic) {
        rankOrganic = 1;
      } else {
        rankOrganic = (dup * 60) + 1;
      }
      const urlProduct = document.querySelectorAll('span[class="MuiCardActionArea-focusHighlight"]');
      for (let i = 0; i < urlProduct.length; i++) {
        addHiddenDiv('rankOrganic', rankOrganic++, i);
      }
      // const sliceURL1 = (data) => {
      //   for (let index = 0; index < data.length; index++) {
      //     if (data[index].includes(":")) {
      //       var temp = data[index].replace(":", ".");
      //     } else {
      //       temp = data[index].replace(" ", "");
      //     }
      //     addElementToDocument('altImage2', temp);
      //   }
      // };
      // var backgroundURL1 = getAllXpath("//*[contains(@class,'MuiCardContent-root')]//div/div//span[1]/text()", 'nodeValue');
      // sliceURL1(backgroundURL1);
      var rating = getAllXpath("//*[contains(@class,'MuiCardContent-root')]//div/div//span[1]/text()");
      for (let index = 0; index < rating.length; index++) {        
        if (rating[index].includes(":")) {
          var temp = rating[index].replace(":", ".");
        } else {
          temp = rating[index].replace(":-", ".");
        }           
        addHiddenDivPrice('altImage2', temp+"SEK", index);
      }

    });
    return await context.extract(productDetails, { transform });
>>>>>>> 45006a3c656b6d0f28162ff4c6c43c3ba89382b6
  },
}
