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
      });
    });
    return data;
  };
  module.exports = { transform };