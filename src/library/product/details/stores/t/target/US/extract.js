async function implementation (
  inputs,
  parameters,
  context,
  dependencies,
) {
  const { transform } = parameters;
  const { productDetails } = dependencies;

  await context.waitForXPath("//a[@class='Link-sc-1khjl8b-0 kTulu h-display-block']");
  await context.evaluate(async function () {
    function stall (ms) {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve();
        }, ms);
      });
    }
    await stall(1000);
    const link = document.querySelector('.Link-sc-1khjl8b-0.kTulu.h-display-block');
    if (link != null) {
      link.click();
    }
  });

  await context.waitForXPath("//h1[@class='Heading__StyledHeading-sc-1m9kw5a-0 kWcXUA h-margin-b-none h-margin-b-tiny h-text-bold']");
  await context.evaluate(async function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }

    addHiddenDiv('dateStamp', new Date());
    addHiddenDiv('urlInfo', window.location.href);
    addHiddenDiv('productName', document.querySelector('h1[data-test="product-title"]').innerText.split('-')[0]);

    const alternateImages = [];
    document.querySelectorAll('.styles__ThumbnailImage-beej2j-11').forEach(e => {
      alternateImages.push(e.src);
    });
    addHiddenDiv('alternateImages', alternateImages.join(' | '));

    const subCategories = [];
    const categoryDiv = document.querySelector('.h-text-sm.h-padding-v-tiny');
    categoryDiv.querySelectorAll('a').forEach(e => {
      subCategories.push(e.getAttribute('aria-label'));
    });
    addHiddenDiv('subCategories', subCategories.join(' > '));

    const materials = [];
    let quantity = 1;
    if (document.querySelector('.Col-favj32-0.fVmltG.h-padding-h-default')) {
      document.querySelector('.Col-favj32-0.fVmltG.h-padding-h-default').children.forEach(e => {
        if (e.innerText.indexOf('UPC') > -1) {
          addHiddenDiv('upcInfo', e.innerText.replace('UPC: ', ''));
        }
        if (e.innerText.indexOf('TCIN') > -1) {
          addHiddenDiv('skuInfo', e.innerText.replace('TCIN: ', ''));
        }
        if (e.innerText.indexOf('Weight:') > -1 || e.innerText.indexOf('Net weight:') > -1) {
          addHiddenDiv('weightInfo', e.innerText.split(':')[1]);
        }
        if (e.innerText.indexOf('Warranty') > -1) {
          addHiddenDiv('warrantyInfo', e.innerText.split(':')[1]);
        }
        if (e.innerText.indexOf('Store:') > -1) {
          addHiddenDiv('storageInfo', e.innerText.split(':')[1]);
        }
        if (e.innerText.indexOf('Dimensions') > -1) {
          addHiddenDiv('dimensionsInfo', e.innerText.split(':')[1]);
        }
        if (e.innerText.indexOf('p65warning') > -1) {
          addHiddenDiv('p65Info', e.innerText.split(':')[1]);
        }
        if (e.innerText.indexOf('Quantity:') > -1) {
          quantity = e.innerText.split(':')[1];
        }
        if (e.innerText.indexOf('Number of') > -1) {
          addHiddenDiv('packSize', e.innerText.split(':')[1]);
        }
        if (e.innerText.indexOf('Suggested Age:') > -1) {
          addHiddenDiv('ageInfo', e.innerText.replace('Suggested Age: ', ''));
        }
        if (e.innerText.indexOf('Origin:') > -1) {
          addHiddenDiv('originInfo', e.innerText.split(':')[1]);
        }
        if (e.innerText.indexOf('Alcohol content:') > -1) {
          addHiddenDiv('alcoholInfo', e.innerText.replace('Alcohol content: ', ''));
        }
        if (e.innerText.indexOf('Material:') > -1 || e.innerText.indexOf('material:') > -1) {
          const split = e.innerText.split(':');
          materials.push(split[split.length - 1]);
        }
        if (e.innerText.indexOf('Net weight:') > -1) {
          addHiddenDiv('weightInfo', e.innerText.replace('Net weight: ', ''));
        }
        if (e.innerText.indexOf('WARNING:') > -1 || e.innerText.indexOf('warning') > -1) {
          addHiddenDiv('warningInfo', e.innerText.split(':')[1]);
        }
        if (e.innerText.indexOf('Disclaimer:') > -1) {
          addHiddenDiv('disclaimerInfo', e.innerText.split(':')[1]);
        }
      });
    }
    if (materials.length) {
      addHiddenDiv('materialInfo', materials.join(', '));
    }
    addHiddenDiv('quantityInfo', quantity);

    const bulletCount = document.querySelectorAll('div[data-test="wellnessBadgeAndDescription"]').length;
    addHiddenDiv('bulletCount', bulletCount);

    const additionalInfo = [];
    document.querySelectorAll('.Col-favj32-0.RDgXb.h-padding-t-tight.h-padding-r-default').forEach(e => {
      additionalInfo.push(e.innerText);
    });
    addHiddenDiv('additionalInfo', additionalInfo.join(', '));
  });

  await context.evaluate(function () {
    function addHiddenDiv (id, content) {
      const newDiv = document.createElement('div');
      newDiv.id = id;
      newDiv.textContent = content;
      newDiv.style.display = 'none';
      document.body.appendChild(newDiv);
    }
    const button = document.querySelector('#tab-ShippingReturns');
    if (button != null) {
      button.click();
      if (document.querySelector('div[data-test="shippingOptionsMessage"]')) {
        addHiddenDiv('shippingInfo', document.querySelector('div[data-test="shippingOptionsMessage"]').innerText);
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
      await stall(1000);
      document.querySelectorAll('.h-margin-t-default.h-padding-h-default').forEach(e => {
        if (e.innerText.indexOf('Ingredients:') > -1) {
          addHiddenDiv('ingredientsInfo', e.innerText.replace('Ingredients: ', ''));
        }
      });
      document.querySelectorAll('p').forEach(e => {
        if (e.innerText.indexOf('Serving Size:') > -1) {
          addHiddenDiv('servingSizeInfo', e.innerText.replace('Serving Size: ', ''));
          const splitInfo = document.getElementById('servingSizeInfo').innerHTML.split(' ');
          addHiddenDiv('servingSizeUomInfo', splitInfo[splitInfo.length - 1]);
        }
        if (e.innerText.indexOf('Serving Per Container:') > -1) {
          addHiddenDiv('servingPerContainerInfo', e.innerText.replace('Serving Per Container: ', ''));
        }
      });
      document.querySelectorAll('.h-padding-l-default').forEach(e => {
        if (e.innerText.indexOf('Calories:') > -1) {
          addHiddenDiv('caloriesInfo', e.innerText.replace('Calories: ', ''));
        }
      });
      document.querySelectorAll('.h-margin-t-tight').forEach(e => {
        if (e.innerText.indexOf('Total Fat') > -1) {
          addHiddenDiv('totalFatInfo', e.querySelector('span').innerText.replace('Total Fat', ''));
          addHiddenDiv('totalFatUomInfo', document.getElementById('totalFatInfo').innerHTML.replace('Total Fat', '').replace(/\*/g, '').replace('.', '').replace(/[0-9]/g, ''));
        }
        if (e.innerText.indexOf('Saturated Fat') > -1) {
          addHiddenDiv('saturatedFatInfo', e.querySelector('span').innerText.replace('Saturated Fat', ''));
          addHiddenDiv('saturatedFatUomInfo', e.querySelector('span').innerText.replace('Saturated Fat', '').replace('.', '').replace(/\*/g, '').replace(/[0-9]/g, ''));
        }
        if (e.innerText.indexOf('Trans Fat') > -1) {
          addHiddenDiv('transFatInfo', e.querySelector('span').innerText.replace('Trans Fat', ''));
          addHiddenDiv('transFatUomInfo', e.querySelector('span').innerText.replace('Trans Fat', '').replace('.', '').replace(/\*/g, '').replace(/[0-9]/g, ''));
        }
        if (e.innerText.indexOf('Cholesterol') > -1) {
          addHiddenDiv('cholesterolInfo', e.querySelector('span').innerText.replace('Cholesterol', ''));
          addHiddenDiv('cholesterolUomInfo', e.querySelector('span').innerText.replace('Cholesterol', '').replace('.', '').replace(/\*/g, '').replace(/[0-9]/g, ''));
        }
        if (e.innerText.indexOf('Sodium') > -1) {
          addHiddenDiv('sodiumInfo', e.querySelector('span').innerText.replace('Sodium ', ''));
          addHiddenDiv('sodiumUomInfo', e.querySelector('span').innerText.replace('Sodium', '').replace('.', '').replace(/[0-9]/g, ''));
        }
        if (e.innerText.indexOf('Total Carbohydrate') > -1) {
          addHiddenDiv('totalCarbInfo', e.querySelector('span').innerText.replace('Total Carbohydrate', ''));
          addHiddenDiv('totalCarbUomInfo', e.querySelector('span').innerText.replace('Total Carbohydrate', '').replace('.', '').replace(/[0-9]/g, ''));
        }
        if (e.innerText.indexOf('Dietary Fiber') > -1) {
          addHiddenDiv('dietaryFiberInfo', e.querySelector('span').innerText.replace('Dietary Fiber', ''));
          addHiddenDiv('dietaryFiberUomInfo', e.querySelector('span').innerText.replace('Dietary Fiber', '').replace('.', '').replace(/[0-9]/g, ''));
        }
        if (e.innerText.indexOf('Total Sugars') > -1) {
          addHiddenDiv('totalSugarInfo', e.querySelector('span').innerText.replace('Total Sugars', ''));
          addHiddenDiv('totalSugarUomInfo', e.querySelector('span').innerText.replace('Total Sugars', '').replace('.', '').replace(/[0-9]/g, ''));
        }
        if (e.innerText.indexOf('Protein') > -1) {
          addHiddenDiv('proteinInfo', e.querySelector('span').innerText.replace('Protein', ''));
          addHiddenDiv('proteinUomInfo', e.querySelector('span').innerText.replace('Protein', '').replace('.', '').replace(/[0-9]/g, ''));
        }
        if (e.innerText.indexOf('Vitamin A') > -1) {
          addHiddenDiv('vitaminAInfo', e.querySelector('span').innerText.replace('Vitamin A', ''));
          addHiddenDiv('vitaminAUomInfo', e.querySelector('span').innerText.replace('Vitamin A', '').replace('.', '').replace(/[0-9]/g, ''));
        }
        if (e.innerText.indexOf('Vitamin C') > -1) {
          addHiddenDiv('vitaminCInfo', e.querySelector('span').innerText.replace('Vitamin C', ''));
          addHiddenDiv('vitaminCUomInfo', e.querySelector('span').innerText.replace('Vitamin C', '').replace('.', '').replace(/[0-9]/g, ''));
        }
        if (e.innerText.indexOf('Calcium') > -1) {
          addHiddenDiv('calciumInfo', e.querySelector('span').innerText.replace('Calcium', ''));
          addHiddenDiv('calciumUomInfo', e.querySelector('span').innerText.replace('Calcium', '').replace('.', '').replace(/[0-9]/g, ''));
        }
        if (e.innerText.indexOf('Iron') > -1) {
          addHiddenDiv('ironInfo', e.querySelector('span').innerText.replace('Iron', ''));
          addHiddenDiv('ironUomInfo', e.querySelector('span').innerText.replace('Iron', '').replace('.', '').replace(/[0-9]/g, ''));
        }
        if (e.innerText.indexOf('Magnesium') > -1) {
          addHiddenDiv('magInfo', e.querySelector('span').innerText.replace('Magnesium', ''));
          addHiddenDiv('magUomInfo', e.querySelector('span').innerText.replace('Magnesium', '').replace('.', '').replace(/[0-9]/g, ''));
        }
      });
    }

    document.querySelectorAll('.h-margin-t-default.h-padding-h-default').forEach(e => {
      if (e.innerText.indexOf('Allergens & Warnings:') > -1) {
        addHiddenDiv('allergyAdviceInfo', e.innerText.replace('Allergens & Warnings:', ''));
      }
    });

    let terms = 'No';
    if (document.querySelector('a[href="/c/terms-conditions/-/N-4sr7l"]')) {
      terms = 'Yes';
    }
    addHiddenDiv('terms', terms);

    let privacy = 'No';
    if (document.querySelector('a[href="/c/target-privacy-policy/-/N-4sr7p"]')) {
      privacy = 'Yes';
    }
    addHiddenDiv('privacy', privacy);
    addHiddenDiv('customerServiceAvailability', 'Yes');

    let scrollTop = 500;
    while (true) {
      window.scroll(0, scrollTop);
      await stall(1000);
      scrollTop += 500;
      if (scrollTop === 10000) {
        break;
      }
    }

    const variationNum = document.querySelectorAll('.VariationButton__StyledButtonWrapper-sc-1hf3dzx-0.gcwqAn').length;
    addHiddenDiv('variantCount', variationNum);

    const similarItems = document.querySelector('a[href="#tabContent-Similaritems1"]');
    if (similarItems) {
      similarItems.click();
      await stall(1000);
      const variants = [];
      document.getElementById('tabContent-Similaritems1').querySelectorAll('a').forEach(e => {
        const split = e.getAttribute('href').split('/');
        variants.push(split[split.length - 1]);
      });
      addHiddenDiv('variants', variants.join(' | '));
    }

    if (document.querySelector('div[data-test="orderPickupMessage"]')) {
      addHiddenDiv('availability', 'In stock');
    }

    const video = document.querySelector('img[type="video"]');
    if (video) {
      video.click();
    }

    const manufacturerCTA = document.querySelector('.Button-bwu3xu-0.styles__ShowMoreButton-zpxf66-2.fWPETf.h-padding-t-tight');
    if (manufacturerCTA) {
      manufacturerCTA.click();
      const manufacturerImgs = [];
      document.querySelectorAll('img.wc-media.wc-image').forEach(e => {
        manufacturerImgs.push(e.src);
      });
      addHiddenDiv('manufacturerImgs', manufacturerImgs.join(' | '));
      await stall(1000);
    }
  });
  return await context.extract(productDetails, { transform });
}

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'US',
    store: 'target',
    transform: null,
    domain: 'target.com',
  },
  implementation,
};
