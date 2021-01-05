const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'brack',
    transform: cleanUp,
    domain: 'brack.ch',
    zipcode: '',
  },
  implementation: async (
    { inputString },
    { country, domain, transform },
    context,
    { productDetails },
  ) => {
    await context.evaluate(async () => {
      const topDescriptionBullets = document.querySelectorAll('div.productStage__infoText li');
      let generalDescription = '';
      if (topDescriptionBullets && topDescriptionBullets.length > 0) {
        topDescriptionBullets.forEach(descBullet => {
          generalDescription += '||' + descBullet.textContent;
        });
      }
      const bottomDescriptionBox = document.querySelector('div#description-block');
      if (bottomDescriptionBox) {
        const descSubtitles = bottomDescriptionBox.querySelectorAll('div.pdp__contentSection-leftSide > h3');
        const descTexts = bottomDescriptionBox.querySelectorAll('div.pdp__contentSection-leftSide > p');
        let bottomDescData = [];
        let manufacturerDesc = '';
        descSubtitles.forEach((subtitle, index) => {
          bottomDescData = [
            ...bottomDescData,
            {
              title: subtitle.innerHTML,
              text: descTexts[index] ? descTexts[index].innerHTML : '',
            },
          ];
        });
        bottomDescData = bottomDescData.filter(desc => {
          return (!desc.title.includes('Zutaten') && !desc.title.includes('Zubereitung'));
        });
        bottomDescData.forEach(desc => {
          manufacturerDesc += desc.title + ' ' + desc.text + ' ';
        });
        bottomDescriptionBox.setAttribute('manufacturerdesc', manufacturerDesc);
        generalDescription += '|' + manufacturerDesc;
      }
      document.querySelector('body').setAttribute('description', generalDescription);
    });

    const dataRef = await context.extract(productDetails, { transform });

    const alternateImages = dataRef[0].group[0].alternateImages;
    if (alternateImages) {
      alternateImages.forEach(image => {
        image.text = 'https:' + image.text.replace('xs3', 'xxl');
      });
    }

    const availability = dataRef[0].group[0].availabilityText;
    if (availability) {
      availability[0].text = availability[0].text.includes('InStock') ? 'In Stock' : 'Out Of Stock';
    }

    const servingSizeUom = dataRef[0].group[0].servingSizeUom;
    if (servingSizeUom) {
      servingSizeUom[0].text = servingSizeUom[0].text.replace(/\d/g, '');
    }

    const unitFormatter = (fieldPath) => {
      if (fieldPath) {
        fieldPath[0].text = fieldPath[0].text.replace(/[()]/g, '');
      }
    };
    for (var field in dataRef[0].group[0]) {
      if (field.includes('PerServingUom')) {
        unitFormatter(dataRef[0].group[0][field]);
      }
    }
  },
};
