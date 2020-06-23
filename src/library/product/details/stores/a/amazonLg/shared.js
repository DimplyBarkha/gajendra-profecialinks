
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
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.alternateImages) {
        row.alternateImages.forEach(item => {
          item.text = `${item.text.replace('US40_', '')}`;
        });
      }
      if (row.manufacturerDescription) {
        row.manufacturerDescription.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.description) {
        row.description.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.warnings) {
        row.warnings.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.promotion) {
        row.promotion.forEach(item => {
          item.text = cleanUp(item.text);
        });
      }
      if (row.sales_rank) {
        row.sales_rank.forEach(item => {
          item.text = cleanUp(item.text);
          item.text = `${item.text.replace(/\([^()]*\)/g, '')}`;
          item.text = item.text.split('#');
          item.text = item.text.filter(Boolean);
          const saleRank = [];
          for (let index = 0; index < item.text.length; index++) {
            saleRank.push(item.text[index].split('in')[0]);
          }
          item.text = saleRank.join('|');
        });
        row.sales_rank_category.forEach(item => {
          item.text = cleanUp(item.text);
          item.text = `${item.text.replace(/\([^()]*\)/g, '')}`;
          item.text = item.text.split('#');
          item.text = item.text.filter(Boolean);
          const saleRankCategory = [];
          for (let index = 0; index < item.text.length; index++) {
            saleRankCategory.push(item.text[index].split('in')[1]);
          }
          item.text = saleRankCategory.join('|');
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
