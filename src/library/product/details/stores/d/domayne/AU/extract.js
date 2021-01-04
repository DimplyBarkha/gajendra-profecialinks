const { transform } = require('../format');

/**
 *
 * @param { { url?: string,  id?: string} } inputs
 * @param { Record<string, any> } parameters
 * @param { ImportIO.IContext } context
 * @param { Record<string, any> } dependencies
 */
async function implementation (inputs, parameters, context, dependencies) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  try{
    context.waitForSelector('#dyson_jump_features', {timeout: 30000});
 } catch(error){
      console.log('dyson_jump_features not found');
 }
  const waitSelector = await context.evaluate(()=>{
    return document.querySelector('#dyson_jump_features')? true:false ;
  })
  if(waitSelector){
  await context.evaluate(()=>{
    document.querySelector('.inpage_block.inpage_selector_feature').scrollIntoView({behavior: "smooth"});
  })
  }
  await context.evaluate(async function () {
   
    if (document.querySelector('#category-grid > div[data-position="1"]')) {
        document.querySelector('#category-grid > div > div > div.photo-box > a').click();
      }
   
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    // Function to fetch sku number and gtin from script tag as not available directly on DOM.
    function fetchRatingFromScript () {
      const scriptDataTagSelector = document.evaluate('//script[@type="application/ld+json"]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      const scriptTagData = scriptDataTagSelector ? scriptDataTagSelector.innerText : '';
      const availability = scriptTagData.includes('InStock') ? "In Stock" : "Out of Stock"; //checking for schemaOrg
      addHiddenDiv('added_availability', availability);
    }

    // If images are present in description then add to manufacturerDescription else add to description
    const descriptionSelector = document.evaluate('//*[@id="productDescription"] | //span[contains(text(), "Description")]/parent::*/following-sibling::* |  //div[contains(@class, "product-short-description short-description")]/p | //div[contains(@id,"dyson_jump_features")]', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    let description = descriptionSelector ? descriptionSelector.innerText : '';
    description = description ? description.replace(/(\n\s*){2,}/g, ' ').replace(/(\n\s*){1,}/g, ' || ') : '';
    const manufacturerImageFlag = document.querySelector('div[class="box-description cms"] img');
    if (manufacturerImageFlag) {
      addHiddenDiv('added-manufacturerDesc', description);
    } else {
      addHiddenDiv('added-description', description);
    }
    fetchRatingFromScript();
  });

  try{
    //await context.goto(src, { timeout: 50000, waitUntil: 'load', checkBlocked: true });
    
    const witbData = await context.evaluate(async () => {
      await new Promise((resolve, reject) => setTimeout(resolve, 30000));
      const iframe = document.querySelector('div.inpage_selector_InTheBox');
      console.log("0========>");
     const inBoxText = [];
     const inBoxUrls = [];
        const getInTheBoxTextOnly = document.querySelector('div.product-packcontents');
        const intheboxppresent = document.querySelector('div#flix-inpage > div:last-child>div#flix-dyson-new-inpage>div#flix-std-inpage>div#inpage_container');
        if(getInTheBoxTextOnly && !intheboxppresent){
          console.log("1========>");
          const getAllProductsTextOnly = document.querySelectorAll('div.product-packcontents > div.content >ul >li');
          for (let i = 0; i < getAllProductsTextOnly.length; i++) {
            inBoxText.push(getAllProductsTextOnly[i].innerText);
          }
        }else{
          if(intheboxppresent){
            console.log("2========>");
            //await context.waitForSelector('#inpage_container', { timeout: 5000 });
            const getAllProductsWithImg = document.querySelectorAll('div#flix-inpage > div:last-child>div#flix-dyson-new-inpage>div#flix-std-inpage>div#inpage_container>div.inpage_selector_feature>div.flix-std-container-fluid>div.inpage_selector_InTheBox>  div.flix-std-container-fluid >div.flix-std-table>div.flix-box-modules>div.flix-std-table>div');
            for (let i = 0; i < getAllProductsWithImg.length; i++) {
              inBoxText.push(getAllProductsWithImg[i].querySelector('div.flix-std-content>div>span').innerText);
              inBoxUrls.push(getAllProductsWithImg[i].querySelector('div.flix-background-image>img').getAttribute('data-flixsrcset'));
              
            }
            const getAllProductsWithImgLeft = document.querySelectorAll('div#flix-inpage > div:last-child>div#flix-dyson-new-inpage>div#flix-std-inpage>div#inpage_container>div.inpage_selector_feature>div.flix-std-container-fluid>div.inpage_selector_InTheBox>  div.flix-std-container-fluid >div.flix-std-table>div.flix-box-image');
            for (let i = 0; i < getAllProductsWithImgLeft.length; i++) {
              inBoxText.push(getAllProductsWithImgLeft[i].querySelector('div.flix-std-content>div>span').innerText);
              inBoxUrls.push(getAllProductsWithImgLeft[i].querySelector('div.flix-background-image>img').getAttribute('data-flixsrcset'));
              
            }
          }
        }     
    
      return { inBoxText, inBoxUrls };
      });
     
      
  
      await context.evaluate(async (witbData) => {
        function addHiddenDiv (id, content) {
          const newDiv = document.createElement('div');
          newDiv.id = id;
          newDiv.textContent = content;
          newDiv.style.display = 'none';
          document.body.appendChild(newDiv);
        }
  
        const { inBoxText = [], inBoxUrls = [] } = witbData;
        for (let i = 0; i < inBoxText.length; i++) {
          addHiddenDiv(`inTheBoxText-${i}`, inBoxText[i]);
          if (inBoxUrls[i]) {
           
            addHiddenDiv(`inTheBoxUrl-${i}`, inBoxUrls[i]);
          }
        }      
      }, witbData);
      // await context.waitForSelector('div#main-section', { timeout: 45000 });
    } catch (error) {
      try {
        // await context.evaluate(async function (src) {
        //   window.location.assign(src);
        // }, src);
        await context.waitForSelector('div.eky-container-full');
        return await context.extract(productDetails, { type: 'MERGE_ROWS', transform });
      } catch (err) {
        console.log(err);
      }
    }
  
      //await context.waitForSelector('.inpage_selector_InTheBox', { timeout: 5000 });
  await new Promise((resolve) => setTimeout(resolve, 10000));
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AU',
    store: 'domayne',
    transform,
    domain: 'domayne.com.au',
    zipcode: '',
  },
  implementation,
};
