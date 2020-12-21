
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
    console.log('INSIDE OF CLEANUP');
    dataStr = dataStr.replace(/(?:\\r\\n|\\r|\\n)/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '"')
      .replace(/\s{1,}"/g, '"')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[^\x00-\x7F]/g, '');

    return JSON.parse(dataStr);
  };
  for (const { group } of data) {
    for (let row of group) {
      if (row.description) {
        let finalDesc = '';
        for (let i = 0; i < row.description.length; i++) {
          if (row.description[i].xpath.includes('li')) {
            finalDesc = finalDesc + ' || ' + row.description[i].text;
          } else {
            finalDesc = finalDesc + row.description[i].text + ' ';
          }
        }
        if (finalDesc.trim().endsWith('||')) {
          finalDesc = finalDesc.trim().substring(0, finalDesc.length-2);
        }
        row.description = [
          {
            text: finalDesc,
          },
        ];
      }
      if (row.nameExtended && row.brandText) {
        let finalDescription = '';
        row.brandText.forEach(item => {
          finalDescription += item.text + " - ";
        });
        row.nameExtended.forEach(item => {
          finalDescription += item.text;
        });
        row.nameExtended = [
          {
            text: finalDescription,
          },
        ];
      }
      /*if (row.specifications) {
        console.log("specifications available ")
        let finalSpecifications = '';
        row.specifications.forEach(item => {
          finalSpecifications += item.text + " || ";
        });
        if (finalSpecifications.trim().endsWith('||')) {
          finalSpecifications = finalSpecifications.trim().substring(0, finalSpecifications.length-2);
        }
        row.specifications = [
          {
            text: finalSpecifications,
          },
        ];
      }*/
      if(row.aggregateRating) {
        var rating = '';
        row.aggregateRating.forEach(item => {
          if(item.text != '') {
            rating = parseFloat(item.text).toFixed(3);
          }
        });
        row.aggregateRating = [
          {
            text: rating,
          },
        ];
      }
      if(row.aggregateRating2) {
        var rating = '';
        row.aggregateRating2.forEach(item => {
          if(item.text != '') {
            rating = parseFloat(item.text).toFixed(3);
          }
        });
        row.aggregateRating2 = [
          {
            text: rating,
          },
        ];
      }
      row = cleanUp(row);
    }
    
  }
  return data;
};

module.exports = { transform };
