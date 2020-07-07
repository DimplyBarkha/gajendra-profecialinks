// const { transform } = require('../../../../shared');
const { transform } = require('../../../../shared');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  console.log("Do pagination");
  let resultCounter = 0;
  await new Promise(r => setTimeout(r, 8000));

  async function getNumberResultsOnPage() {
      return await context.evaluate(function() {
          let resultXPath = "(//div[@class='css-1dbjc4n r-13awgt0 r-1mlwlqe r-iyfy8q'])[1]//div[@class='css-1dbjc4n']//div[contains(@class,'r-1pi2tsx')]//a"; // list of items on the page from Shaun
          let query = document.evaluate(resultXPath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
          let numberPageResults = query.snapshotLength;
          console.log(numberPageResults + "results on page")
          return numberPageResults;
      });
  }

  
  async function buttonCheck() {
       return await context.evaluate(function() {
          let button = document.querySelector('div.css-1dbjc4n.r-1awozwy.r-14lw9ot.r-rs99b7')
          if(button != null) {
              return true;
          } else {
              return false;
          }
      });
  }




  async function addToDom() {

    return await context.evaluate(function () {
      function addHiddenDiv (id, content, doc) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        if(doc){
          // debugger
          doc.appendChild(newDiv)
        } else {
          document.body.appendChild(newDiv);
        }
      }

      function addSku () {
        let textNode = document.evaluate('//script[contains(.,"initialState")]', document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null)
        let text = textNode.iterateNext().textContent;
        let textcontent = text.match(/var productIndexData = {.*}}/g)[0].replace('var productIndexData = ','').trimEnd();
        let parsed = JSON.parse(textcontent);
        let products = document.querySelectorAll('div.css-1dbjc4n.r-18u37iz.r-tzz3ar div.css-1dbjc4n.r-1pi2tsx a')
        let i = 0;
        let skus = [];
        debugger
        while(i < parsed.products.length){
          let prodSku = parsed.products[i].defaultSku
          skus.push(prodSku)
          addHiddenDiv(`ii_sku`, prodSku, products[i]);
          i++;
        }
        console.log(skus)
      }

      // addHiddenDiv(`ii_url`, window.location.href);
      // addSku();
    });
}

  async function continuedClickToShowResults() {

    let moreButton = 'div.css-1dbjc4n.r-1awozwy.r-14lw9ot.r-rs99b7';
    let numberPageResults = 0;
    let count = 0;
    while (numberPageResults <= 150 && count < 200) {
      
        if(await buttonCheck()) {
            await context.click(moreButton);
            await new Promise(r => setTimeout(r, 10000));
            numberPageResults = await getNumberResultsOnPage();
            console.log(numberPageResults + " items on page");
            // return await context.extract(productDetails, { transform });
            // await addToDom();
            count++
        } else {
            break;
        }
    }
  }

  await continuedClickToShowResults();
  await addToDom()

  return await context.extract(productDetails, { transform });
}



module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'US',
    store: 'cvs',
    transform: transform,
    domain: 'cvs.com',
  },
  implementation
};