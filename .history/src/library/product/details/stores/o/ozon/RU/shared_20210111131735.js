/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  function findKeyValue(key, data) {
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

  data.forEach((dataObj) => {
    dataObj.group.forEach((fieldName, index) => {
      for (var row in fieldName) {
        fieldName[row].forEach((elem, i) => {
          let fieldText = fieldName[row][i].text;
          fieldName[row][i].text = fieldText.replace(
            /(\n \n \n \n|\n \n \n|\n \n|\r\n|\n|\r)/gm,
            ' '
          );
        });
      }

      // _url
      const urlFieldValue = findKeyValue('url', data);
      fieldName['_url'] = urlFieldValue;

      // sku, variantId, _input, firstVariant
      if (fieldName.variantId) {
        const idObj = JSON.parse(fieldName.variantId[0].text);
        if (idObj.sku) {
          const prodId = idObj.sku;
          fieldName.variantId[0].text = prodId;
          fieldName.input[0].text = prodId;
          fieldName.firstVariant[0].text = prodId;
        } else {
          fieldName.variantId[0].text = '';
          fieldName.input[0].text = '';
          fieldName.firstVariant[0].text = '';
        }
      }

      // _input
      const inputFieldValue = findKeyValue('input', data);
      fieldName['_input'] = inputFieldValue;

      //calciumPerServing
      if (fieldName.sodiumPerServing) {
        const infoObj = JSON.parse(fieldName.sodiumPerServing[0].text);
        let str = infoObj.description
          ? infoObj.description.match(/натрий \S{1,},/)
          : false;
        if (str) {
          str = str[0].replace(/натрий /, '');
          fieldName.sodiumPerServing[0].text = str;
        } else {
          fieldName.sodiumPerServing[0].text = '';
        }
      }

      if (fieldName.magnesiumPerServing) {
        const infoText = fieldName.magnesiumPerServing[0].text;
        let str = infoText.match(/Магний - Mg2\+ - \S*,\S*/);
        if (str) {
          str = str[0].replace(/Магний - Mg2\+ - /, '');
          str = str.replace(/;/, '');
          fieldName.magnesiumPerServing[0].text = str;
        } else {
          fieldName.magnesiumPerServing[0].text = '';
        }
      }

      // ratingCount
      if (fieldName.ratingCount) {
        const infoObj = JSON.parse(fieldName.ratingCount[0].text);
        if (infoObj.aggregateRating) {
          let str = infoObj.aggregateRating.reviewCount || '';
          fieldName.ratingCount[0].text = str;
        } else {
          fieldName.ratingCount[0].text = '';
        }
      }

      // aggregateRating
      if (fieldName.aggregateRating) {
        const infoObj = JSON.parse(fieldName.aggregateRating[0].text);
        if (infoObj.aggregateRating) {
          let str = infoObj.aggregateRating.ratingValue || '';
          str = str.replace(/\./, ',');
          fieldName.aggregateRating[0].text = str;
        } else {
          fieldName.aggregateRating[0].text = '';
        }
      }

      try{
        if (fieldName.caloriesPerServing){
          const itemTextValue = fieldName.caloriesPerServing[0].text;
          const itemMatchValue  = itemTextValue.match(/(0|[1-9]\d*)([.,]\d+)?/);
          if(itemTextValue.length >= 0){
            fieldName.caloriesPerServing[0].text = itemMatchValue[0];
          } 
        }
      } catch (err) {
        console.log('Error with caloriesPerServing', err);
      }
    });
  });
  return data;
};
module.exports = { transform };
