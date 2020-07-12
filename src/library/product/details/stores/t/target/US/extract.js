
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
    const { transform } = parameters;
    const { productDetails } = dependencies;

    await context.waitForXPath("//li[@class='Col-favj32-0 diyyNr h-padding-a-none h-display-flex']");
    const productUrl = await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    await stall(100);
    const link = document.querySelector('.Link-sc-1khjl8b-0.h-display-block');
    if (link !== null) {
      const href = link.getAttribute('href');
      if (href.indexOf('preselect=') > -1) {
        let productId = href.split('preselect=')[1];
        productId = productId.split('#')[0];
        const splitUrl = href.split('-');
        splitUrl[splitUrl.length - 1] = productId;
        return splitUrl.join('-');
      }
      return href;
    }
  });

  await context.goto('https://www.target.com' + productUrl);
  await context.waitForXPath("//div[@data-test='product-price']");


  await context.evaluate(async function() {

    let parentData = {};

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

    function createListItem() {
      const newDiv = document.createElement('li');
      newDiv.setAttribute('class', 'productInfo');
      newDiv.textContent = '';
      newDiv.style.display = 'none';
      document.getElementById('mainContainer').appendChild(newDiv);
      return newDiv;
    }

    let scrollTop = 500;
    while (true) {
      window.scroll(0, scrollTop);
      await stall(200);
      scrollTop += 500;
      if (scrollTop === 5000) {
        break;
      }
    }

    await stall(50);
    const manufacturerCTA = document.querySelector('.Button-bwu3xu-0.styles__ShowMoreButton-zpxf66-2.h-padding-t-tight');
    if (manufacturerCTA) {
      manufacturerCTA.click();
    }
    await stall(50);
    const element = document.querySelector('#salsify-ec-iframe');
    if (element) {
      console.log('found iframe');
      console.log(element.getAttribute('src'));
      await fetch(element.getAttribute('src'))
        .then(async function (response) {
          const sometext = await response.text();
          const startText = '<body>';
          const endText = '</body>';
          const startIx = sometext.indexOf(startText);
          const endIx = sometext.indexOf(endText, startIx);
          console.log('start: ' + startIx);
          console.log('end: ' + endIx);
          const bodyContent = sometext.substring(startIx + startText.length, endIx);
          const wrapper = document.createElement('div');
          wrapper.id = 'frameContents';
          wrapper.innerHTML = bodyContent;
          document.body.appendChild(wrapper);
          console.log('tried to append iframe content');
        });
    } else {
      console.log('did not find iframe');
    }

    async function getProductInfo(variant, productName, variantCount = null) {
      const newDiv = createListItem();

      addHiddenDiv(newDiv, 'productName', productName);

      if (variant.enrichment && variant.enrichment.images && variant.enrichment.images.length) {
        addHiddenDiv(newDiv, 'primaryImage', variant.enrichment.images[0].base_url + variant.enrichment.images[0].primary);
        if (variant.enrichment.images[0].content_labels && variant.enrichment.images[0].content_labels.length) {
          let secondaryImages = variant.enrichment.images[0].content_labels.map(image => variant.enrichment.images[0].base_url + image.image_url);
          addHiddenDiv(newDiv, 'secondaryImages', secondaryImages.join(' | '));
        }
      }

      if(parentData.product.item.enrichment
        && parentData.product.item.enrichment.videos
        && parentData.product.item.enrichment.videos.length
        && parentData.product.item.enrichment.videos[0]
        && parentData.product.item.enrichment.videos[0].video_files) {
        addHiddenDiv(newDiv, 'videos', parentData.product.item.enrichment.videos[0].video_files.map(video => "https:" + video.video_url).join(' | '));
      }

      const productTitle = variant.product_description.title;
      if (variant.variation_info && variant.variation_info.themes) {
        addHiddenDiv(newDiv, 'imageAlt', productTitle + ' ' + variant.variation_info.themes.map(theme => theme.value).join(' '));
      } else {
        addHiddenDiv(newDiv, 'imageAlt', productTitle);
      }

      if (variant.product_description && variant.product_description.title) {
        addHiddenDiv(newDiv, 'keywords', variant.product_description.title);
      }

      addHiddenDiv(newDiv, 'timeStamp', new Date());

      if (variant.enrichment && (variant.buy_url || variant.enrichment.buy_url)) {
        addHiddenDiv(newDiv, 'productUrl', variant.buy_url || variant.enrichment.buy_url);
      }

      let description = '';
      if (variant.product_description && variant.product_description.soft_bullets && variant.product_description.soft_bullets.bullets && variant.product_description.soft_bullets.bullets.length) {
        description = '|| ' + variant.product_description.soft_bullets.bullets.join(' || ') + ' ';
        addHiddenDiv(newDiv, 'descriptionBullets', variant.product_description.soft_bullets.bullets.length);
      }
      addHiddenDiv(newDiv, 'description', description + variant.product_description.downstream_description);

      const ingredients = [];
      if (variant.enrichment && variant.enrichment.nutrition_facts && variant.enrichment.nutrition_facts.ingredients) {
        ingredients.push(variant.enrichment.nutrition_facts.ingredients);
      }
      if (variant.enrichment && variant.enrichment.drug_facts && variant.enrichment.drug_facts.ingredients) {
        ingredients.push(variant.enrichment.drug_facts.ingredients);
      }

      if (ingredients.length) {
        addHiddenDiv(newDiv, 'ingredients', ingredients.join(' '));
      }

      if (variant.product_brand && variant.product_brand.brand) {
        addHiddenDiv(newDiv, 'brand', variant.product_brand.brand);
      }

      if(variant.variation && variant.variation.size) {
        addHiddenDiv(newDiv, 'size', variant.variation.size);
      }

      if(variant.variation && variant.variation.color) {
        addHiddenDiv(newDiv, 'color', variant.variation.color);
      }

      if (variant.product_description && variant.product_description.bullet_description) {
        const materials = [];
        variant.product_description.bullet_description.forEach(e => {
          if (e.includes('<B>Weight:</B>') || e.includes('<B>Net weight:</B>')) {
            addHiddenDiv(newDiv, 'netWeight', e.split('</B>')[1].trim());
          }
          if (e.includes('Number of')) {
            addHiddenDiv(newDiv, 'packSize', e.split('</B>')[1].trim());
          }
          if (e.includes('Dimensions')) {
            addHiddenDiv(newDiv, 'specifications', e.split('</B>')[1].trim());
          }
          if (e.includes('Warranty')) {
            addHiddenDiv(newDiv, 'warranty', e.split('</B>')[1].trim());
          }
          if (e.includes('Storage')) {
            addHiddenDiv(newDiv, 'storage', e.replace(/(<([^>]+)>)/ig, ''));
          }
          if (e.includes('Contains:')) {
            addHiddenDiv(newDiv, 'allergyAdvice', e.split('</B>')[1].trim());
          }
          if (e.includes('Alcohol content:')) {
            addHiddenDiv(newDiv, 'alcoholContent', e.split('</B>')[1].trim());
          }
          if (e.includes('Suggested Age:')) {
            addHiddenDiv(newDiv, 'ageSuitability', e.split('</B>')[1].trim());
          }
          if (e.includes('Material:') || e.includes('material:')) {
            materials.push(e.split('</B>')[1].trim());
          }
        });
        if (materials.length) {
          addHiddenDiv(newDiv, 'materials', materials.join(', '));
        }
      }

      if (variant.package_dimensions) {
        addHiddenDiv(newDiv, 'shipWeight', variant.package_dimensions.weight + ' ' + variant.package_dimensions.weight_unit_of_measure.toLowerCase() + 's');
        addHiddenDiv(newDiv, 'shippingDimensions', variant.package_dimensions.depth + ' inches length x ' + variant.package_dimensions.width + ' inches width x ' + variant.package_dimensions.height + ' inches height');
      }

      if (variant.upc) {
        addHiddenDiv(newDiv, 'upc', parseInt(variant.upc, 10));
      }

      if (variant.tcin) {
        addHiddenDiv(newDiv, 'sku', variant.tcin);
      }

      if (variant.dpci) {
        addHiddenDiv(newDiv, 'variantId', variant.dpci);
      }

      if (variant.disclaimer && variant.disclaimer.description) {
        addHiddenDiv(newDiv, 'disclaimer', variant.disclaimer.description);
      }

      if (variant.country_of_origin) {
        addHiddenDiv(newDiv, 'countryOfOrigin', variant.country_of_origin);
      }

      if (variant.enrichment && variant.enrichment.drug_facts) {
        if(variant.enrichment.drug_facts.direction && variant.enrichment.drug_facts.direction.general_directions && variant.enrichment.drug_facts.direction.general_directions.length) {
          addHiddenDiv(newDiv, 'directions', variant.enrichment.drug_facts.direction.general_directions[0]);
        }
        if (variant.enrichment.drug_facts.warning && variant.enrichment.drug_facts.warning.text) {
          addHiddenDiv(newDiv, 'warnings', variant.enrichment.drug_facts.warning.text);
        }
      }

      if (variantCount) {
        addHiddenDiv(newDiv, 'variantCount', variantCount);
      }

      if(variant.proposition_65_warning_text) {
        addHiddenDiv(newDiv, 'prop65Warning', variant.proposition_65_warning_text);
      }

      if (variant.enrichment
        && variant.enrichment.nutrition_facts
        && variant.enrichment.nutrition_facts.value_prepared_list
        && variant.enrichment.nutrition_facts.value_prepared_list.length
        && variant.enrichment.nutrition_facts.value_prepared_list[0]
        && variant.enrichment.nutrition_facts.value_prepared_list[0].serving_size) {
          addHiddenDiv(newDiv, 'servingSize', variant.enrichment.nutrition_facts.value_prepared_list[0].serving_size);
          addHiddenDiv(newDiv, 'servingSizeUom', variant.enrichment.nutrition_facts.value_prepared_list[0].serving_size_unit_of_measurement);
          addHiddenDiv(newDiv, 'servingsPerContainer', variant.enrichment.nutrition_facts.value_prepared_list[0].servings_per_container);

          variant.enrichment.nutrition_facts.value_prepared_list[0].nutrients.forEach(e => {
            if (e.name === 'Calories') {
              addHiddenDiv(newDiv, 'caloriesPerServing', e.quantity || e.percentage);
            }
            if (e.name === 'Calories From Fat') {
              addHiddenDiv(newDiv, 'caloriesFromFat', e.quantity || e.percentage);
            }
            if (e.name === 'Total Fat') {
              addHiddenDiv(newDiv, 'totalFatPerServing', e.quantity || e.percentage);
              addHiddenDiv(newDiv, 'totalFatPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Saturated Fat') {
              addHiddenDiv(newDiv, 'saturatedFatPerServing', e.quantity || e.percentage);
              addHiddenDiv(newDiv, 'saturatedFatPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Trans Fat') {
              addHiddenDiv(newDiv, 'transFatPerServing', e.quantity || e.percentage);
              addHiddenDiv(newDiv, 'transFatPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Cholesterol') {
              addHiddenDiv(newDiv, 'cholesterolPerServing', e.quantity || e.percentage);
              addHiddenDiv(newDiv, 'cholesterolPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Sodium') {
              addHiddenDiv(newDiv, 'sodiumPerServing', e.quantity || e.percentage);
              addHiddenDiv(newDiv, 'sodiumPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Total Carb.') {
              addHiddenDiv(newDiv, 'totalCarbPerServing', e.quantity || e.percentage);
              addHiddenDiv(newDiv, 'totalCarbPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Dietary Fiber') {
              addHiddenDiv(newDiv, 'dietaryFibrePerServing', e.quantity || e.percentage);
              addHiddenDiv(newDiv, 'dietaryFibrePerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Sugars') {
              addHiddenDiv(newDiv, 'totalSugarsPerServing', e.quantity || e.percentage);
              addHiddenDiv(newDiv, 'totalSugarsPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Protein') {
              addHiddenDiv(newDiv, 'proteinPerServing', e.quantity || e.percentage);
              addHiddenDiv(newDiv, 'proteinPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Vitamin A') {
              addHiddenDiv(newDiv, 'vitaminAPerServing', e.quantity || e.percentage);
              addHiddenDiv(newDiv, 'vitaminAPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Vitamin C') {
              addHiddenDiv(newDiv, 'vitaminCPerServing', e.quantity || e.percentage);
              addHiddenDiv(newDiv, 'vitaminCPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Calcium') {
              addHiddenDiv(newDiv, 'calciumPerServing', e.quantity || e.percentage);
              addHiddenDiv(newDiv, 'calciumPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Iron') {
              addHiddenDiv(newDiv, 'ironPerServing', e.quantity || e.percentage);
              addHiddenDiv(newDiv, 'ironPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Magnesium') {
              addHiddenDiv(newDiv, 'magnesiumPerServing', e.quantity || e.percentage);
              addHiddenDiv(newDiv, 'magnesiumPerServingUom', e.unit_of_measurement || '%');
            }
          });
      }

      if (parentData.product.item && parentData.product.item.child_items) {
        const variants = [];
        parentData.product.item.child_items.forEach(e => {
          variants.push(e.tcin);
        });
        addHiddenDiv(newDiv, 'firstVariant', variants[0]);
        addHiddenDiv(newDiv, 'variants', variants.join(' | '));
      }

      if (variant.variation && variant.variation.flexible_themes) {
        const variationInfo = [];
        for (let key in variant.variation.flexible_themes) {
          variationInfo.push(variant.variation.flexible_themes[key])
        }
        addHiddenDiv(newDiv, 'variationInfo', variationInfo.join(' '));
      }

      document.querySelector('div[data-test="breadcrumb"]').querySelectorAll('span[itemprop="name"]').forEach((e, ind) => {
        if (ind > 0) {
          addHiddenDiv(newDiv, 'category', e.innerText);
        }
      });

      let terms = 'No';
      if (document && document.querySelector('a[href="/c/terms-conditions/-/N-4sr7l"]')) {
        terms = 'Yes';
      }
      addHiddenDiv(newDiv, 'terms', terms);

      let privacy = 'No';
      if (document && document.querySelector('a[href="/c/target-privacy-policy/-/N-4sr7p"]')) {
        privacy = 'Yes';
      }
      addHiddenDiv(newDiv, 'privacy', privacy);
      addHiddenDiv(newDiv, 'customerServiceAvailability', 'Yes');

      const zoom = document.querySelector('.ZoomedImage__Zoomed-sc-1j8d1oa-0.dwtKdC');
      if (zoom) {
        addHiddenDiv(newDiv, 'zoom', 'Yes');
      } else {
        addHiddenDiv(newDiv, 'zoom', 'No');
      }

      let rotate = document.querySelector('button[data-test="button-model-viewer"]');
      if (!rotate) {
        document.querySelectorAll('.wc-demoted').forEach(e => {
          console.log('h3', e.innerText);
          if (e && e.innerText && e.innerText === '360° View') {
            rotate = true;
          }
        });
      }
      if (rotate) {
        addHiddenDiv(newDiv, 'rotate', 'Yes');
      } else {
        addHiddenDiv(newDiv, 'rotate', 'No');
      }

      const manufacturerCTA = document.querySelector('.Button-bwu3xu-0.styles__ShowMoreButton-zpxf66-2.h-padding-t-tight');
      const frameContents = document.getElementById('frameContents');
      if (frameContents) {
        addHiddenDiv(newDiv, 'manufacturerDesc', frameContents.innerText);
        const manufacturerImgs = [];
        frameContents.querySelectorAll('img').forEach(e => {
          manufacturerImgs.push(e.getAttribute('src'));
        });
        addHiddenDiv(newDiv, 'manufacturerImgs', manufacturerImgs.join(' | '));
      } else if (manufacturerCTA) {
        const manufacturerImgs = [];
        if (document.getElementById('wcframable1-0') && document.getElementById('wcframable1-0').contentWindow) {
          const frameContents = document.getElementById('wcframable1-0').contentWindow.document.body;
          frameContents.querySelectorAll('img').forEach(e => {
            manufacturerImgs.push(e.src);
          });
        }
        if (document.getElementById('wc-power-page') && document.getElementById('wc-power-page').innerText) {
          console.log('wcframes', document.querySelectorAll('.wc-fragment').length);
          const manufacturerDesc = [];
          document.querySelectorAll('.wc-fragment').forEach(e => {
            if (e.querySelector('.wc-pct-data')) {
              e.querySelectorAll('tr').forEach(tr => {
                if (tr.innerText && !manufacturerDesc.includes(tr.innerText)) {
                  manufacturerDesc.push(tr.innerText);
                }
              });
            } else {
              manufacturerDesc.push(e.innerText);
            }
          });
          addHiddenDiv(newDiv, 'manufacturerDesc', manufacturerDesc.join(' ').replace(/See product page/g, '').replace(/\d options available/g, ''));
          document.querySelectorAll('img.wc-media.wc-image').forEach(e => {
            manufacturerImgs.push(e.src);
          });
          const aplusBody = document.querySelector('.wc-product-image-row');
          if (aplusBody) {
            aplusBody.querySelectorAll('.wc-pct-product-image').forEach(e => {
              manufacturerImgs.push(e.src);
            });
          }
          addHiddenDiv(newDiv, 'manufacturerImgs', manufacturerImgs.join(' | '));
        }
      }

      await fetch('https://redsky.target.com/redsky_aggregations/v1/web/pdp_fulfillment_v1?key=eb2551e4accc14f38cc42d32fbc2b2ea&tcin=' + variant.tcin + '&store_id=1465&zip=54166&state=WI&latitude=44.780&longitude=-88.540&pricing_store_id=1465&fulfillment_test_mode=grocery_opu_team_member_test')
      .then(data => data.json())
      .then(availabilityData => {
        let inStore = false;
        let deliver = false;
        if(availabilityData
          && availabilityData.data
          && availabilityData.data.product
          && availabilityData.data.product.fulfillment) {

            if (availabilityData.data.product.fulfillment.store_options
                && availabilityData.data.product.fulfillment.store_options.length
                && availabilityData.data.product.fulfillment.store_options[0].in_store_only.availability_status === 'IN_STOCK') {
                inStore = true;
            }

            if (availabilityData.data.product.fulfillment.shipping_options
                && availabilityData.data.product.fulfillment.shipping_options.availability_status === 'IN_STOCK') {
                deliver = true;
            }

          }

          if (deliver) {
            addHiddenDiv(newDiv, 'availability', 'In Stock');
          } else if (inStore) {
            addHiddenDiv(newDiv, 'availability', 'In Store Only');
          }
          if (!deliver && !inStore) {
            addHiddenDiv(newDiv, 'availability', 'Out of stock');
          }

      });

      await fetch('https://redsky.target.com/web/pdp_location/v1/tcin/' + variant.tcin + '?pricing_store_id=1465&key=eb2551e4accc14f38cc42d32fbc2b2ea')
      .then(data => data.json())
      .then(variantData => {
        if (variantData.price) {
          if (variantData.price.current_retail) {
            addHiddenDiv(newDiv, 'price', variantData.price.current_retail);
          }
          if (variantData.price.reg_retail) {
            addHiddenDiv(newDiv, 'regPrice', variantData.price.reg_retail);
          }
          if (variantData.price.save_dollar) {
            addHiddenDiv(newDiv, 'promotion', "Save $" + variantData.price.save_dollar.toFixed(2) + ' ' + variantData.price.save_percent + '%' + ' off')
          }
        }
      });

      await fetch('https://redsky.target.com/v3/pdp/tcin/' + variant.tcin + '?excludes=taxonomy%2Cavailable_to_promise_store%2Cavailable_to_promise_network&key=eb2551e4accc14f38cc42d32fbc2b2ea&pricing_store_id=1465&storeId=1465&fulfillment_test_mode=grocery_opu_team_member_test')
      .then(data => data.json())
      .then(ratingData => {
        if (ratingData.product
          && ratingData.product.rating_and_review_statistics
          && ratingData.product.rating_and_review_statistics.result
          && ratingData.product.rating_and_review_statistics.result[variant.tcin]
          && ratingData.product.rating_and_review_statistics.result[variant.tcin].coreStats
          && ratingData.product.rating_and_review_statistics.result[variant.tcin].coreStats.RatingReviewTotal) {
          addHiddenDiv(newDiv, 'ratingCount', ratingData.product.rating_and_review_statistics.result[variant.tcin].coreStats.RatingReviewTotal);
          addHiddenDiv(newDiv, 'aggregateRating', ratingData.product.rating_and_review_statistics.result[variant.tcin].coreStats.AverageOverallRating);
          addHiddenDiv(newDiv, 'aggregateRatingText', ratingData.product.rating_and_review_statistics.result[variant.tcin].coreStats.AverageOverallRating + " out of 5");
        }
      });

    }

    const newDiv = document.createElement('ul');
    newDiv.setAttribute('id', 'mainContainer');
    newDiv.style.display = 'none';
    document.body.appendChild(newDiv);

    let splitUrl = window.location.href.split('-');
    await fetch("https://redsky.target.com/v3/pdp/tcin/" + splitUrl[splitUrl.length - 1] + "?excludes=taxonomy%2Cbulk_ship%2Cawesome_shop%2Cquestion_answer_statistics%2Crating_and_review_reviews%2Crating_and_review_statistics%2Cdeep_red_labels%2Cin_store_location%2Cavailable_to_promise_store%2Cavailable_to_promise_network&key=eb2551e4accc14f38cc42d32fbc2b2ea&pricing_store_id=1465&storeId=1465&fulfillment_test_mode=grocery_opu_team_member_test")
    .then(data => data.json())
    .then(async function (res) {
      parentData = res;
      if (res.product.item.parent_items && !isNaN(res.product.item.parent_items)) {

        const parentId = res.product.item.parent_items;
        await fetch("https://redsky.target.com/v3/pdp/tcin/" + parentId + "?excludes=taxonomy%2Cbulk_ship%2Cawesome_shop%2Cquestion_answer_statistics%2Crating_and_review_reviews%2Crating_and_review_statistics%2Cdeep_red_labels%2Cin_store_location%2Cavailable_to_promise_store%2Cavailable_to_promise_network&key=eb2551e4accc14f38cc42d32fbc2b2ea&pricing_store_id=1465&storeId=1465&fulfillment_test_mode=grocery_opu_team_member_test")
        .then(data => data.json())
        .then(async function (parentRes) {
          parentData = parentRes;
          for (let variant of parentRes.product.item.child_items) {
            getProductInfo(variant, parentRes.product.item.product_description.title, parentRes.product.item.child_items.length);
          }
        });

      } else if (res.product.item.child_items) {
        for (let variant of res.product.item.child_items) {
          getProductInfo(variant, res.product.item.product_description.title, res.product.item.child_items.length);
        }
      } else {
        getProductInfo(res.product.item, res.product.item.product_description.title);
      }
    });

    await stall(5000);

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
