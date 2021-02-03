const { transform } = require('../format');

async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  try{
    await new Promise(resolve => setTimeout(resolve, 8000));
    await context.evaluate(async function () {
      
      
      function addHiddenDiv (id, content) {
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }
      
      // Function to fetch aggregateRating from script tag as not available on DOM.
      async function fetchRatingFromScript () {
        const scriptDataTagSelector = document.evaluate('//script[contains(text(), "RealTimeTracking")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        // @ts-ignore
        const scriptTagData     = scriptDataTagSelector ? scriptDataTagSelector.innerText : '';
        const scriptTagJSONText = scriptTagData ? scriptTagData.replace(/.*tracking\.params=(.*);\$.track.send.*/gm, '$1') : '';
        let scriptTagJSON;
        try {
          scriptTagJSON = scriptTagJSONText ? JSON.parse(scriptTagJSONText) : '';
        } catch (e) {
          console.log('Product Data JSON cannot be parsed...');
        }
        const productsListArray = scriptTagJSON && scriptTagJSON.products ? scriptTagJSON.products : [];
        const ratingArray = [];
        for (let i = 0; i < productsListArray.length; i++) {
          const productObj = productsListArray[i];
          const rating = productObj.rate;
          ratingArray.push(rating);
        }
        return ratingArray;
      }
  
      // Function to add fetched rating to DOM
      async function addRatingToProductBlock () {
        const fetchedRating = await fetchRatingFromScript();
        const productBlockSelector = document.querySelectorAll('ul[id="lpBloc"] li[data-sku]');
        if (fetchedRating.length) {
          for (let i = 0; i < productBlockSelector.length; i++) {
            const productBlock = productBlockSelector[i];
            // @ts-ignore
            let sponsoredElem = productBlock.querySelector('div.prdtBILSponsored');
            productBlock.setAttribute('data-rating', fetchedRating[i]);
  
            // Adding rating to each product block
            const newDiv = document.createElement('div');
            newDiv.classList.add('added_aggregate_rating');
  
            //if block found sponsered element then added class sponsored-product
            if(sponsoredElem){
              productBlock.classList.add('sponsored-product');
            }
  
            newDiv.textContent = "'"+Math.round(fetchedRating[i])+"'";
            newDiv.style.display = 'none';
            
            if(productBlock != null){
              productBlock.appendChild(newDiv);
  
              //if productBlock havent data sku attr then remove block 
              let dataSku = productBlock.getAttribute('data-sku');
              if(dataSku == 'undefined'){
                productBlock.remove();
              }
            }
          }
        }
      }

      // Adding search url to DOM
      const searchURL = window.location.href;
      let added_search_url = document.getElementById('added_search_url');
      if(added_search_url == null){
        addHiddenDiv('added_search_url', searchURL);
      }
      await addRatingToProductBlock();
    });
    return await context.extract(productDetails, { transform });
  } catch(error){
    console.log('error', error);
  }
}

module.exports = {
  implements: 'product/search/extract',
  parameterValues: {
    country: 'FR',
    store: 'cdiscount',
    transform,
    domain: 'cdiscount.com',
    zipcode: '',
  },
  implementation,
};
