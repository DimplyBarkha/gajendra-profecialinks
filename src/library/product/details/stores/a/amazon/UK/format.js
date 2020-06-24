/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  const cleanUp = (data, context) => {
    let dataStr = JSON.stringify(data);
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
    for (const row of group) {
      if (row.servingSizeUom) {
        row.servingSizeUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.totalFatPerServingUom) {
        row.totalFatPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.saltPerServingUom) {
        row.saltPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.proteinPerServingUom) {
        row.proteinPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.sodiumPerServingUom) {
        row.sodiumPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.saturatedFatPerServingUom) {
        row.saturatedFatPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.totalCarbPerServingUom) {
        row.totalCarbPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.totalSugarsPerServingUom) {
        row.totalSugarsPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.ironPerServingUom) {
        row.ironPerServingUom.forEach(item => {
          item.text = `${item.text.replace(/(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1')}`;
        });
      }
      if (row.pricePerUnit) {
        row.pricePerUnit.forEach(item => {
          item.text = `${item.text.replace('(', '').replace(')', '')}`;
        });
      }
      if (row.pricePerUnitUom) {
        row.pricePerUnitUom.forEach(item => {
          item.text = `${item.text.replace(/.*(?:[\d]+(?:.[\d]+)?)\s{0,}(.*)/, '$1').replace('/', '').replace(')', '').trim()}`;
        });
      }
      if (row.news) {
        let text = '';
        row.news.forEach(item => {
          text += ` ${item.text}`;
        });
        row.news = [
          {
            text: cleanUp(text.slice(0, -4)),
          },
        ];
      }
      if (row.fastTrack) {
        let text = '';
        row.fastTrack.forEach(item => {
          text += ` ${item.text}`;
        });
        row.fastTrack = [
          {
            text: cleanUp(text.slice(0, -4)),
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach((item, index) => {
          if (index % 2 === 0) {
            text += `${item.text} : `;
          } else {
            text += `${item.text} || `;
          }
        });
        row.specifications = [
          {
            text: cleanUp(text.slice(0, -2)),
          },
        ];
      }
    }
  }
  return data;
};
module.exports = { transform };
