const { transform } = require('./transform');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'AT',
    store: 'ottoversand',
    transform,
    domain: 'ottoversand.at',
    zipcode: '',
  },
  implementation: async ({ inputString }, { country, domain,transform: transformParam }, context, { productDetails }) => {
    await context.evaluate(async function () {      
      
     const productInfo = preFetchProductDetails();
      addEleToDoc('skuId', productInfo.sku);
      if(typeof productInfo.aggregateRating !== "undefined")
      {
        addEleToDoc('agreegateRatingId',productInfo.aggregateRating.ratingValue);
      }
      addEleToDoc('priceId',productInfo.offers.price);
      addEleToDoc('currencyId',productInfo.offers.priceCurrency);

      function preFetchProductDetails () {
        let productInfo = findProductDetails('//script[@type="application/ld+json" and @id="schemaorg-product"]');        
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

    });
    
    //return await context.extract(productDetails);
    return await context.extract(productDetails, { transform: transformParam });
  },  
};
