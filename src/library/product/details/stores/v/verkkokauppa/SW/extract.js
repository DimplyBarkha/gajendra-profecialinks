
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'SW',
    store: 'verkkokauppa',
    transform: null,
    domain: 'verkkokauppa.com',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain ,transform: transformParam}, context, { productDetails }) => {     
    // await new Promise(resolve => setTimeout(resolve, 10000));

    await context.evaluate(async function () { 
      
     const productInfo = preFetchProductDetails();
      addEleToDoc('skuId', productInfo[0].sku);
      addEleToDoc('gtinId', productInfo[0].gtin13);
      addEleToDoc('priceCurrency', productInfo[0].offers[0].priceCurrency);  
     

      function preFetchProductDetails () {
        let productInfo = findProductDetails('//script[@type="application/ld+json"]');                
        productInfo = JSON.parse(productInfo.textContent);
        return productInfo;
      }      
            
      function findProductDetails (xpath) {        
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;                
        const productDetails = element;
        return productDetails;
      }

      function addEleToDoc (key, value) {
        const prodEle = document.createElement('div');
        prodEle.id = key;
        prodEle.textContent = value;
        prodEle.style.display = 'none';
        document.body.appendChild(prodEle);
      }

      // await new Promise(resolve => setTimeout(resolve, 1000));
      // const overlay = document.getElementById('tabs-page-select-tab1');      
      // if (overlay !== undefined) {
      //   overlay.click();
      // }


    });

    //await context.waitForSelector('//td[contains(text(), "Pakkauksen koko")]/following::td[1]', { timeout: 90000 });

      // await new Promise(resolve => setTimeout(resolve, 10000));
      // await context.waitForSelector('//td[contains(text(), "Pakkauksen koko")]/following::td[1]', { timeout: 90000 });

      

    // const { transform } = parameters;
    // const { productDetail } = dependencies;
    // return await context.extract(productDetails,productDetail, { transform });
       return await context.extract(productDetails, { transform: transformParam });       
  },  
};
