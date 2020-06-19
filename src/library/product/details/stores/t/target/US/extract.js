
async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  if(inputs.zipcode) {
    await context.evaluate(async function() {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }
      document.getElementById('storeId-utilityNavBtn').click();
      await stall(1000);
    });
    await context.setInputValue('#zipOrCityState', '32955');
    await context.evaluate(async function() {
      document.querySelector('button[data-test="storeLocationSearch-button"]').click();
    });
    await context.waitForXPath("//button[@data-test='storeId-listItem-setStore']");
    await context.evaluate(function () {
        document.querySelectorAll('button[data-test="storeId-listItem-setStore"]')[0].click();
    });
  }

  await context.waitForXPath("//li[@class='Col-favj32-0 diyyNr h-padding-a-none h-display-flex']");

  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    await stall(1000);
    const link = document.querySelector('.Link-sc-1khjl8b-0.h-display-block');
    if (link != null) {
      link.click();
    }
  });

  await context.waitForXPath("//div[@data-test='product-price']");
  await context.evaluate(async function () {
    location.reload();
  });
  await context.waitForXPath("//div[@data-test='product-price']");

  let variantProductCount = await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    window.scroll(0, 300);
    await stall(2000);
    if (document.querySelector('button[data-test="SelectVariationSelector-color"]')) {
      if (!document.getElementById('options')) {
        document.querySelector('button[data-test="SelectVariationSelector-color"]').click();
      }
      await stall(500);
      const options = document.getElementById('options');
      const newDiv = document.createElement('div');
      newDiv.id = 'btnIndex';
      newDiv.textContent = -1;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      options.querySelectorAll('a')[0].click();
      return options.querySelectorAll('a').length;
    }
    let variantProductBtns = document.querySelectorAll('.StyledButton__VariationButton-qhksha-0');
    if (!variantProductBtns.length) {
      variantProductBtns = document.querySelectorAll('.SwatchButton-sc-18yljzc-0');
    }
    if (variantProductBtns.length) {
      const newDiv = document.createElement('div');
      newDiv.id = 'btnIndex';
      newDiv.textContent = -1;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
      variantProductBtns[0].click();
      return variantProductBtns.length;
    }
    return 0;
  });
  console.log('variations', variantProductCount);
  if (variantProductCount === 0) {
    variantProductCount = 1;
  }

  const extractedData = [];
  for (let i = 0; i < variantProductCount; i++) {
    const canContinue = await context.evaluate(async function () {
      if (document.querySelector('button[data-test="SelectVariationSelector-color"]')) {
        if (!document.getElementById('options')) {
          document.querySelector('button[data-test="SelectVariationSelector-color"]').click();
        }
        const options = document.getElementById('options');
        console.log('options', options.querySelectorAll('a'));
        if (options.querySelectorAll('a')[parseInt(document.getElementById('btnIndex').innerHTML) + 1]) {
          return true;
        }
      }
      let variants = document.querySelectorAll('.StyledButton__VariationButton-qhksha-0');
      if (!variants.length) {
        variants = document.querySelectorAll('.SwatchButton-sc-18yljzc-0');
      }
      if (variants.length && !variants[parseInt(document.getElementById('btnIndex').innerHTML) + 1]) {
        return false;
      }
      return true;
    });

    if (!canContinue) {
      break;
    }

    await context.evaluate(async function () {
      function addHiddenDiv (id, content) {
        if (document && document.getElementById(id)) {
          document.getElementById(id).innerHTML = content;
          return;
        }
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      if (document.querySelector('button[data-test="SelectVariationSelector-color"]')) {
        if (!document.getElementById('options')) {
          document.querySelector('button[data-test="SelectVariationSelector-color"]').click();
        }
        const options = document.getElementById('options');
        addHiddenDiv('colorInfo', options.querySelectorAll('a')[parseInt(document.getElementById('btnIndex').innerHTML) + 1].getAttribute('aria-label').split('-')[0].replace('color', '').trim());
        options.querySelectorAll('a')[parseInt(document.getElementById('btnIndex').innerHTML) + 1].click();
      } else {
        let variants = document.querySelectorAll('.StyledButton__VariationButton-qhksha-0');
        if (!variants.length) {
          variants = document.querySelectorAll('.SwatchButton-sc-18yljzc-0');
        }
        if (variants.length) {
          variants[parseInt(document.getElementById('btnIndex').innerHTML) + 1].click();
        }
        if (document.querySelector('div[data-test="variationTheme-color"]')) {
          addHiddenDiv('colorInfo', document.querySelector('div[data-test="variationTheme-color"]').innerText.replace('color', '').trim());
        }
      }

      window.scroll(0, 0);

      addHiddenDiv('dateStamp', new Date());
      addHiddenDiv('urlInfo', window.location.href);
      addHiddenDiv('productName', document.querySelector('h1[data-test="product-title"]').innerText.split('-')[0]);

      const desc = [];
      let descCount = 0;
      document.querySelectorAll('h3').forEach(e => {
        if (e && e.innerText === 'Highlights') {
          e.parentElement.querySelectorAll('li').forEach(li => {
            descCount++;
            desc.push(li.innerText);
          });
        }
      });
      let descText = '';
      document.querySelectorAll('h3').forEach(e => {
        if (e && e.innerText === 'Description') {
          descText = e.parentElement.querySelector('.h-margin-v-default').innerText;
        }
      });

      addHiddenDiv('bulletCount', descCount);
      addHiddenDiv('description', '|| ' + desc.join(' || ') + descText);

      const subCategories = [];
      const categoryDiv = document.querySelector('.h-text-sm.h-padding-v-tiny');
      categoryDiv.querySelectorAll('a').forEach(e => {
        subCategories.push(e.getAttribute('aria-label'));
      });
      addHiddenDiv('subCategories', subCategories.join(' > '));

      if (document.querySelector('span[data-test="product-savings"]')) {
        addHiddenDiv('regPriceInfo', document.querySelector('span[data-test="product-savings"]').innerText.split(' ')[1]);
      } else {
        addHiddenDiv('regPriceInfo', document.querySelector('div[data-test="product-price"]').innerText);
      }

      const materials = [];
      let quantity = 1;
      document.querySelector('a[href="#tabContent-tab-Details"]').click();
      if (document && document.querySelectorAll('b').length) {
        document.querySelectorAll('b').forEach(e => {
          if (e && e.innerText && (e.innerText.indexOf('UPC') > -1)) {
            addHiddenDiv('upcInfo', e.parentElement.innerText.replace('UPC: ', ''));
          }
          if (e && e.innerText && (e.innerText.indexOf('TCIN') > -1)) {
            addHiddenDiv('skuInfo', e.parentElement.innerText.split(':')[1]);
          }
          if (e && e.innerText && (e.innerText.indexOf('Item Number (DPCI)') === 0)) {
            addHiddenDiv('variantIdInfo', e.parentElement.innerText.split(':')[1]);
          }
          if (e && e.innerText && (e.innerText.indexOf('Contains:') === 0)) {
            addHiddenDiv('allergyAdviceInfo', e.parentElement.innerText.split(':')[1]);
          }
          if (e && e.innerText && (e.innerText.indexOf('Weight:') > -1 || e.innerText.indexOf('Net weight:') > -1)) {
            addHiddenDiv('weightInfo', e.parentElement.innerText.split(':')[1]);
          }
          if (e && e.innerText && e.innerText.indexOf('Warranty') > -1) {
            addHiddenDiv('warrantyInfo', e.parentElement.innerText.split(':')[1]);
          }
          if (e && e.innerText && e.innerText.indexOf('State of Readiness:') > -1) {
            addHiddenDiv('storageInfo', e.parentElement.innerText);
          }
          if (e && e.innerText && e.innerText.indexOf('Dimensions') > -1) {
            addHiddenDiv('dimensionsInfo', e.parentElement.innerText.split(':')[1]);
          }
          if (e && e.innerText && e.innerText.indexOf('p65warning') > -1) {
            addHiddenDiv('p65Info', e.parentElement.innerText.split(':')[1]);
          }
          if (e && e.innerText && e.innerText.indexOf('Quantity:') > -1) {
            quantity = e.innerText.split(':')[1];
          }
          if (e && e.innerText && e.innerText.indexOf('Number of') > -1) {
            addHiddenDiv('packSize', e.parentElement.innerText.split(':')[1]);
          }
          if (e && e.innerText && e.innerText.indexOf('Suggested Age:') > -1) {
            addHiddenDiv('ageInfo', e.parentElement.innerText.replace('Suggested Age: ', '').trim());
          }
          if (e && e.innerText && e.innerText.indexOf('Alcohol content:') > -1) {
            addHiddenDiv('alcoholInfo', e.parentElement.innerText.replace('Alcohol content: ', ''));
          }
          if (e && e.innerText && (e.innerText.indexOf('Material:') > -1 || e.innerText.indexOf('material:') > -1)) {
            const split = e.parentElement.innerText.split(':');
            materials.push(split[split.length - 1]);
          }
          if (e && e.innerText && e.innerText.indexOf('Net weight:') > -1) {
            addHiddenDiv('weightInfo', e.parentElement.innerText.replace('Net weight: ', ''));
          }
          if (e && e.innerText && (e.innerText.indexOf('WARNING:') > -1 || e.innerText.indexOf('warning') > -1)) {
            addHiddenDiv('warningInfo', e.parentElement.innerText.split(':')[1]);
          }
          if (e && e.innerText && e.innerText.indexOf('Disclaimer:') > -1) {
            addHiddenDiv('disclaimerInfo', e.parentElement.innerText.split(':')[1]);
          }
        });
      }
      if (materials.length) {
        addHiddenDiv('materialInfo', materials.join(', '));
      }
      addHiddenDiv('quantityInfo', quantity);

      const additionalInfo = [];
      document.querySelectorAll('.Col-favj32-0.RDgXb.h-padding-t-tight.h-padding-r-default').forEach(e => {
        additionalInfo.push(e.innerText);
      });
      addHiddenDiv('additionalInfo', additionalInfo.join(', '));

      const button = document.querySelector('#tab-ShippingReturns');
      if (button != null) {
        button.click();
        if (document && document.querySelector('div[data-test="shippingOptionsMessage"]')) {
          addHiddenDiv('shippingInfo', document.querySelector('div[data-test="shippingOptionsMessage"]').innerText);
        }

        if (document && document.querySelector('div[data-test="estimatedShipDimensions"]')) {
          addHiddenDiv('shipDimensionsInfo', document.querySelector('div[data-test="estimatedShipDimensions"]').innerText.replace('Estimated ship dimensions: ', ''));
        }

        if (document && document.querySelector('div[data-test="estimatedShipWeight"]')) {
          addHiddenDiv('shipWeightInfo', document.querySelector('div[data-test="estimatedShipWeight"]').innerText.replace('Estimated ship weight: ', ''));
        }
      }
    });

    await context.evaluate(async function () {
      function stall (ms) {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve();
          }, ms);
        });
      }

      function addHiddenDiv (id, content) {
        if (document && document.getElementById(id)) {
          document.getElementById(id).innerHTML = content;
          return;
        }
        const newDiv = document.createElement('div');
        newDiv.id = id;
        newDiv.textContent = content;
        newDiv.style.display = 'none';
        document.body.appendChild(newDiv);
      }

      const zoom = document.querySelector('.ZoomedImage__Zoomed-sc-1j8d1oa-0.dwtKdC');
      if (zoom) {
        addHiddenDiv('zoomInfo', 'Yes');
      } else {
        addHiddenDiv('zoomInfo', 'No');
      }

      const rotate = document.querySelector('button[data-test="button-model-viewer"]');
      if (rotate) {
        addHiddenDiv('rotateInfo', 'Yes');
      } else {
        addHiddenDiv('rotateInfo', 'No');
      }

      const button = document.querySelector("a[href='#tabContent-tab-Labelinfo']");
      if (button != null) {
        button.click();
        await stall(500);
        document.querySelectorAll('.h-margin-t-default.h-padding-h-default').forEach(e => {
          if (e && e.innerText && e.innerText.indexOf('Ingredients:') > -1) {
            addHiddenDiv('ingredientsInfo', e.innerText.replace('Ingredients: ', ''));
          }
        });
        document.querySelectorAll('p').forEach(e => {
          if (e && e.innerText && e.innerText.indexOf('Serving Size:') > -1) {
            addHiddenDiv('servingSizeInfo', e.innerText.replace('Serving Size: ', ''));
            const splitInfo = document.getElementById('servingSizeInfo').innerHTML.split(' ');
            addHiddenDiv('servingSizeUomInfo', splitInfo[splitInfo.length - 1]);
          }
          if (e && e.innerText && e.innerText.indexOf('Serving Per Container:') > -1) {
            addHiddenDiv('servingPerContainerInfo', e.innerText.replace('Serving Per Container: ', '').replace(/[a-zA-Z]/g, ''));
          }
        });
        document.querySelectorAll('.h-text-bold').forEach(e => {
          if (e && e.innerText && e.innerText.indexOf('Calories:') > -1) {
            addHiddenDiv('caloriesInfo', e.parentElement.innerText.replace('Calories: ', ''));
          }
          if (e && e.innerText && e.innerText.indexOf('Calories from Fat:') > -1) {
            addHiddenDiv('caloriesFromFatInfo', e.parentElement.innerText.replace('Calories from Fat: ', ''));
          }
        });
        document.querySelectorAll('.h-margin-t-tight').forEach(e => {
          if (e && e.innerText && e.innerText.indexOf('Total Fat') > -1) {
            addHiddenDiv('totalFatInfo', e.querySelector('span').innerText.replace('Total Fat', ''));
            addHiddenDiv('totalFatUomInfo', document.getElementById('totalFatInfo').innerHTML.replace('Total Fat', '').replace(/\*/g, '').replace('.', '').replace(/[0-9]/g, ''));
          }
          if (e && e.innerText && e.innerText.indexOf('Saturated Fat') > -1) {
            addHiddenDiv('saturatedFatInfo', e.querySelector('span').innerText.replace('Saturated Fat', ''));
            addHiddenDiv('saturatedFatUomInfo', e.querySelector('span').innerText.replace('Saturated Fat', '').replace('.', '').replace(/\*/g, '').replace(/[0-9]/g, ''));
          }
          if (e && e.innerText && e.innerText.indexOf('Trans Fat') > -1) {
            addHiddenDiv('transFatInfo', e.querySelector('span').innerText.replace('Trans Fat', ''));
            addHiddenDiv('transFatUomInfo', e.querySelector('span').innerText.replace('Trans Fat', '').replace('.', '').replace(/\*/g, '').replace(/[0-9]/g, ''));
          }
          if (e && e.innerText && e.innerText.indexOf('Cholesterol') > -1) {
            addHiddenDiv('cholesterolInfo', e.querySelector('span').innerText.replace('Cholesterol', ''));
            addHiddenDiv('cholesterolUomInfo', e.querySelector('span').innerText.replace('Cholesterol', '').replace('.', '').replace(/\*/g, '').replace(/[0-9]/g, ''));
          }
          if (e && e.innerText && e.innerText.indexOf('Sodium') > -1) {
            addHiddenDiv('sodiumInfo', e.querySelector('span').innerText.replace('Sodium ', ''));
            addHiddenDiv('sodiumUomInfo', e.querySelector('span').innerText.replace('Sodium', '').replace('.', '').replace(/[0-9]/g, ''));
          }
          if (e && e.innerText && e.innerText.indexOf('Total Carbohydrate') > -1) {
            addHiddenDiv('totalCarbInfo', e.querySelector('span').innerText.replace('Total Carbohydrate', ''));
            addHiddenDiv('totalCarbUomInfo', e.querySelector('span').innerText.replace('Total Carbohydrate', '').replace('.', '').replace(/[0-9]/g, ''));
          }
          if (e && e.innerText && e.innerText.indexOf('Dietary Fiber') > -1) {
            addHiddenDiv('dietaryFiberInfo', e.querySelector('span').innerText.replace('Dietary Fiber', ''));
            addHiddenDiv('dietaryFiberUomInfo', e.querySelector('span').innerText.replace('Dietary Fiber', '').replace('.', '').replace(/[0-9]/g, ''));
          }
          if (e && e.innerText && (e.innerText.indexOf('Total Sugars') > -1 || e.innerText.indexOf('Sugars') === 0)) {
            addHiddenDiv('totalSugarInfo', e.querySelector('span').innerText.replace('Total Sugars', '').replace('Sugars', ''));
            addHiddenDiv('totalSugarUomInfo', e.querySelector('span').innerText.replace('Total Sugars', '').replace('Sugars', '').replace('.', '').replace(/[0-9]/g, ''));
          }
          if (e && e.innerText && e.innerText.indexOf('Protein') > -1) {
            addHiddenDiv('proteinInfo', e.querySelector('span').innerText.replace('Protein', ''));
            addHiddenDiv('proteinUomInfo', e.querySelector('span').innerText.replace('Protein', '').replace('.', '').replace(/[0-9]/g, ''));
          }
          if (e && e.innerText && e.innerText.indexOf('Vitamin A') > -1) {
            addHiddenDiv('vitaminAInfo', e.querySelector('span').innerText.replace('Vitamin A', ''));
            addHiddenDiv('vitaminAUomInfo', e.querySelector('span').innerText.replace('Vitamin A', '').replace('.', '').replace(/[0-9]/g, ''));
          }
          if (e && e.innerText && e.innerText.indexOf('Vitamin C') > -1) {
            addHiddenDiv('vitaminCInfo', e.querySelector('span').innerText.replace('Vitamin C', ''));
            addHiddenDiv('vitaminCUomInfo', e.querySelector('span').innerText.replace('Vitamin C', '').replace('.', '').replace(/[0-9]/g, ''));
          }
          if (e && e.innerText && e.innerText.indexOf('Calcium') > -1) {
            addHiddenDiv('calciumInfo', e.querySelector('span').innerText.replace('Calcium', '').trim() || 0);
            addHiddenDiv('calciumUomInfo', e.querySelector('span').innerText.replace('Calcium', '').replace('.', '').replace(/[0-9]/g, '') || '%');
          }
          if (e && e.innerText && e.innerText.indexOf('Iron') > -1) {
            addHiddenDiv('ironInfo', e.querySelector('span').innerText.replace('Iron', ''));
            addHiddenDiv('ironUomInfo', e.querySelector('span').innerText.replace('Iron', '').replace('.', '').replace(/[0-9]/g, ''));
          }
          if (e && e.innerText && e.innerText.indexOf('Magnesium') > -1) {
            addHiddenDiv('magInfo', e.querySelector('span').innerText.replace('Magnesium', ''));
            addHiddenDiv('magUomInfo', e.querySelector('span').innerText.replace('Magnesium', '').replace('.', '').replace(/[0-9]/g, ''));
          }
        });
      }
      const drugFacts = document.querySelector('a[href="#tabContent-tab-Drugfacts"]');
      if (drugFacts) {
        drugFacts.click();
        await stall(500);
        const warning = [];
        document.querySelectorAll('h4').forEach(e => {
          console.log('drugs', e.innerText.trim());
          if (e && e.innerText && e.innerText.trim() === 'Directions') {
            addHiddenDiv('directionsInfo', e.parentElement.innerText.replace('Directions', '').trim());
          }
          if (e && e.innerText && e.innerText.trim() === 'Inactive ingredients') {
            addHiddenDiv('ingredientsInfo', e.parentElement.innerText.replace('Inactive ingredients', '').trim().toUpperCase());
          }
          if (e && e.innerText && (e.innerText.trim() === 'For use' || e.innerText.trim() === 'Keep out of reach' || e.innerText.trim() === 'Do not use' || e.innerText.trim() === 'When using')) {
            warning.push(e.innerText.trim());
            warning.push(e.parentElement.innerText.replace(e.innerText.trim(), '').trim());
          }
        });
        if (warning.length) {
          addHiddenDiv('warningInfo', warning.join(' '));
        }
      }

      let terms = 'No';
      if (document && document.querySelector('a[href="/c/terms-conditions/-/N-4sr7l"]')) {
        terms = 'Yes';
      }
      addHiddenDiv('terms', terms);

      let privacy = 'No';
      if (document && document.querySelector('a[href="/c/target-privacy-policy/-/N-4sr7p"]')) {
        privacy = 'Yes';
      }
      addHiddenDiv('privacy', privacy);
      addHiddenDiv('customerServiceAvailability', 'Yes');

      let scrollTop = 500;
      while (true) {
        window.scroll(0, scrollTop);
        await stall(250);
        scrollTop += 500;
        if (scrollTop === 8000) {
          break;
        }
      }

      let variants = document.querySelectorAll('.StyledButton__VariationButton-qhksha-0');
      if (!variants.length) {
        variants = document.querySelectorAll('.SwatchButton-sc-18yljzc-0');
      }
      if (variants.length) {
        variants.forEach(e => {
          if (e && e.getAttribute('aria-label').indexOf('checked') > -1) {
            addHiddenDiv('variantInfo', e.innerText);
          }
        });
      }

      let deliver = false;
      let inStore = false;
      document.querySelectorAll('.h-text-bold.h-text-greenDark').forEach(e => {
        if (e && e.innerText && e.innerText.trim() === 'Deliver') {
          deliver = true;
        }
        if (e && e.innerText && e.innerText.trim().indexOf('Pick up') > -1) {
          addHiddenDiv('inStorePrice', document.querySelector('div[data-test="product-price"]').innerText);
          inStore = true;
        }
      });

      if (deliver) {
        addHiddenDiv('availability', 'In Stock');
      } else if (inStore) {
        addHiddenDiv('availability', 'In Store Only');
      }
      if (!deliver && !inStore) {
        addHiddenDiv('availability', 'Out of Stock');
      }

      const secondaryImages = [];
      const videos = [];
      const moreImageBtn = document.querySelector('.styles__LegendGridButtonOverlay-beej2j-13');
      if (moreImageBtn) {
        moreImageBtn.click();
        const slideDeck = document.querySelector('.ZoomedSlideDeck__SlideList-sc-1nqe9sx-0');
        if (slideDeck) {
          console.log('has slide deck');
          slideDeck.querySelectorAll('.ZoomedSlide__Image-sc-10kwhw6-0').forEach(async (e, ind) => {
            if (e && e.getAttribute('alt') && e.getAttribute('alt').indexOf('- video') === -1 && ind > 0) {
              secondaryImages.push(e.getAttribute('src').split('?')[0]);
            } else if (e && e.getAttribute('alt') && e.getAttribute('alt').indexOf('- video') > -1) {
              videos.push(e.getAttribute('src').split('?')[0] + '_Flash9_Autox720p_2600k');
            }
          });
        }
      } else {
        const sideImages = document.querySelectorAll('.styles__ThumbnailImage-beej2j-11');
        if (sideImages) {
          sideImages.forEach((e, ind) => {
            if (e && e.getAttribute('type') && e.getAttribute('type').indexOf('video') === -1 && ind > 0) {
              secondaryImages.push(e.getAttribute('src').split('?')[0]);
            } else if (e && e.getAttribute('alt') && e.getAttribute('alt').indexOf('- video') > -1) {
              videos.push(e.getAttribute('src').split('?')[0] + '_Flash9_Autox720p_2600k');
            }
          });
        }
      }
      if (videos.length) {
        addHiddenDiv('videos', videos.join(' | '));
      }
      if (secondaryImages.length) {
        addHiddenDiv('secondaryImages', secondaryImages.join(' | '));
      }
      if (!document.querySelector('#packSize')) {
        addHiddenDiv('packSize', 1);
      }
      if (document.querySelectorAll('.styles__ThumbnailImage-beej2j-11').length) {
        addHiddenDiv('productImage', document.querySelectorAll('.styles__ThumbnailImage-beej2j-11')[0].getAttribute('src').split('?')[0]);
      }

      const manufacturerCTA = document.querySelector('.Button-bwu3xu-0.styles__ShowMoreButton-zpxf66-2.h-padding-t-tight');
      if (manufacturerCTA) {
        manufacturerCTA.click();
        if (document.getElementById('wc-power-page')) {
          addHiddenDiv('manufacturerDesc', document.getElementById('wc-power-page').innerText);
        }
        const manufacturerImgs = [];
        document.querySelectorAll('img.wc-media.wc-image').forEach(e => {
          manufacturerImgs.push(e.src);
        });
        const aplusBody = document.querySelector('.wc-product-image-row');
        if (aplusBody) {
          aplusBody.querySelectorAll('.wc-pct-product-image').forEach(e => {
            manufacturerImgs.push(e.src);
          });
        }

        addHiddenDiv('manufacturerImgs', manufacturerImgs.join(' | '));
        await stall(500);
      }

      if (document.querySelector('.RatingSummary__StyledRating-bxhycp-0')) {
        addHiddenDiv('rating', document.querySelector('.RatingSummary__StyledRating-bxhycp-0').innerText);
      }
      if (document.querySelectorAll('.utils__ScreenReaderOnly-sc-1kni3r7-0').length > 0) {
        addHiddenDiv('ratingText', document.querySelectorAll('.utils__ScreenReaderOnly-sc-1kni3r7-0')[1].innerText);
      }

      const details = document.querySelector('a[href="#tabContent-tab-Details"]');

      let variations = document.querySelectorAll('.StyledButton__VariationButton-qhksha-0');
      if (!variations.length) {
        variations = document.querySelectorAll('.SwatchButton-sc-18yljzc-0');
      }

      let contents = document.querySelector('#salsify-ec-iframe').contentWindow.document.getElementById('salsify-content').innerHTML;
      console.log('contents', contents);

      let isColorDropDown = false;
      if (document.querySelector('button[data-test="SelectVariationSelector-color"]')) {
        if (!document.getElementById('options')) {
          document.querySelector('button[data-test="SelectVariationSelector-color"]').click();
        }
        const options = document.getElementById('options');
        variations = options.querySelectorAll('a');
        isColorDropDown = true;
      }
      if (variations.length) {
        details.click();
        await stall(500);
        addHiddenDiv('variantCount', variations.length);
        if (isColorDropDown) {
          if (!document.getElementById('options')) {
            document.querySelector('button[data-test="SelectVariationSelector-color"]').click();
          }
          const options = document.getElementById('options');
          options.querySelectorAll('a')[0].click();
        } else {
          variations[0].click();
        }
        await stall(500);
        if (document && document.querySelectorAll('b').length) {
          document.querySelectorAll('b').forEach(e => {
            if (e && e.innerText && e.innerText.indexOf('TCIN') > -1) {
              addHiddenDiv('firstVariant', e.parentElement.innerText.split(':')[1]);
            }
          });
        }
        const variants = new Set();
        let i = 0;
        for (const variation of variations) {
          if (isColorDropDown) {
            if (!document.getElementById('options')) {
              document.querySelector('button[data-test="SelectVariationSelector-color"]').click();
            }
            const options = document.getElementById('options');
            options.querySelectorAll('a')[i].click();
          } else {
            variation.click();
          }
          await stall(500);
          if (document && document.querySelectorAll('b').length) {
            document.querySelectorAll('b').forEach(e => {
              if (e && e.innerText && e.innerText.indexOf('TCIN') > -1) {
                variants.add(e.parentElement.innerText.split(':')[1]);
              }
            });
          }
          i++;
        }
        if (variants.size > 0) {
          addHiddenDiv('variants', [...variants].join(' | '));
        }
      }
      if (document && document.getElementById('btnIndex')) {
        document.getElementById('btnIndex').innerHTML = parseInt(document.getElementById('btnIndex').innerHTML) + 1;
      }
    });
    const extraction = await context.extract(productDetails, { transform });
    console.log('extraction', extraction);
    extractedData.push(extraction[0]);
  }
  return extractedData;
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
