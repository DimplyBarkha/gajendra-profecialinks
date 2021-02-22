const { cleanUp } = require('./shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt_ch_de',
    transform: cleanUp,
    domain: 'mediamarkt.ch',
    zipcode: '',
  },
  // @ts-ignore
  implementation: async ({ inputString }, { transform }, context, { productDetails }) => {
    const applyScroll = async function (context) {
      await context.evaluate(async function () {
        let scrollTop = 0;
        while (scrollTop !== 20000) {
          scrollTop += 400;
          window.scroll(0, scrollTop);
          await stall(1000);
        }
        function stall(ms) {
          // @ts-ignore
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              resolve();
            }, ms);
          });
        }
      });
    };
    await applyScroll(context);
    // @ts-ignore
    await context.evaluate(async function (context) {
      const seeAllSelector = document.querySelector('div[class*="product-accessories"] div.next');
      for (let i = 0; i < 5; i++) {
        seeAllSelector && seeAllSelector.click();
      }

      const eanScriptXPath = '//body/script[contains(text(), "ean")]';
      const eanScriptElement = document.evaluate(eanScriptXPath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null).iterateNext();
      const eanScript = eanScriptElement && eanScriptElement.textContent;
      const eanRegex = '("ean":)"(.*?)"';
      const upcValue = eanScript.match(eanRegex) ? eanScript.match(eanRegex)[2] : '';

      document.querySelector('body').setAttribute('upc', upcValue);
    });
    await context.evaluate(async function (context) {
      const seeAllSelector1 = document.querySelector('#produktdetailseiten_reco-bottom div.next');
      for (let i = 0; i < 5; i++) {
        seeAllSelector1 && seeAllSelector1.click();
      }
    });
    await context.evaluate(async () => {
      const specifications = [];
      if (document.querySelector('div[class*="features-wrapper"]')) {
        document.querySelectorAll('div[class*="features-wrapper"]').forEach(el => {
          const headers1 = [...document.querySelectorAll('div[id="features"] dl dt')]
          const values1 = [...document.querySelectorAll('div[id="features"] dl dd[style*="min-height"]')]
          const heads1 = []
          const vals1 = []
          headers1.forEach(item => {
            heads1.push(item.innerText)
          })
          values1.forEach(item => {
            vals1.push(item.innerText)
          })
          let specs1 = ''
          for (let i = 0; i < heads1.length; i++) {
            specs1 = specs1 + (specs1 ? ` | ${heads1[i]} ${vals1[i]}` : `${heads1[i]} ${vals1[i]}`)

          }
          specifications.push(specs1);
          return specs1;
        });
      }
      if (specifications.length) {
        let appendDiv = document.createElement('div');
        appendDiv.className = 'specificationsvalue';
        appendDiv.setAttribute('specifications', specifications.join(' | '));
        document.body.append(appendDiv);
      }

    });
    var extractedData = await context.extract(productDetails, { transform });

    var productUrl = extractedData[0].group[0].productUrl;
    if (productUrl) {
      productUrl[0].text = productUrl[0].text.replace('/fr/', '/de/');
    }

    var image = extractedData[0].group[0].image;
    if (image) {
      image[0].text = image[0].text.replace('325_225', '786_587');
    }

    var alternateImages = extractedData[0].group[0].alternateImages;
    if (alternateImages) {
      alternateImages.forEach(image => {
        image.text = 'https:' + image.text.replace('52_41', '786_587');
      });
    }

    var descriptions = extractedData[0].group[0].description;
    if (descriptions && descriptions.length > 1) {
      let fullDescription = '';
      descriptions.forEach(description => {
        fullDescription += description.text + ' ';
      });
      descriptions[0].text = fullDescription;
      descriptions.splice(1);
    }

    var manufacturerDescription = extractedData[0].group[0].manufacturerDescription;
    if (manufacturerDescription && manufacturerDescription.length > 1) {
      let fullDescription = '';
      manufacturerDescription.forEach(description => {
        fullDescription += description.text + ' ';
      });
      manufacturerDescription[0].text = fullDescription.trim();
      manufacturerDescription.splice(1);
    }

    // var availability = extractedData[0].group[0].availabilityText;
    // if (availability) {
    //   availability[0].text = availability[0].text === 'InStock' ? 'In Stock' : 'Out of Stock';
    // }

    var servingSize = extractedData[0].group[0].servingSize;
    if (servingSize) {
      servingSize[0].text = servingSize[0].text.replace(/[()]/g, '');
    }
    var servingSizeUom = extractedData[0].group[0].servingSizeUom;
    if (servingSizeUom) {
      servingSizeUom[0].text = servingSizeUom[0].text.replace(/[()\d ]/g, '').replace('per', '');
    }
    var pricePerUnitUom = extractedData[0].group[0].pricePerUnitUom;
    if (pricePerUnitUom) {
      pricePerUnitUom[0].text = pricePerUnitUom[0].text.match(/pro (.+) =/)[1];
    }

    var calories = extractedData[0].group[0].caloriesPerServing;
    if (calories && calories.length > 1) {
      var caloriesDataArr = [];
      var caloriesFinalData = '';
      calories.forEach(info => {
        caloriesDataArr.push(info.text);
      });
      caloriesFinalData = caloriesDataArr.join(' | ');
      calories[0].text = caloriesFinalData;
      calories.splice(1);
    }
  },
};
