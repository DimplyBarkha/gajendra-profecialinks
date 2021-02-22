// const { transform } = require('../../../../shared');
const { transform } = require('./format');
async function implementation(
  { results, keywords },
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;
  console.log("Keywords extract start", keywords);
  console.log("results", results);
  await context.evaluate(async function (results, keywords) {
    let resultCollected = 0;
    if (document.querySelector('.load-more.gb-ui button')) {
      while (resultCollected <= results && document.querySelector('.load-more.gb-ui button') != null) {
        let element = document.querySelector('.load-more.gb-ui button');
        if (element) {
          element.click();
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
        else {
          break;
        }
        resultCollected = document.querySelectorAll('gbcvs-product-tile[class*="gb-ui"]').length;
        console.log("results", resultCollected);
      }
    }
    else {
      const productsCount = document.querySelectorAll('gbcvs-product-tile[class*="gb-ui"]');
      console.log("products", productsCount)
      console.log("Results", results)
      for (let i = 0; i < Number(results); i++) {
        if (productsCount) {
          productsCount[i] && productsCount[i].setAttribute("class", "gb-ui fetch");
        }
      }
      console.log("keywords", keywords);
      var newKeyword = keywords;
      if (keywords.includes("&")) {
        newKeyword = keywords.replace("&", "%26");
      }

      var offset = 0;
      while (offset < results) {
        var jsonText = await fetch('https://www.cvs.com/shop-assets/proxy/search?query=' + newKeyword + '&skip=' + offset + '&pageSize=50&fields=%5B%22*%22%2C%22id%22%5D&orFields=%5B%22variants.subVariant.availability%22%5D&refinements=%5B%5D').then(res =>
          res.text()
        );
        // var jsonText = await context.evaluate(function () {
        //   return document.body.innerText;
        // });
        const json = JSON.parse(jsonText);
        if (json.records.length == 0) break;

        if (json && json.records && json.totalRecordCount) {
          // await context.evaluate(function (records, cnt) {
          let records = json.records
          let cnt = json.totalRecordCount
          // console.log("count",cnt);
          // console.log("records", records);
          function addHiddenDiv(id, content, parentDiv = null) {
            const newDiv = document.createElement('div');
            newDiv.id = id;
            if (!content) content = '';
            newDiv.textContent = content;
            // newDiv.style.display = 'none';
            if (parentDiv) {
              parentDiv.appendChild(newDiv);
            } else {
              document.body.appendChild(newDiv);
            }
            return newDiv;
          }
          // document.body.innerText = '';
          console.log('totalrecordCount', cnt);
          addHiddenDiv('totalRecordCount', cnt);
          addHiddenDiv('ii_url', window.location.href);
          console.log(records.length);
          for (let i = 0; i < records.length; i++) {
            const newDiv = addHiddenDiv('ii_product', '');
            if (records[i].allMeta) {
              const product = records[i].allMeta;
              if (product) {
                // debugger
                addHiddenDiv('ii_brand', product.ProductBrand_Brand, newDiv);
                addHiddenDiv('ii_id', product.gbi_defaultSku, newDiv);
                addHiddenDiv('ii_title', product.title, newDiv);
                addHiddenDiv('ii_productUrl', product.gbi_ParentProductPageUrl, newDiv);
                if (product.CAREPASS_INDICATOR === "ELIGIBLE") {
                  addHiddenDiv('ii_endorsementText', "CarePass", newDiv);

                }
                if (product.variants && product.variants && product.variants[0] && product.variants[0].subVariant && product.variants[0].subVariant[0]) {
                  const variant = product.variants[0].subVariant[0];
                  addHiddenDiv('ii_price', variant.gbi_Actual_Price, newDiv);
                  addHiddenDiv('ii_image', variant.BV_ImageUrl, newDiv);
                  addHiddenDiv('ii_reviews', variant.p_Product_Review, newDiv);
                  if (variant.p_Product_Rating) {
                    let rating = parseFloat(variant.p_Product_Rating)
                    let adjusted = rating.toPrecision(2)
                    addHiddenDiv('ii_rating', adjusted, newDiv);
                  }
                  if (variant.gbi_Badge_Sponsored && variant.gbi_Badge_Sponsored === true) { addHiddenDiv('ii_sponsored', 'Sponsored', newDiv); }
                }
              }
            }
          }

          // }, json.records, json.totalRecordCount);
        }
        else break;
        offset += 50;

      }

    }
  }, results, keywords);



  // await context.evaluate(async function (results) {
  //   const productsCount = document.querySelectorAll('gbcvs-product-tile[class*="gb-ui"]');
  //   console.log("products", productsCount)
  //   console.log("Results",results)
  //   for (let i = 0; i < Number(results); i++) {
  //     if (productsCount) {
  //       productsCount[i] && productsCount[i].setAttribute("class", "gb-ui fetch");
  //     }
  //   }
  // }, results);
  // await context.evaluate(async function () {
  // function addHiddenDiv1 (id, content, index) {
  //   const newDiv1 = document.createElement('button');
  //   newDiv1.id = id;
  //   newDiv1.textContent = content;
  //   newDiv1.style.display = 'none';
  //   const originalDiv1 = document.querySelectorAll('.css-1dbjc4n.r-1awozwy.r-14lw9ot.r-rs99b7')[index];
  //   originalDiv1.appendChild(newDiv1);
  // }
  //   const searchURL = window.location.href;
  //   addHiddenDiv('added_search_url', searchURL);
  // });
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
  implementation,
};
