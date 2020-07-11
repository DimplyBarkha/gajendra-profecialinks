
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;


  await context.evaluate(async function() {

    function addHiddenDiv (el, className, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', className);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }

    function stall(ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    /*const primaryImageBaseUrl = document.querySelector('td.images td.base_url');
    const primaryImageUrl = document.querySelector('td.images td.primary');
    if(primaryImageBaseUrl && primaryImageUrl) {
      addHiddenDiv('primaryImage', primaryImageBaseUrl.innerText + primaryImageUrl.innerText);
    }

    const secondaryImageBaseUrl = document.querySelector('td.images td.base_url');
    let secondaryImageUrls = [];
    document.querySelectorAll('td.images td.image_url').forEach(e => {
      secondaryImageUrls.push(secondaryImageBaseUrl.innerText + e.innerText);
    });
    addHiddenDiv('secondaryImages', secondaryImageUrls.join(' | '));*/
    const newDiv = document.createElement('ul');
    newDiv.setAttribute('id', 'mainContainer');
    newDiv.style.display = 'none';
    document.body.appendChild(newDiv);

    if (document.querySelector('td.parent_items')) {
      const parentId = document.querySelector('td.parent_items').innerText;
      await fetch("https://redsky.target.com/v3/pdp/tcin/" + parentId + "?excludes=taxonomy%2Cbulk_ship%2Cawesome_shop%2Cquestion_answer_statistics%2Crating_and_review_reviews%2Crating_and_review_statistics%2Cdeep_red_labels%2Cin_store_location%2Cavailable_to_promise_store%2Cavailable_to_promise_network&key=eb2551e4accc14f38cc42d32fbc2b2ea&pricing_store_id=1465&storeId=1465&fulfillment_test_mode=grocery_opu_team_member_test")
      .then(data => data.json())
      .then(async function (res) {
        for (let variant of res.product.item.child_items) {

          const newDiv = document.createElement('li');
          newDiv.setAttribute('class', 'productInfo');
          newDiv.textContent = '';
          newDiv.style.display = 'none';
          document.getElementById('mainContainer').appendChild(newDiv);

          if (variant.enrichment && variant.enrichment.images && variant.enrichment.images.length) {
            addHiddenDiv(newDiv, 'primaryImage', variant.enrichment.images[0].base_url + variant.enrichment.images[0].primary);
            if (variant.enrichment.images[0].content_labels && variant.enrichment.images[0].content_labels.length) {
              let secondaryImages = variant.enrichment.images[0].content_labels.map(image => variant.enrichment.images[0].base_url + image.image_url);
              addHiddenDiv(newDiv, 'secondaryImages', secondaryImages.join(' | '));
            }
          }

          const productTitle = res.product.item.product_description.title;
          if (variant.variation_info && variant.variation_info.themes) {
            addHiddenDiv(newDiv, 'imageAlt', productTitle + ' ' + variant.variation_info.themes.map(theme => theme.value).join(' '));
          } else {
            addHiddenDiv(newDiv, 'imageAlt', productTitle);
          }

          if (variant.product_description && variant.product_description.title) {
            addHiddenDiv(newDiv, 'keywords', variant.product_description.title);
          }

          addHiddenDiv(newDiv, 'timeStamp', new Date());

          if (variant.enrichment && variant.enrichment.buy_url) {
            addHiddenDiv(newDiv, 'productUrl', variant.enrichment.buy_url);
          }

          if (variant.selling_channel ) {
            if(variant.selling_channel.includes('Sold Online')) {
              addHiddenDiv(newDiv, 'availability', 'In Stock');
            } else if (variant.selling_channel.includes('in Stores')) {
              addHiddenDiv(newDiv, 'availability', 'In Store Only');
            } else {
              addHiddenDiv(newDiv, 'availability', 'Out of Stock');
            }
          } else {
            addHiddenDiv(newDiv, 'availability', 'Out of Stock');
          }

          if (variant.product_description && variant.product_description.soft_bullets && variant.product_description.soft_bullets.bullets) {
            addHiddenDiv(newDiv, 'description', '|| ' + variant.product_description.soft_bullets.bullets.join(' || ') + ' ' + variant.product_description.downstream_description);
            addHiddenDiv(newDiv, 'descriptionBullets', variant.product_description.soft_bullets.bullets.length);
          }

          await fetch('https://redsky.target.com/web/pdp_location/v1/tcin/' + variant.tcin + '?pricing_store_id=1465&key=eb2551e4accc14f38cc42d32fbc2b2ea')
          .then(data => data.json())
          .then(variantData => {
            if(variantData.price && variantData.price.current_retail) {
              addHiddenDiv(newDiv, 'price', variantData.price.current_retail);
            }
            if(variantData.price && variantData.price.reg_retail) {
              addHiddenDiv(newDiv, 'regPrice', variantData.price.reg_retail);
            }
          });


        }
      });
    }

    await stall(1000);

  });

  await context.extract(productDetails, { transform });

}

const { transform } = require('../../../../shared');
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'target',
    transform: transform,
    domain: 'target.com',
  },
  implementation,
};
