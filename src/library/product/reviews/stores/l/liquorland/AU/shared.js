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

  data.forEach((dataObj) => {
    dataObj.group.forEach((fieldName, index) => {
      for (var row in fieldName) {
        fieldName[row].forEach((elem, i) => {
          const fieldText = fieldName[row][i].text;
          fieldName[row][i].text = fieldText.replace(
            /(\n \n \n \n|\n \n \n|\n \n|\r\n|\n|\r)/gm,
            ' ',
          );
        });
      }

      if(fieldName.reviewRating){
        const ratingValue = fieldName.reviewRating[0].value;
        if(ratingValue > 5) {
          fieldName.reviewRating[0].value = Number((ratingValue / 20).toFixed(1));
          fieldName.reviewRating[0].text = `${(ratingValue / 20).toFixed(1)}`
        }
      }

      if(fieldName.reviewDate){
        fieldName.reviewDate[0].text = fieldName.reviewDate[0].text.replace(/T.*/, '');
      }
    });
  });
  return data;
};
module.exports = { transform };
