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

  var jsonText = await context.evaluate(function () {
    return document.body.innerText;
  });
  const json = JSON.parse(jsonText);

  if (json && json.records && json.totalRecordCount) {
    await context.evaluate(function (records, cnt) {
      function addHiddenDiv (id, content, parentDiv = null) {
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
      document.body.innerText = '';
      addHiddenDiv('totalRecordCount', cnt);
      addHiddenDiv('ii_url', window.location.href);
      for (let i = 0; i < records.length; i++) {
        const newDiv = addHiddenDiv('ii_product', '');
        if (records[i].allMeta) {
          const product = records[i].allMeta;
          if (product) {
            debugger
            addHiddenDiv('ii_brand', product.ProductBrand_Brand, newDiv);
            addHiddenDiv('ii_id', product.gbi_defaultSku, newDiv);
            addHiddenDiv('ii_title', product.title, newDiv);
            addHiddenDiv('ii_productUrl', product.gbi_ParentProductPageUrl, newDiv);
            if(product.CAREPASS_INDICATOR === "ELIGIBLE") {
              addHiddenDiv('ii_endorsementText', "CarePass", newDiv);

            }
            if (product.variants && product.variants && product.variants[0] && product.variants[0].subVariant && product.variants[0].subVariant[0]) {
              const variant = product.variants[0].subVariant[0];
              addHiddenDiv('ii_price', variant.gbi_Actual_Price, newDiv);
              addHiddenDiv('ii_image', variant.BV_ImageUrl, newDiv);
              addHiddenDiv('ii_reviews', variant.p_Product_Review, newDiv);
              addHiddenDiv('ii_rating', variant.p_Product_Rating, newDiv);
              if (variant.gbi_Badge_Sponsored && variant.gbi_Badge_Sponsored === true) { addHiddenDiv('ii_sponsored', 'Sponsored', newDiv); }
            }
          }
        }
      }
    }, json.records, json.totalRecordCount);
  }
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
