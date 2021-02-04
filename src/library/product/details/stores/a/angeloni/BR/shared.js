/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  function findKeyValue (key, data) {
    let result = [];
    data.forEach((dataObj) => {
      dataObj.group.forEach((dataObjElem) => {
        if (dataObjElem[key]) {
          result = dataObjElem[key];
        }
      });
    });
    return result;
  }

  // function cleanText (str) {
  //   return str.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ' ').trim();
  // }

  data.forEach((dataObj) => {
    dataObj.group.forEach((fieldName, index) => {
      for (var row in fieldName) {
        fieldName[row].forEach((elem, i) => {
          let fieldText = fieldName[row][i].text;
          fieldName[row][i].text = fieldText.replace(
            /(\n \n \n \n|\n \n \n|\n \n|\r\n|\n|\r)/gm,
            ' ',
          );
        });
      }

      // variantId
      if (fieldName.variantId) {
        const skuNumber = fieldName.variantId[0].text.replace(/\D/gm, '');
        fieldName.variantId[0].text = skuNumber;
        fieldName.sku[0].text = skuNumber;
        fieldName.input[0].text = skuNumber;
      }

      let altImagesCount;
      if (fieldName.alternateImages) {
        fieldName.alternateImages.shift();
        altImagesCount = fieldName.alternateImages.length;
        if (altImagesCount > 0) {
          fieldName.secondaryImageTotal = [{ text: `${altImagesCount}` }];
        }
        fieldName.alternateImages.map(item => item.text = 'https:' + item.text);
      }

      if (fieldName.image) {
        fieldName.image[0].text = 'https:' + fieldName.image[0].text;
      }

      if (fieldName.price) {
        fieldName.price[0].text = fieldName.price[0].text.replace(/\./, ',');
      }

    });
  });
  return data;
};
module.exports = { transform };
