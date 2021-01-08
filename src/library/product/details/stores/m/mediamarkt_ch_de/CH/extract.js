const { cleanUp } = require('../../../../shared');

module.exports = {
  implements: 'product/details/extract',
  parameterValues: {
    country: 'CH',
    store: 'mediamarkt_ch_de',
    transform: cleanUp,
    domain: 'mediamarkt.ch',
    zipcode: '',
  },
  implementation: async ({ inputString }, { transform }, context, { productDetails }) => {
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
      manufacturerDescription[0].text = fullDescription;
      manufacturerDescription.splice(1);
    }

    var availability = extractedData[0].group[0].availabilityText;
    if (availability) {
      availability[0].text = availability[0].text === 'InStock' ? 'In Stock' : 'Out of Stock';
    }

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
