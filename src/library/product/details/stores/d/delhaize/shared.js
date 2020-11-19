
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
      if (row.caloriesPerServing) {
        let text = '';
        row.caloriesPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.caloriesPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.totalFatPerServing) {
        let text = '';
        row.totalFatPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.totalFatPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.saturatedFatPerServing) {
        let text = '';
        row.saturatedFatPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.saturatedFatPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.saltPerServing) {
        let text = '';
        row.saltPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.saltPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.totalCarbPerServing) {
        let text = '';
        row.totalCarbPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.totalCarbPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.totalSugarsPerServing) {
        let text = '';
        row.totalSugarsPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.totalSugarsPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.proteinPerServing) {
        let text = '';
        row.proteinPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.proteinPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.calciumPerServing) {
        let text = '';
        row.calciumPerServing.forEach(item => {
          text += `${item.text.replace(/mg|g/, '')}`;
        });
        row.calciumPerServing = [
          {
            text: text,
          },
        ];
      }
      row = cleanUp(row);
    }
    
  }
  return data;
};

module.exports = { transform };
