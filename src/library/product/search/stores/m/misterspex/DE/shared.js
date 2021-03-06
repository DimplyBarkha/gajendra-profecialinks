/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  function findKeyValue (key, data) {
    let result = [];
    data.forEach(dataObj => {
      dataObj.group.forEach(dataObjElem => {
        if (dataObjElem[key]) {
          result = dataObjElem[key];
        }
      });
    });
    return result;
  }

  function cleanText (str) {
  /* eslint-disable */
    return str.replace(/(\r\n|\n|\r)/gm, '').replace(/\s+/g, ' ').trim();
  }

  // const mainUrl = 'https://www.ozon.ru';
  const inputFieldValue = findKeyValue('input', data);
  const urlFieldValue = findKeyValue('url', data);

  data.forEach(dataObj => {
    dataObj.group.forEach((fieldName, index) => {
      // _input
      fieldName._input = inputFieldValue;
      if (fieldName._input) {
        let inputText = fieldName._input[0].text;
        if (inputText.match(/SearchTerm=\w{0,}/g) && inputText.match(/SearchTerm=.{0,}/g)[0]) {
          inputText = inputText.match(/SearchTerm=.{0,}/g)[0]
            .replace(/\%20/g, ' ')
            .replace(/SearchTerm=/g, '');
          fieldName._input[0].text = inputText;
        }
      }
    
    /* eslint-enable */
      // _url
      fieldName._url = urlFieldValue;

      if (fieldName.name) {
        fieldName.name[0].text = cleanText(fieldName.name[0].text);
      }
    });
  });

  return data;
};
module.exports = { transform };
