
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  const currentUrl = await context.evaluate(function() {
    return window.location.href;
  });

  await context.waitForXPath("//li[@class='Col-favj32-0 diyyNr h-padding-a-none h-display-flex']");
  const productId = await context.evaluate(function() {

      const link = document.querySelector('.Link-sc-1khjl8b-0.h-display-block');
      if (link !== null) {
        const href = link.getAttribute('href');
        if (href.indexOf('?preselect=') > -1) {
          const splitUrl = href.split('-');
          const endOfUrl = splitUrl[splitUrl.length - 1];
          let productId = endOfUrl.split('?preselect=')[0];
          console.log('productis...', productId);
          return productId;
        }
      }

    return window.location.href.split('=')[1];
  });

  await context.goto('https://scontent.webcollage.net?productId=' + productId + '#[!opt!]{"type":"js","init_js":""}[/!opt!]');

  const enhancedHTML = await context.evaluate(async function() {
    const splitUrl = window.location.href.split('=')[1];
    const productId = splitUrl.split('#')[0];
    return await fetch('https://scontent.webcollage.net/target/power-page?ird=true&channel-product-id=' + productId)
    .then(data => data.text())
    .then(res => {
      const regex = /html: "(.+)"\n\s\s\}\n\}\;/s
      const match = res.match(regex);
      if(match && match.length > 1) {
        return res.match(regex)[1];
      }
      return '';
    });
  });

  await context.goto(currentUrl);

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

  await context.evaluate(function(html) {

    const newDiv = document.createElement('div');
    newDiv.id = "enhancedHtml";
    let nodeArrayRegex = />([a-zA-Z 0-9\.\-\&\!\@\#\$\%\^\*\;\,\:\(\)\=\+\?\\\/\']{2,})</g
    let text = html.match(nodeArrayRegex)
    if (text) {
      let extractedText = text.join(' ').replace(/>/g,'').replace(/</g,'').replace(/\&amp\;/g, '&').replace(/  /g,' ').replace(/&#174;/g,'®').replace(/\\/g,'').replace(/&#8217;/g,`'`).replace(/&#8224;/g,'†').trim();
      console.log('extractinggg', extractedText);
      newDiv.innerHTML = extractedText;
      document.body.appendChild(newDiv);
    }

    const newDiv2 = document.createElement('div');
    newDiv2.id = "mediaHtml";
    newDiv2.innerHTML = unescape(html.replace(/\\\\\\/g, '').replace(/\\/g,'')).replace(/\"/g,'').replace(/"""/g, '');
    document.body.appendChild(newDiv2);

  }, enhancedHTML);

  await context.waitForXPath("//h1[@data-test='product-title']");

  await context.evaluate(async function () {
    let parentData = {};

    function addHiddenDiv (el, className, content) {
      const newDiv = document.createElement('div');
      newDiv.setAttribute('class', className);
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      el.appendChild(newDiv);
    }

    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }

    function createListItem () {
      const newDiv = document.createElement('li');
      newDiv.setAttribute('class', 'productInfo');
      newDiv.textContent = '';
      newDiv.style.display = 'none';
      document.getElementById('mainContainer').appendChild(newDiv);
      return newDiv;
    }

    function decodeHtml(html) {
      const txt = document.createElement("textarea");
      txt.innerHTML = html;
      return txt.value;
    }

    let scrollTop = 500;
    while (true) {
      window.scroll(0, scrollTop);
      await stall(200);
      scrollTop += 500;
      if (scrollTop === 8000) {
        break;
      }
    }

    await stall(50);
    const manufacturerCTA = document.querySelector('.Button-bwu3xu-0.styles__ShowMoreButton-zpxf66-2.h-padding-t-tight');
    if (manufacturerCTA) {
      manufacturerCTA.click();
    }
    await stall(1000);
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

    async function getProductInfo (variant, productName, variantCount = null) {
      const newDiv = createListItem();

      addHiddenDiv(newDiv, 'productName', productName);

      if (variant.enrichment && variant.enrichment.images && variant.enrichment.images.length) {
        addHiddenDiv(newDiv, 'primaryImage', variant.enrichment.images[0].base_url + variant.enrichment.images[0].primary);
        if (variant.enrichment.images[0] && variant.enrichment.images[0].alternate_urls && variant.enrichment.images[0].alternate_urls.length) {
          const secondaryImages = variant.enrichment.images[0].alternate_urls.map(image => variant.enrichment.images[0].base_url.replace('https', 'http') + image);
          addHiddenDiv(newDiv, 'secondaryImages', secondaryImages.join(' | '));
        } else if (variant.enrichment.images[0].content_labels && variant.enrichment.images[0].content_labels.length) {
          const secondaryImages = variant.enrichment.images[0].content_labels.filter((image, ind) => image.image_url != variant.enrichment.images[0].primary && image.image_url != variant.enrichment.images[0].swatch).map(image => variant.enrichment.images[0].base_url.replace('https', 'http') + image.image_url);
          addHiddenDiv(newDiv, 'secondaryImages', secondaryImages.join(' | '));
        }
      }

      let videos = [];
      if (parentData.product.item.enrichment &&
        parentData.product.item.enrichment.videos &&
        parentData.product.item.enrichment.videos.length &&
        parentData.product.item.enrichment.videos[0] &&
        parentData.product.item.enrichment.videos[0].video_files) {
        videos = parentData.product.item.enrichment.videos[0].video_files.map(video => 'https:' + video.video_url);
      }

      if (!videos.length &&
        variant.enrichment.videos &&
        variant.enrichment.videos.length &&
        variant.enrichment.videos[0] &&
        variant.enrichment.videos[0].video_files) {
        videos = variant.enrichment.videos[0].video_files.map(video => 'https:' + video.video_url);
      }

      const productTitle = document.querySelector('h1[data-test="product-title"]').innerText;
      if (variant.variation_info && variant.variation_info.themes) {
        addHiddenDiv(newDiv, 'imageAlt', productTitle + ' ' + variant.variation_info.themes.map(theme => theme.value).join(' '));
      } else {
        addHiddenDiv(newDiv, 'imageAlt', productTitle);
      }

      if (productTitle && variant.variation_info && variant.variation_info.themes) {
        addHiddenDiv(newDiv, 'nameExtended', decodeHtml(productTitle) + ' ' + variant.variation_info.themes[0].value);
      } else {
        addHiddenDiv(newDiv, 'nameExtended', decodeHtml(productTitle));
      }

      if(variant.product_description && variant.product_description.title) {
        addHiddenDiv(newDiv, 'keywords', decodeHtml(variant.product_description.title));
      }

      addHiddenDiv(newDiv, 'timeStamp', new Date());

      const splitUrl = window.location.href.split('-');
      splitUrl[splitUrl.length - 1] = variant.tcin;
      addHiddenDiv(newDiv, 'productUrl', splitUrl.join('-'));

      let description = '';
      if (variant.product_description && variant.product_description.soft_bullets && variant.product_description.soft_bullets.bullets && variant.product_description.soft_bullets.bullets.length) {
        description = '|| ' + decodeHtml(variant.product_description.soft_bullets.bullets.join(' || ')) + ' ';
        addHiddenDiv(newDiv, 'descriptionBullets', variant.product_description.soft_bullets.bullets.length);
      }
      if(description.length || (variant.product_description && variant.product_description.downstream_description)) {
        addHiddenDiv(newDiv, 'description', description + decodeHtml(variant.product_description.downstream_description.replace('<br />', ' ').replace(/(<([^>]+)>)/ig, ' ')));
      }

      const ingredients = [];
      if (variant.enrichment && variant.enrichment.nutrition_facts && variant.enrichment.nutrition_facts.ingredients) {
        ingredients.push(variant.enrichment.nutrition_facts.ingredients);
      }
      if (variant.enrichment && variant.enrichment.drug_facts && variant.enrichment.drug_facts.ingredients) {
        ingredients.push(variant.enrichment.drug_facts.ingredients);
      }
      if (variant.enrichment && variant.enrichment.drug_facts && variant.enrichment.drug_facts.inactive_ingredients) {
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
        addHiddenDiv(newDiv, 'upc', variant.upc);
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
        if (variant.enrichment.drug_facts.direction && variant.enrichment.drug_facts.direction.general_directions && variant.enrichment.drug_facts.direction.general_directions.length) {
          addHiddenDiv(newDiv, 'directions', variant.enrichment.drug_facts.direction.general_directions[0]);
        }
        if (variant.enrichment.drug_facts.warning && variant.enrichment.drug_facts.warning.text) {
          addHiddenDiv(newDiv, 'warnings', variant.enrichment.drug_facts.warning.text);
        }
      }

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
          addHiddenDiv(newDiv, 'servingSize', variant.enrichment.nutrition_facts.value_prepared_list[0].serving_size);
          addHiddenDiv(newDiv, 'servingSizeUom', variant.enrichment.nutrition_facts.value_prepared_list[0].serving_size_unit_of_measurement);
          addHiddenDiv(newDiv, 'servingsPerContainer', variant.enrichment.nutrition_facts.value_prepared_list[0].servings_per_container);
        }

        if (variant.enrichment.nutrition_facts.value_prepared_list[0].nutrients) {
          variant.enrichment.nutrition_facts.value_prepared_list[0].nutrients.forEach(e => {
            if (e.name === 'Calories') {
              addHiddenDiv(newDiv, 'caloriesPerServing', e.quantity || e.percentage || '0');
            }
            if (e.name === 'Calories From Fat') {
              addHiddenDiv(newDiv, 'caloriesFromFat', e.quantity || e.percentage || '0');
            }
            if (e.name === 'Total Fat') {
              addHiddenDiv(newDiv, 'totalFatPerServing', e.quantity || e.percentage || '0');
              addHiddenDiv(newDiv, 'totalFatPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Saturated Fat') {
              addHiddenDiv(newDiv, 'saturatedFatPerServing', e.quantity || e.percentage || '0');
              addHiddenDiv(newDiv, 'saturatedFatPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Trans Fat') {
              addHiddenDiv(newDiv, 'transFatPerServing', e.quantity || e.percentage || '0');
              addHiddenDiv(newDiv, 'transFatPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Cholesterol') {
              addHiddenDiv(newDiv, 'cholesterolPerServing', e.quantity || e.percentage || '0');
              addHiddenDiv(newDiv, 'cholesterolPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Sodium') {
              addHiddenDiv(newDiv, 'sodiumPerServing', e.quantity || e.percentage || '0');
              addHiddenDiv(newDiv, 'sodiumPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Total Carb.' || e.name === 'Total Carbohydrate') {
              addHiddenDiv(newDiv, 'totalCarbPerServing', e.quantity || e.percentage || '0');
              addHiddenDiv(newDiv, 'totalCarbPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Dietary Fiber') {
              addHiddenDiv(newDiv, 'dietaryFibrePerServing', e.quantity || e.percentage || '0');
              addHiddenDiv(newDiv, 'dietaryFibrePerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Sugars') {
              addHiddenDiv(newDiv, 'totalSugarsPerServing', e.quantity || e.percentage || '0');
              addHiddenDiv(newDiv, 'totalSugarsPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Protein') {
              addHiddenDiv(newDiv, 'proteinPerServing', e.quantity || e.percentage || '0');
              addHiddenDiv(newDiv, 'proteinPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Vitamin A') {
              addHiddenDiv(newDiv, 'vitaminAPerServing', e.quantity || e.percentage || '0');
              addHiddenDiv(newDiv, 'vitaminAPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Vitamin C') {
              addHiddenDiv(newDiv, 'vitaminCPerServing', e.quantity || e.percentage || '0');
              addHiddenDiv(newDiv, 'vitaminCPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Calcium') {
              addHiddenDiv(newDiv, 'calciumPerServing', e.quantity || e.percentage || '0');
              addHiddenDiv(newDiv, 'calciumPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Iron') {
              addHiddenDiv(newDiv, 'ironPerServing', e.quantity || e.percentage || '0');
              addHiddenDiv(newDiv, 'ironPerServingUom', e.unit_of_measurement || '%');
            }
            if (e.name === 'Magnesium') {
              addHiddenDiv(newDiv, 'magnesiumPerServing', e.quantity || e.percentage || '0');
              addHiddenDiv(newDiv, 'magnesiumPerServingUom', e.unit_of_measurement || '%');
            }
          });
        }

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

      const moreImageBtn = document.querySelector('.styles__LegendGridButtonOverlay-beej2j-13');
      if (moreImageBtn) {
        moreImageBtn.click();
        await stall(100);
        const slideDeck = document.querySelector('.ZoomedSlideDeck__SlideList-sc-1nqe9sx-0');
        if (slideDeck) {
          console.log('has slide deck!');
          slideDeck.querySelectorAll('.ZoomedSlide__Image-sc-10kwhw6-0').forEach(async (e, ind) => {
            if (e && e.getAttribute('src') && ((e.getAttribute('alt') && e.getAttribute('alt').indexOf('- video') > -1) || e.getAttribute('type') === 'video')) {
              videos.push(e.getAttribute('src').split('?')[0].replace('image', 'content') + '_Flash9_Autox720p_2600k');
            }
          });
        }
      } else {
        const sideImages = document.querySelectorAll('.styles__ThumbnailImage-beej2j-11');
        if (sideImages) {
          sideImages.forEach((e, ind) => {
            if (e && e.getAttribute('src') && ((e.getAttribute('alt') && e.getAttribute('alt').indexOf('- video') > -1) || e.getAttribute('type') === 'video')) {
              videos.push(e.getAttribute('src').split('?')[0].replace('image', 'content') + '_Flash9_Autox720p_2600k');
            }
          });
        }
      }

      let manufacturerDesc = '';
      const manufacturerImgs = [];
      const manufacturerCTA = document.querySelector('.Button-bwu3xu-0.styles__ShowMoreButton-zpxf66-2.h-padding-t-tight');
      const frameContents = document.getElementById('frameContents');
      await stall(2000);
      if (frameContents) {
        console.log('hasFrameContents', frameContents.innerText);
        manufacturerDesc = frameContents.innerText;
        frameContents.querySelectorAll('img').forEach(e => {
          manufacturerImgs.push(e.getAttribute('src'));
        });
        frameContents.querySelectorAll('video').forEach(e => {
          videos.push(e.src);
        });
      } else if (manufacturerCTA) {
        if(document.getElementById('wc-power-page')) {
          console.log('haspowerpage');
          document.getElementById('wc-power-page').querySelectorAll('iframe').forEach(e => {
            const frameContents = e.contentWindow.document.body;
            frameContents.querySelectorAll('img').forEach(img => {
              manufacturerImgs.push(img.src);
            });
          });
        }
        if (document.getElementById('wc-power-page') && document.getElementById('wc-power-page').innerText) {
          console.log('wcframes!', document.querySelectorAll('.wc-fragment').length);
          const manufacturerDescArr = [];
          document.querySelectorAll('.wc-fragment').forEach(e => {
            if (e.querySelector('.wc-pct-data')) {
              e.querySelectorAll('tr').forEach(tr => {
                if (tr.innerText && !manufacturerDescArr.includes(tr.innerText)) {
                  manufacturerDescArr.push(tr.innerText);
                }
              });
            } else {
              manufacturerDescArr.push(e.innerText);
            }
          });
          manufacturerDesc = manufacturerDescArr.join(' ').replace(/See product page/g, '').replace(/\d options available/g, '');
          if(!manufacturerDescArr.length) {
            manufacturerDesc = document.getElementById('wc-power-page').innerText;
          }
          document.querySelectorAll('img.wc-media.wc-image').forEach(e => {
            console.log('wcimagehere', e.src);
            manufacturerImgs.push(e.src);
          });
          const aplusBody = document.querySelector('.wc-product-image-row');
          if (aplusBody) {
            aplusBody.querySelectorAll('.wc-pct-product-image').forEach(e => {
              manufacturerImgs.push(e.src);
            });
          }
          document.getElementById('wc-power-page').querySelectorAll('video').forEach(e => {
            videos.push(e.src);
          });
        }
      }

      if (document.getElementById('mediaHtml') && document.getElementById('mediaHtml').innerHTML) {
        document.getElementById('mediaHtml').querySelectorAll('img').forEach(e => {
          manufacturerImgs.push(e.src);
        });
      }

      function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
      }

      if (document.getElementById('enhancedHtml') &&
        document.getElementById('enhancedHtml').innerText &&  document.getElementById('enhancedHtml').innerText.trim().length) {
        addHiddenDiv(newDiv, 'manufacturerDesc', document.getElementById('enhancedHtml').innerText);
      } else {
        addHiddenDiv(newDiv, 'manufacturerDesc', manufacturerDesc);
      }

      const mediaImages = [];
      let scrapedWcCollage = false;
      if(document.getElementById('mediaHtml')) {

        let path = "";

        if (document.querySelector('.wc-video-gallery')) {
          path = document.querySelector('.wc-video-gallery').getAttribute('data-resources-base');
        }

        const mediaData = document.getElementById('mediaHtml').querySelectorAll('.wc-json-data').forEach(e => {

          if (e.innerHTML.includes('images:[{')) {
            const splitMediaData = e.innerHTML.split('src:');
            for(let data of splitMediaData) {
              if (data.includes(',width:') && !data.includes('.web')) {
                let splitmediaString = data.split(',');
                let mediaPath = splitmediaString[0];
                if (mediaPath.charAt(0) === '/') {
                  mediaPath = mediaPath.substring(1);
                }
                if (mediaPath.includes('cp/')) {
                  scrapedWcCollage = true;
                  const path = manufacturerImgs[0].split('_cp/')[0];
                  manufacturerImgs.push(path + '_' + mediaPath.substring(1));
                }
              }
            }
          }

          if (e.innerHTML.includes('videos:[{')) {
            const splitMediaData = e.innerHTML.split('src:');
            for(let data of splitMediaData) {
              if (data.includes('.mp4full.mov')) {
                let splitvideoString = data.split('.mp4full.mov');
                let videoPath = splitvideoString[0];
                if (videoPath.charAt(0) === '/') {
                  videoPath = videoPath.substring(1);
                }
                videos.push(path + videoPath + '.mp4full.mov');
              }
              if (data.includes('.mp4full.mp4')) {
                let splitvideoString = data.split('.mp4full.mp4');
                let videoPath = splitvideoString[0];
                if (videoPath.charAt(0) === '/') {
                  videoPath = videoPath.substring(1);
                }
                videos.push(path + videoPath + '.mp4full.mp4');
              }
            }
          }

        });
      }

      if (manufacturerImgs.length && scrapedWcCollage) {
        const finalImages = [];
        manufacturerImgs.forEach(img => {
          let imgString = '';
          if (img.includes('.jpg')) {
            imgString = img.split('.jpg')[0];
          } else if (img.includes('.png')) {
            imgString  = img.split('.png')[0];
          }
          const splitImgString = imgString.split('/');
          const finalImageString = splitImgString[splitImgString.length - 1];
          console.log('finalImageString9', finalImageString);
          let hasImage = false;
          for (let image of finalImages) {
            if(image.includes(finalImageString)) {
              hasImage = true;
            }
          }
          if(!hasImages) {
            finalImages.push(img);
          }
        });
        addHiddenDiv(newDiv, 'manufacturerImgs', finalImages.filter(onlyUnique).join('|'));
      } else {
        addHiddenDiv(newDiv, 'manufacturerImgs', manufacturerImgs.filter(img => !img.includes('//_cp')).filter(onlyUnique).join('|'));
      }

      addHiddenDiv(newDiv, 'videos', videos.filter(onlyUnique).join(' | '));

      await fetch('https://redsky.target.com/redsky_aggregations/v1/web/pdp_fulfillment_v1?key=eb2551e4accc14f38cc42d32fbc2b2ea&tcin=' + variant.tcin + '&store_id=1465&zip=54166&state=WI&latitude=44.780&longitude=-88.540&pricing_store_id=1465&fulfillment_test_mode=grocery_opu_team_member_test')
        .then(data => data.json())
        .then(availabilityData => {
          let inStore = false;
          let deliver = false;
          if (availabilityData &&
          availabilityData.data &&
          availabilityData.data.product &&
          availabilityData.data.product.fulfillment) {
            if (availabilityData.data.product.fulfillment.store_options &&
                availabilityData.data.product.fulfillment.store_options.length) {
                  availabilityData.data.product.fulfillment.store_options.forEach(store => {
                    if(store.in_store_only.availability_status === 'IN_STOCK') {
                      inStore = true;
                    }
                  });
            }

            if (availabilityData.data.product.fulfillment.shipping_options &&
                availabilityData.data.product.fulfillment.shipping_options.availability_status === 'IN_STOCK') {
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
              addHiddenDiv(newDiv, 'promotion', 'Save $' + variantData.price.save_dollar.toFixed(2) + ' ' + variantData.price.save_percent + '%' + ' off');
            }
          }
        });

      await fetch('https://redsky.target.com/v3/pdp/tcin/' + variant.tcin + '?excludes=taxonomy%2Cavailable_to_promise_store%2Cavailable_to_promise_network&key=eb2551e4accc14f38cc42d32fbc2b2ea&pricing_store_id=1465&storeId=1465&fulfillment_test_mode=grocery_opu_team_member_test')
        .then(data => data.json())
        .then(ratingData => {
          if (ratingData.product &&
          ratingData.product.rating_and_review_statistics &&
          ratingData.product.rating_and_review_statistics.result &&
          ratingData.product.rating_and_review_statistics.result[variant.tcin] &&
          ratingData.product.rating_and_review_statistics.result[variant.tcin].coreStats &&
          ratingData.product.rating_and_review_statistics.result[variant.tcin].coreStats.RatingReviewTotal) {
            addHiddenDiv(newDiv, 'ratingCount', ratingData.product.rating_and_review_statistics.result[variant.tcin].coreStats.RatingReviewTotal);
            addHiddenDiv(newDiv, 'aggregateRating', ratingData.product.rating_and_review_statistics.result[variant.tcin].coreStats.AverageOverallRating);
            addHiddenDiv(newDiv, 'aggregateRatingText', ratingData.product.rating_and_review_statistics.result[variant.tcin].coreStats.AverageOverallRating + ' out of 5');
          }
        });
    }

    const newDiv = document.createElement('ul');
    newDiv.setAttribute('id', 'mainContainer');
    newDiv.style.display = 'none';
    document.body.appendChild(newDiv);

    const splitUrl = window.location.href.split('-');
    const fUrl = 'https://redsky.target.com/v3/pdp/tcin/';
    const urlVars = '?excludes=taxonomy%2Cbulk_ship%2Cawesome_shop%2Cquestion_answer_statistics%2Crating_and_review_reviews%2Crating_and_review_statistics%2Cdeep_red_labels%2Cin_store_location%2Cavailable_to_promise_store%2Cavailable_to_promise_network&key=eb2551e4accc14f38cc42d32fbc2b2ea&pricing_store_id=1465&storeId=1465&fulfillment_test_mode=grocery_opu_team_member_test';
    const fullUrl = fUrl + splitUrl[splitUrl.length - 1].split('#')[0] + urlVars;

    await fetch(`${fullUrl}`)
      .then(data => data.json())
      .then(async function (res) {
        parentData = res;
        if (res.product.item.parent_items && !isNaN(res.product.item.parent_items)) {
          const parentId = res.product.item.parent_items;
            getProductInfo(res.product.item, res.product.item.product_description.title);
            await fetch('https://redsky.target.com/v3/pdp/tcin/' + parentId + '?excludes=taxonomy%2Cbulk_ship%2Cawesome_shop%2Cquestion_answer_statistics%2Crating_and_review_reviews%2Crating_and_review_statistics%2Cdeep_red_labels%2Cin_store_location%2Cavailable_to_promise_store%2Cavailable_to_promise_network&key=eb2551e4accc14f38cc42d32fbc2b2ea&pricing_store_id=1465&storeId=1465&fulfillment_test_mode=grocery_opu_team_member_test')
            .then(data => data.json())
            .then(async function (parentRes) {
              parentData = parentRes;
              console.log('hasvariants', parentRes.product.item.child_items.length)
              for (const variant of parentRes.product.item.child_items) {
                getProductInfo(variant, parentRes.product.item.product_description.title, parentRes.product.item.child_items.length);
              }
            });
        } else if (res.product.item.child_items) {
          for (const variant of res.product.item.child_items) {
            getProductInfo(variant, res.product.item.product_description.title, res.product.item.child_items.length);
          }
        } else {
          console.log('noVariants');
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
