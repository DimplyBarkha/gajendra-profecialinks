async function implementation(
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  if (inputs.id) {
    await context.evaluate(async function () {
      const noResult = document.querySelector('div[data-test="NLRTransparentMessage"]');
      if (noResult) {
        throw Error('We couldn’t find a match for your search');
      }
    });
    await context.waitForXPath('//li[contains(@class,"Col-favj32")]//div[@data-test="product-details"]');
    const productUrl = await context.evaluate(async function () {
      function stall(ms) {
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

    await context.goto('https://www.target.com' + productUrl, { timeout: 80000, waitUntil: 'load', checkBlocked: true });
  }

  await context.waitForXPath("//h1[@data-test='product-title']");

  try {
    await context.evaluate(async function () {
      const reviewsContainer = 'h2[data-test="reviews-heading"]';
      const reviewsNode = document.querySelector(reviewsContainer);
      if (reviewsNode) {
        reviewsNode.scrollIntoView();
      }
    });
    const manufacturerCTASelector = 'button[aria-label="show from the manufacturer content"]';

    await context.waitForSelector(manufacturerCTASelector, { timeout: 60000 });
    const manufacturerCTA = await context.evaluate((selector) => !!document.querySelector(selector), manufacturerCTASelector);

    if (manufacturerCTA) {
      console.log('hastheCTA');
      await new Promise((resolve, reject) => setTimeout(resolve, 20000));
      await context.waitForSelector('#wc-power-page', { timeout: 30000 });
      await context.click(manufacturerCTASelector);
      await context.waitForSelector('.wc-fragment', { timeout: 10000 });
    }
  } catch (error) {
    console.log(`Manufacturer content is not loaded ${error.message}`);
  }

  await context.evaluate(async function () {
    let parentData = {};
    let origData = {};

    function addHiddenDiv(el, className, content) {
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

    function decodeHtml(html) {
      const txt = document.createElement('textarea');
      txt.innerHTML = html;
      return txt.value;
    }

    async function getProductInfo(variant, productName, variantCount = null) {
      await fetch('https://salsify-ecdn.com/target/en-US/BTF/TCIN/' + variant.tcin + '/index.html')
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
          wrapper.id = 'frameContents' + variant.tcin;
          wrapper.innerHTML = bodyContent;
          document.body.appendChild(wrapper);
          console.log('fetchFrame', variant.tcin, bodyContent);
        });

      document.getElementById('mainContainer').querySelectorAll('li').forEach(e => {
        if (e.querySelector('.sku') && e.querySelector('.sku').innerText === variant.tcin) {
          e.remove();
        }
      });

      const newDiv = createListItem();

      addHiddenDiv(newDiv, 'productName', decodeHtml(productName));

      const secondaryImages = [];
      if (variant.enrichment && variant.enrichment.images && variant.enrichment.images.length) {
        addHiddenDiv(newDiv, 'primaryImage', variant.enrichment.images[0].base_url + variant.enrichment.images[0].primary);
      }

      let videos = [];
      if (parentData.product &&
        parentData.product.item.enrichment &&
        parentData.product.item.enrichment.videos &&
        parentData.product.item.enrichment.videos.length) {
        videos = parentData.product.item.enrichment.videos.filter(video => video.video_files && video.video_files.length).map(video =>
          'https:' + video.video_files[0].video_url,
        );
      }

      if (!videos.length &&
        variant.enrichment.videos &&
        variant.enrichment.videos.length) {
        videos = variant.enrichment.videos.filter(video => video.video_files && video.video_files.length).map(video =>
          'https:' + video.video_files[0].video_url,
        );
      }

      const productTitle = document.querySelector('h1[data-test="product-title"]') && document.querySelector('h1[data-test="product-title"]').innerText;
      if (variant.variation_info && variant.variation_info.themes) {
        addHiddenDiv(newDiv, 'imageAlt', productTitle + ' ' + variant.variation_info.themes.map(theme => theme.value).join(' '));
      } else {
        addHiddenDiv(newDiv, 'imageAlt', productTitle);
      }

      if (variant.product_description && variant.product_description.title) {
        addHiddenDiv(newDiv, 'keywords', decodeHtml(variant.product_description.title));
        addHiddenDiv(newDiv, 'nameExtended', decodeHtml(variant.product_description.title));
      }

      addHiddenDiv(newDiv, 'timeStamp', new Date());

      const splitUrl = window.location.href.split('-');
      splitUrl[splitUrl.length - 1] = variant.tcin;
      addHiddenDiv(newDiv, 'productUrl', splitUrl.join('-'));

      let description = '';
      if (variant.product_description && variant.product_description.soft_bullets && variant.product_description.soft_bullets.bullets && variant.product_description.soft_bullets.bullets.length) {
        description = decodeHtml('|| ' + variant.product_description.soft_bullets.bullets.join(' || ')) + ' ';
        addHiddenDiv(newDiv, 'descriptionBullets', variant.product_description.soft_bullets.bullets.length);
        addHiddenDiv(newDiv, 'additionalDesc', ' || ' + decodeHtml(variant.product_description.soft_bullets.bullets.join(' || ')));
      }

      if (description.length || (variant.product_description && variant.product_description.downstream_description)) {
        addHiddenDiv(newDiv, 'description', description + (variant.product_description.downstream_description ? decodeHtml(variant.product_description.downstream_description.replace('<br />', ' ').replace(/(<([^>]+)>)/ig, ' ')) : ''));
      }

      if (variant.wellness_merchandise_attributes) {
        addHiddenDiv(newDiv, 'additionalDescBulletInfo', variant.wellness_merchandise_attributes.map(desc => desc.wellness_description).join(' | '));
      } else if (parentData.product && parentData.product.item.wellness_merchandise_attributes) {
        addHiddenDiv(newDiv, 'additionalDescBulletInfo', parentData.product.item.wellness_merchandise_attributes.map(desc => desc.wellness_description).join(' | '));
      } else if (origData.product && origData.product.item.wellness_merchandise_attributes) {
        addHiddenDiv(newDiv, 'additionalDescBulletInfo', origData.product.item.wellness_merchandise_attributes.map(desc => desc.wellness_description).join(' | '));
      }

      const ingredients = [];
      if (variant.enrichment && variant.enrichment.nutrition_facts && variant.enrichment.nutrition_facts.ingredients) {
        ingredients.push(variant.enrichment.nutrition_facts.ingredients);
      } else if (variant.enrichment && variant.enrichment.drug_facts && variant.enrichment.drug_facts.ingredients) {
        ingredients.push(variant.enrichment.drug_facts.ingredients);
      } else if (variant.enrichment && variant.enrichment.drug_facts && variant.enrichment.drug_facts.inactive_ingredients) {
        ingredients.push(variant.enrichment.drug_facts.inactive_ingredients.join(' '));
      }

      if (ingredients.length) {
        addHiddenDiv(newDiv, 'ingredients', ingredients.join(' '));
      }

      if (variant.product_brand && variant.product_brand.brand) {
        addHiddenDiv(newDiv, 'brand', variant.product_brand.brand);
      }

      if (variant.variation && variant.variation.size) {
        addHiddenDiv(newDiv, 'size', variant.variation.size);
      }

      if (variant.variation && variant.variation.color) {
        addHiddenDiv(newDiv, 'color', variant.variation.color);
      }

      const hasSpecifications = false;
      let storage = '';
      if (variant.product_description && variant.product_description.bullet_description) {
        const materials = [];
        variant.product_description.bullet_description.forEach(e => {
          if (e.includes('<B>Weight:</B>') || e.includes('<B>Net weight:</B>')) {
            addHiddenDiv(newDiv, 'netWeight', e.split('</B>')[1].trim());
          }
          if (e.includes('Quantity:')) {
            addHiddenDiv(newDiv, 'packSize', e.split('</B>')[1].trim());
          }
          // if (e.includes('Specifications')) {
          //   hasSpecifications = true;
          //   addHiddenDiv(newDiv, 'specifications', e.split('</B>')[1].trim());
          // }
          if (e.includes('Warranty')) {
            addHiddenDiv(newDiv, 'warranty', e.split('</B>')[1].trim());
          }
          if (e.includes('Storage Instructions:')) {
            storage = e.split('</B>')[1].trim();
          }
          if (e.includes('Contains:')) {
            addHiddenDiv(newDiv, 'allergyAdvice', e.split('</B>')[1].trim());
          }
          if (e.includes('Model #:')) {
            addHiddenDiv(newDiv, 'mpc', e.split('</B>')[1].trim());
          }
          if (e.includes('Package type:')) {
            addHiddenDiv(newDiv, 'packaging', e.split('</B>')[1].trim());
          }
          if (e.includes('Alcohol content:')) {
            addHiddenDiv(newDiv, 'alcoholContent', e.split('</B>')[1].trim());
          }
          if (e.includes('Hazard Warnings')) {
            addHiddenDiv(newDiv, 'warnings', e.split('</B>')[1].trim());
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

      if (storage.length) {
        addHiddenDiv(newDiv, 'storage', storage);
      }

      if (variant.package_dimensions) {
        if (variant.package_dimensions.weight && variant.package_dimensions.weight_unit_of_measure) {
          addHiddenDiv(newDiv, 'shipWeight', variant.package_dimensions.weight + ' ' + variant.package_dimensions.weight_unit_of_measure.toLowerCase() + 's');
        }
        addHiddenDiv(newDiv, 'shippingDimensions', variant.package_dimensions.depth + ' inches length x ' + variant.package_dimensions.width + ' inches width x ' + variant.package_dimensions.height + ' inches height');
        if (!hasSpecifications) {
          addHiddenDiv(newDiv, 'specifications', variant.package_dimensions.depth + ' inches length x ' + variant.package_dimensions.width + ' inches width x ' + variant.package_dimensions.height + ' inches height');
        }
      }

      if (variant.upc) {
        addHiddenDiv(newDiv, 'upc', variant.upc.toString());
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
      } else if (parentData.product && parentData.product.item.country_of_origin) {
        addHiddenDiv(newDiv, 'countryOfOrigin', parentData.product.item.country_of_origin);
      } else if (origData.product && origData.product.item.country_of_origin) {
        addHiddenDiv(newDiv, 'countryOfOrigin', origData.product.item.country_of_origin);
      }

      if (variant.enrichment && variant.enrichment.drug_facts) {
        if (variant.enrichment.drug_facts.direction && variant.enrichment.drug_facts.direction.general_directions && variant.enrichment.drug_facts.direction.general_directions.length) {
          addHiddenDiv(newDiv, 'directions', variant.enrichment.drug_facts.direction.general_directions[0]);
        }
        if (variant.enrichment.drug_facts.warning && variant.enrichment.drug_facts.warning.text) {
          addHiddenDiv(newDiv, 'warnings', variant.enrichment.drug_facts.warning.text);
        }
      }

      if (variant.enrichment && variant.enrichment.nutrition_facts) {
        if (variant.enrichment.nutrition_facts.warning) {
          addHiddenDiv(newDiv, 'warnings', variant.enrichment.nutrition_facts.warning);
        }
      }

      document.querySelectorAll('.h-padding-l-tight').forEach(e => {
        if (e && (e.innerText.indexOf('WARNING:') > -1 || e.innerText.indexOf('warning') > -1)) {
          addHiddenDiv(newDiv, 'warnings', e.parentElement.innerText.split(':')[1]);
        }
      });

      document.querySelectorAll('.h-padding-l-default').forEach(e => {
        if (e && (e.innerText.indexOf('Warning:') > -1) && e.querySelector('h3') && e.querySelector('h3').innerText === 'Description') {
          addHiddenDiv(newDiv, 'warnings', e.innerText.split('Warning:')[1]);
        }
      });

      if (variantCount) {
        addHiddenDiv(newDiv, 'variantCount', variantCount);
      }

      if (variant.proposition_65_warning_text) {
        addHiddenDiv(newDiv, 'prop65Warning', variant.proposition_65_warning_text);
      }

      if (variant.enrichment &&
        variant.enrichment.nutrition_facts &&
        variant.enrichment.nutrition_facts.value_prepared_list &&
        variant.enrichment.nutrition_facts.value_prepared_list.length &&
        variant.enrichment.nutrition_facts.value_prepared_list[0]) {
        if (variant.enrichment.nutrition_facts.value_prepared_list[0].serving_size) {
          const servingSize = variant.enrichment.nutrition_facts.value_prepared_list[0].serving_size;
          addHiddenDiv(newDiv, 'servingSize', !variant.enrichment.nutrition_facts.value_prepared_list[0].serving_size_unit_of_measurement ? servingSize : servingSize.split(' ')[0]);
          if (variant.enrichment.nutrition_facts.value_prepared_list[0].serving_size_unit_of_measurement) {
            addHiddenDiv(newDiv, 'servingSizeUom', variant.enrichment.nutrition_facts.value_prepared_list[0].serving_size_unit_of_measurement);
          }
          addHiddenDiv(newDiv, 'servingsPerContainer', variant.enrichment.nutrition_facts.value_prepared_list[0].servings_per_container);
        }

        if (variant.enrichment.nutrition_facts.value_prepared_list[0].nutrients) {
          variant.enrichment.nutrition_facts.value_prepared_list[0].nutrients.forEach(e => {
            if (!e) {
              return;
            }
            const val = e.quantity || e.percentage || '0';
            if (e.name === 'Calories') {
              addHiddenDiv(newDiv, 'caloriesPerServing', val);
            }
            if (e.name === 'Calories From Fat' || e.name === 'Calories from Fat') {
              addHiddenDiv(newDiv, 'caloriesFromFat', val);
            }
            if (e.name === 'Total Fat') {
              addHiddenDiv(newDiv, 'totalFatPerServing', val);
              addHiddenDiv(newDiv, 'totalFatPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Saturated Fat') {
              addHiddenDiv(newDiv, 'saturatedFatPerServing', val);
              addHiddenDiv(newDiv, 'saturatedFatPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Trans Fat') {
              addHiddenDiv(newDiv, 'transFatPerServing', val);
              addHiddenDiv(newDiv, 'transFatPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Cholesterol') {
              addHiddenDiv(newDiv, 'cholesterolPerServing', val);
              addHiddenDiv(newDiv, 'cholesterolPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Sodium') {
              addHiddenDiv(newDiv, 'sodiumPerServing', val);
              addHiddenDiv(newDiv, 'sodiumPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Total Carb.' || e.name === 'Total Carbohydrate') {
              addHiddenDiv(newDiv, 'totalCarbPerServing', val);
              addHiddenDiv(newDiv, 'totalCarbPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Dietary Fiber' || e.name === 'Dietary Fiber*') {
              addHiddenDiv(newDiv, 'dietaryFibrePerServing', val);
              addHiddenDiv(newDiv, 'dietaryFibrePerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Sugars' || e.name === 'Total Sugars') {
              addHiddenDiv(newDiv, 'totalSugarsPerServing', val);
              addHiddenDiv(newDiv, 'totalSugarsPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Protein') {
              addHiddenDiv(newDiv, 'proteinPerServing', val);
              addHiddenDiv(newDiv, 'proteinPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Vitamin A') {
              addHiddenDiv(newDiv, 'vitaminAPerServing', val);
              addHiddenDiv(newDiv, 'vitaminAPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Vitamin C') {
              addHiddenDiv(newDiv, 'vitaminCPerServing', val);
              addHiddenDiv(newDiv, 'vitaminCPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Calcium' || e.name.toLowerCase().indexOf('calcium') > -1) {
              addHiddenDiv(newDiv, 'calciumPerServing', val);
              addHiddenDiv(newDiv, 'calciumPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Iron' || e.name.toLowerCase().indexOf('iron') > -1) {
              addHiddenDiv(newDiv, 'ironPerServing', val);
              addHiddenDiv(newDiv, 'ironPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Magnesium' || e.name.toLowerCase().indexOf('magnesium') > -1) {
              addHiddenDiv(newDiv, 'magnesiumPerServing', val);
              addHiddenDiv(newDiv, 'magnesiumPerServingUom', e.unit_of_measurement || '%');
            }
          });
        }
      }

      if (parentData.product && parentData.product.item && parentData.product.item.child_items) {
        const variants = [];
        parentData.product.item.child_items.forEach(e => {
          variants.push(e.tcin);
        });
        addHiddenDiv(newDiv, 'firstVariant', variants[0]);
        addHiddenDiv(newDiv, 'variants', variants.join(' | '));
      }

      if (variant.variation && variant.variation.flexible_themes) {
        const variationInfo = [];
        for (const key in variant.variation.flexible_themes) {
          variationInfo.push(variant.variation.flexible_themes[key]);
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

      const zoom = document.querySelector('.ZoomedImage__Zoomed-sc-1j8d1oa-0.dwtKdC') || document.querySelector('.TapToZoomText-r290sk-0');
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

      const moreImageBtn = document.querySelector('.styles__LegendGridButtonOverlay-beej2j-13');

      if (moreImageBtn) {
        moreImageBtn.click();
        await stall(100);
        const slideDeck = document.querySelector('.ZoomedSlideDeck__SlideList-sc-1nqe9sx-0');
        if (slideDeck) {
          console.log('has slide deck!');
          slideDeck.querySelectorAll('.ZoomedSlide__Image-sc-10kwhw6-0').forEach(async (e, ind) => {
            if (e && e.getAttribute('src') && ((e.getAttribute('alt') && e.getAttribute('alt').indexOf('- video') > -1) || e.getAttribute('type') === 'video')) {
              e.click();
              await stall(1000);
              if (document.querySelector('.VideoContainer-sc-1f1jwpc-0')) {
                videos.push(document.querySelector('.VideoContainer-sc-1f1jwpc-0').querySelector('source').getAttribute('src'));
              }
            } else if (ind > 0) {
              var images = e.getAttribute('src');
              if (!images.startsWith('https')) {
                secondaryImages.push(e.getAttribute('src').replace('//', 'https://').replace('/sc/64x64', ''));
              }
              if (images.startsWith('https')) {
                secondaryImages.push(e.getAttribute('src').split('?')[0].replace('http://', 'https://').replace('/sc/64x64', ''));
              }
            }
          });
        }
      } else {
        const sideImages = document.querySelectorAll('.styles__ThumbnailImage-beej2j-11');
        if (sideImages) {
          sideImages.forEach(async (e, ind) => {
            if (e && e.getAttribute('src') && ((e.getAttribute('alt') && e.getAttribute('alt').indexOf('- video') > -1) || e.getAttribute('type') === 'video')) {
              e.click();
              await stall(1000);
              if (document.querySelector('.VideoContainer-sc-1f1jwpc-0')) {
                videos.push(document.querySelector('.VideoContainer-sc-1f1jwpc-0').querySelector('source').getAttribute('src'));
              }
            } else if (ind > 0) {
              var images = e.getAttribute('src');
              if (!images.startsWith('https')) {
                secondaryImages.push(e.getAttribute('src').replace('//', 'https://').replace('/sc/64x64', ''));
              }
              if (images.startsWith('https')) {
                secondaryImages.push(e.getAttribute('src').split('?')[0].replace('http://', 'https://').replace('/sc/64x64', ''));
              }
            }
          });
        }
      }

      addHiddenDiv(newDiv, 'secondaryImages', secondaryImages.filter(img => img !== variant.enrichment.images[0].base_url + variant.enrichment.images[0].primary).filter(onlyUnique).join(' | '));
      if (secondaryImages.length) {
        addHiddenDiv(newDiv, 'secondaryImageTotal', secondaryImages.filter(img => img !== variant.enrichment.images[0].base_url + variant.enrichment.images[0].primary).filter(onlyUnique).length);
      } else {
        addHiddenDiv(newDiv, 'secondaryImageTotal', '0');
      }

      fetch('https://redsky.target.com/v3/pdp/tcin/' + variant.tcin + '?excludes=taxonomy%2Cbulk_ship%2Cawesome_shop%2Cquestion_answer_statistics%2Crating_and_review_reviews%2Crating_and_review_statistics%2Cdeep_red_labels%2Cin_store_location%2Cavailable_to_promise_store%2Cavailable_to_promise_network&key=eb2551e4accc14f38cc42d32fbc2b2ea&fulfillment_test_mode=grocery_opu_team_member_test')
        .then(data => data.json())
        .then(async function (parent) {
          var base = parent.product.item.enrichment.images[0].base_url;
          var alternateImages = parent.product.item.enrichment.images[0].alternate_urls.map(image => base + image);
          addHiddenDiv(newDiv, 'alternateImages', alternateImages.filter(img => img !== parent.product.item.enrichment.images[0].base_url + parent.product.item.enrichment.images[0].primary).filter(onlyUnique).join(' | '));
          if (alternateImages.length) {
            addHiddenDiv(newDiv, 'alternateImageTotal', alternateImages.filter(img => img !== parent.product.item.enrichment.images[0].base_url + parent.product.item.enrichment.images[0].primary).filter(onlyUnique).length);
          }
        });

      const shipbutton = document.querySelector('#tab-ShippingReturns');
      if (shipbutton != null) {
        shipbutton.click();
        await stall(100);
        if (document && document.querySelector('div[data-test="productDetailsTabs-shippingReturnsTab-shippingDetails"]')) {
          addHiddenDiv(newDiv, 'shippingInfo', document.querySelector('div[data-test="productDetailsTabs-shippingReturnsTab-shippingDetails"]').innerText.replace('Shipping details ', ''));
        }
      }

      console.log('Starting to gather manufacturer content');
      let hasTechnicalInfoPDF = 'No';
      let manufacturerDesc = '';
      const manufacturerImgs = [];
      function addImagesVideos(node) {
        node.querySelectorAll('img').forEach(e => {
          manufacturerImgs.push(e.getAttribute('src'));
        });
        node.querySelectorAll('video').forEach(e => {
          videos.push(e.src);
        });
      }

      let mfgNode = document.getElementById('wc-power-page');
      const frameContents = document.getElementById('frameContents' + variant.tcin);
      if (frameContents && frameContents.querySelector('#salsify-content')) {
        await stall(2000);
        manufacturerDesc = frameContents.innerText;
        addImagesVideos(frameContents);
      } else if (mfgNode) {
        if (mfgNode.querySelector('button.wc-document-view-link.wc-document-view-link-with-image.wc-doc-thumb')) {
          hasTechnicalInfoPDF = 'Yes';
        }

        console.log('haswcpowerpage');
        const manufacturerDescArr = [];
        document.querySelectorAll('.wc-fragment').forEach(e => {
          if (e.getAttribute('data-section-caption') && e.getAttribute('data-section-caption') === 'Docs') {
            return;
          }

          if (e.querySelector('.wc-pct-data')) {
            e.querySelectorAll('tr').forEach(tr => {
              if (tr && tr.innerText && !manufacturerDescArr.includes(tr.innerText)) {
                manufacturerDescArr.push(tr.innerText);
              }
            });
          } else {
            manufacturerDescArr.push(e.innerText);
          }
        });
        mfgNode.querySelectorAll('iframe').forEach(e => {
          console.log('hasframehere');
          const frameContents = e.contentWindow.document.body;
          frameContents.querySelectorAll('h1, h2, h3, p, li').forEach(e => {
            if (!e.getAttribute('class') || (e.getAttribute('class') && !e.getAttribute('class').includes('vjs'))) {
              manufacturerDescArr.push(e.innerText);
            }
          });
          frameContents.querySelectorAll('img').forEach(e => {
            manufacturerImgs.push(e.src);
          });
          frameContents.querySelectorAll('video').forEach(e => {
            videos.push(e.src);
          });
          frameContents.querySelectorAll('.wc-thumb').forEach(async (e, ind) => {
            setTimeout(() => {
              if (e.querySelector('button')) {
                e.querySelector('img').click();
                if (frameContents.querySelector('.wc-video-container')) {
                  videos.push(frameContents.querySelector('.wc-video-container').querySelector('video').src);
                }
              }
            }, (ind * 500) + 500);
          });
        });

        manufacturerDesc = manufacturerDescArr.join(' ').replace(/See product page/g, '').replace(/\d options available/g, '');
        addImagesVideos(mfgNode);
      }

      addHiddenDiv(newDiv, 'pdf', hasTechnicalInfoPDF);

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }
      console.log('manufacturDesc', manufacturerDesc);

      if (!manufacturerDesc && mfgNode) {
        manufacturerDesc = mfgNode.innerText;
        addImagesVideos(mfgNode);
      }
      if (manufacturerDesc === 'Loading, please wait...') {
        let syndiNode = document.querySelector('div[class="syndi_powerpage syndigo-shadowed-powerpage"]');
        if (syndiNode) {
          const shadow = syndiNode.shadowRoot;
          if (shadow) {
            let syndiNode1 = shadow.querySelector('div');
            if (syndiNode1) {
              manufacturerDesc = syndiNode1.innerText;
              addImagesVideos(syndiNode1);
            }
          }
        }
      }

      if (manufacturerDesc && manufacturerDesc !== 'Loading, please wait...') {
        addHiddenDiv(newDiv, 'manufacturerDesc', manufacturerDesc);
      }
      console.log('manufacturDesc', manufacturerDesc);
      addHiddenDiv(newDiv, 'manufacturerImgs', manufacturerImgs.filter(img => !img.includes('/assets/') && !img.includes('/resources/')).filter(onlyUnique).join('|'));
      console.log('manufacturimgs', manufacturerImgs);

      console.log('continuing...');
      if (videos.length) {
        await stall(5000);
      }
      addHiddenDiv(newDiv, 'videos', videos.filter(onlyUnique).join(' | '));

      await fetch('https://redsky.target.com/redsky_aggregations/v1/web/pdp_fulfillment_v1?key=ff457966e64d5e877fdbad070f276d18ecec4a01&tcin=' + variant.tcin + '&store_id=281&zip=54166&state=WI&latitude=44.780&longitude=-88.540&pricing_store_id=281&fulfillment_test_mode=grocery_opu_team_member_test')
        .then(data => data.json())
        .then(availabilityData => {
          addHiddenDiv(newDiv, 'availabilityJson', JSON.stringify(availabilityData));
          console.log('availabilityData', availabilityData);
        });

      await fetch('https://redsky.target.com/v3/pdp/tcin/' + variant.tcin + '?excludes=taxonomy%2Cbulk_ship%2Cawesome_shop%2Cquestion_answer_statistics%2Crating_and_review_reviews%2Crating_and_review_statistics%2Cdeep_red_labels%2Cin_store_location%2Cavailable_to_promise_store%2Cavailable_to_promise_network&key=ff457966e64d5e877fdbad070f276d18ecec4a01&pricing_store_id=1901&storeId=1901&fulfillment_test_mode=grocery_opu_team_member_test')
        .then(response => response.json())
        .then(data => data.product.item.product_description.bullet_description.map(val => {
          return addHiddenDiv(newDiv, 'specificationsdiv', val);
        }));

      var query = document.evaluate('//div[@class="Col-favj32-0 hezhbt h-padding-h-default"]/div/b/parent::div', document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
      var results = Array(query.snapshotLength).fill(0).map((element, index) => query.snapshotItem(index).innerText);
      results.map(val => {
        return addHiddenDiv(newDiv, 'specificationsdiv', val);
      });

      await fetch('https://redsky.target.com/web/pdp_location/v1/tcin/' + variant.tcin + '?pricing_store_id=1465&key=eb2551e4accc14f38cc42d32fbc2b2ea')
        .then(data => data.json())
        .then(variantData => {
          console.log('pricingData', variantData);
          if (variantData.price) {
            if (variantData.price.current_retail || variantData.price.formatted_current_price) {
              addHiddenDiv(newDiv, 'price', variantData.price.current_retail || variantData.price.formatted_current_price);
            }
            // if (variantData.price.reg_retail) {
            //   addHiddenDiv(newDiv, 'regPrice', variantData.price.reg_retail);
            // }
            // if (variantData.price.save_dollar) {
            //   addHiddenDiv(newDiv, 'promotion', 'Save $' + variantData.price.save_dollar.toFixed(2) + ' ' + variantData.price.save_percent + '%' + ' off');
            // }
          }
        });

      await fetch('https://redsky.target.com/v3/pdp/tcin/' + variant.tcin + '?pricing_store_id=1465&key=eb2551e4accc14f38cc42d32fbc2b2ea')
        .then(data => data.json())
        .then(variantData => {
          console.log('pricingData', variantData);
          if (variantData.price) {
            if (variantData.price.current_retail || variantData.price.formatted_current_price) {
              addHiddenDiv(newDiv, 'price', variantData.price.current_retail || variantData.price.formatted_current_price);
            }
          }
        });

      if (!document.getElementById('price') || !document.getElementById('price').innerText.length) {
        if (document.querySelector('span[data-test="product-savings"]') && document.querySelector('span[data-test="product-savings"]').innerText) {
          addHiddenDiv(newDiv, 'regPrice', document.querySelector('span[data-test="product-savings"]').innerText.split(' ')[1]);
        } else if (document.querySelector('div[data-test="product-price"]')) {
          addHiddenDiv(newDiv, 'regPrice', document.querySelector('div[data-test="product-price"]').innerText);
        }
        addHiddenDiv(newDiv, 'price', document.querySelector('div[data-test="product-price"]').innerText.split(' ')[0]);
        if (document.querySelector('span[data-test="product-savings"]') && document.querySelector('span[data-test="product-savings"]').innerText) {
          addHiddenDiv(newDiv, 'promotion', 'Save ' + document.querySelector('span[data-test="product-savings"]').innerText.split('Save')[1]);
        }
      }

      if (document.querySelector('span[data-test="product-savings"]')) {
        addHiddenDiv(newDiv, 'listPrice', document.querySelector('span[data-test="product-savings"]').innerText.split(' ')[1]);
      }

      if (document.querySelector('.RatingSummary__StyledRating-bxhycp-0')) {
        const averageRating = document.querySelector('.RatingSummary__StyledRating-bxhycp-0').innerText;
        addHiddenDiv(newDiv, 'aggregateRating', (Math.round(averageRating * 10) / 10));
        addHiddenDiv(newDiv, 'aggregateRatingText', (Math.round(averageRating * 10) / 10) + ' out of 5');
      } else {
        addHiddenDiv(newDiv, 'aggregateRating', '0');
      }

      if (document.querySelector('span[data-test="ratingCount"]')) {
        addHiddenDiv(newDiv, 'ratingCount', document.querySelector('span[data-test="ratingCount"]').innerText);
      }
    }

    const newDiv = document.createElement('ul');
    newDiv.setAttribute('id', 'mainContainer');
    newDiv.style.display = 'none';
    document.body.appendChild(newDiv);

    const splitUrl = window.location.href.split('-');
    const fUrl = 'https://redsky.target.com/v3/pdp/tcin/';
    const urlVars = '?excludes=taxonomy%2Cbulk_ship%2Cawesome_shop%2Cquestion_answer_statistics%2Crating_and_review_reviews%2Crating_and_review_statistics%2Cdeep_red_labels%2Cin_store_location%2Cavailable_to_promise_store%2Cavailable_to_promise_network&key=eb2551e4accc14f38cc42d32fbc2b2ea&fulfillment_test_mode=grocery_opu_team_member_test';
    const fullUrl = fUrl + splitUrl[splitUrl.length - 1].split('#')[0] + urlVars;
    let parentId;
    await fetch(`${fullUrl}`)
      .then(data => data.json())
      .then(async function (res) {
        parentData = res;
        origData = res;
        if (res && res.product && res.product.item && res.product.item.parent_items && !isNaN(res.product.item.parent_items)) {
          parentId = res.product.item.parent_items;
          getProductInfo(res.product.item, res.product.item.product_description.title);
          await fetch('https://redsky.target.com/v3/pdp/tcin/' + parentId + '?excludes=taxonomy%2Cbulk_ship%2Cawesome_shop%2Cquestion_answer_statistics%2Crating_and_review_reviews%2Crating_and_review_statistics%2Cdeep_red_labels%2Cin_store_location%2Cavailable_to_promise_store%2Cavailable_to_promise_network&key=eb2551e4accc14f38cc42d32fbc2b2ea&fulfillment_test_mode=grocery_opu_team_member_test')
            .then(data => data.json())
            .then(async function (parentRes) {
              parentData = parentRes;
              parentRes.product.item.child_items.forEach(async (variant) => {
                await getProductInfo(variant, parentRes.product.item.product_description.title, parentRes.product.item.child_items.length);
              });
            });
        } else if (res && res.product && res.product.item && res.product.item.child_items) {
          for (const variant of res.product.item.child_items) {
            await getProductInfo(variant, res.product.item.product_description.title, res.product.item.child_items.length);
          }
        } else if (res && res.product && res.product.item) {
          console.log('noVariants');
          await getProductInfo(res.product.item, res.product.item.product_description.title);
        }
      });

    await stall(12000);
  });

  await context.extract(productDetails, { transform });
}

const { transform } = require('./shared');
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
