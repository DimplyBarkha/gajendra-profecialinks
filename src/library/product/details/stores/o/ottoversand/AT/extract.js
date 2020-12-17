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
  implementation: async ({ inputString }, { country, domain, transform: transformParam }, context, { productDetails }) => {
    await context.waitForSelector('script#schemaorg-product', { timeout: 90000 });

    const isSelectorAvailable = async (cssSelector) => {
      console.log(`Is selector available: ${cssSelector}`);
      return await context.evaluate(function (selector) {
        return !!document.querySelector(selector);
      }, cssSelector);
    };

    const relatedProducts = await isSelectorAvailable('div.sc-pczax.eSUKWi.emma-slider');
    if (relatedProducts) {
      try {
        await context.evaluate(async function () {
          document.querySelector('div.sc-pITNg.gYmPPj').scrollIntoView({ block: 'end', behavior: 'smooth' });
          await new Promise(resolve => setTimeout(resolve, 10000));
        });
      } catch (e) {
        console.log('relatedProducts not loaded');
      }
    }

    await context.evaluate(async function () {

      //   try {

      //  const productInfo = preFetchProductDetails();
      //   if(productInfo!=null)
      //   {
      //     addEleToDoc('skuId', productInfo['sku']);
      //     if(typeof productInfo['aggregateRating'] !== "undefined")
      //     {
      //       addEleToDoc('agreegateRatingId',productInfo['aggregateRating'].ratingValue);
      //     }
      //     addEleToDoc('priceId',productInfo['offers'].price.replace('.',','));
      //     addEleToDoc('currencyId',productInfo['offers'].priceCurrency);
      //     addEleToDoc('tempBrandId',productInfo['brand'].name);
      //   }

      //   function preFetchProductDetails () {
      //     let productInfo = findProductDetails('//script[@type="application/ld+json" and @id="schemaorg-product"]');
      //     if(productInfo!=null)
      //     {
      //       productInfo = JSON.parse(productInfo.textContent);
      //     }
      //     return productInfo;
      //   }

      //   function findProductDetails (xpath) {
      //     const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
      //     const productDetails = element;
      //     return productDetails;
      //   }
      //   } catch (error) {
      //             console.log(error.message);
      //           }
      //   function addEleToDoc (key, value) {
      //     const prodEle = document.createElement('div');
      //     prodEle.id = key;
      //     prodEle.textContent = value;
      //     prodEle.style.display = 'none';
      //     document.body.appendChild(prodEle);
      //   }

    });

    // return await context.extract(productDetails);
    return await context.extract(productDetails, { transform: transformParam });
  },
};
