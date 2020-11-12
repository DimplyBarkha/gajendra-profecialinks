
module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'brack',
    transform: null,
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
      const descriptionBox = document.querySelector('div#description-block');
      if (descriptionBox) {
        const descSubtitles = descriptionBox.querySelectorAll('div.pdp__contentSection-leftSide > h3');
        const descTexts = descriptionBox.querySelectorAll('div.pdp__contentSection-leftSide > p');
        let descData = [];
        let productDesc = '';
        descSubtitles.forEach((subtitle, index) => {
          descData = [
            ...descData,
            {
              title: subtitle.innerHTML,
              text: descTexts[index] ? descTexts[index].innerHTML : '',
            },
          ];
        });
        descData = descData.filter(desc => {
          return (!desc.title.includes('Zutaten') && !desc.title.includes('Zubereitung'));
        });
        descData.forEach(desc => {
          productDesc += desc.text + ' ';
        });
        descriptionBox.setAttribute('productdesc', productDesc);
      }
    });

    const dataRef = await context.extract(productDetails);

    const alternateImages = dataRef[0].group[0].alternateImages;
    if (alternateImages) {
      alternateImages.forEach(image => {
        image.text = 'https:' + image.text.replace('xs3', 'xxl');
      });
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

    const allergyAdvice = dataRef[0].group[0].allergyAdvice;
    if (allergyAdvice && allergyAdvice.length > 1) {
      let adviceText = '';
      allergyAdvice.forEach(advice => {
        adviceText += ' -' + advice.text;
      });
      allergyAdvice[0].text = adviceText.replace(/\n/g, ': ');
      allergyAdvice.splice(1, 1);
    }
  },
};
