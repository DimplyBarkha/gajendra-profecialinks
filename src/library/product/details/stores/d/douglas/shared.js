/**
 *
 * *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.description) {
        row.description.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
        });
      }
      if (row.shippingInfo) {
        row.shippingInfo.forEach(item => {
          item.text = item.text.replace(/(\s?\n)+/g, ' || ').trim();
        });
      }
      if (row.nameExtended) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.nameExtended.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + ' ';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.nameExtended = nDesc;
      }
      if (row.name) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.name.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + ' ';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.name = nDesc;
      }
      if (row.aggregateRating) {
        let text = '';
        row.aggregateRating.forEach(item => {
          text = item.text.replace('.', ',');
        });
        row.aggregateRating = [{ text }];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.additionalDescBulletInfo = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if ( row.variantCount) {
        // 
        row.variantCount.forEach(item => {
          item.text = item.text === "1" ? "" : item.text;
        });
      };
      
    }
  }
  return data;
};

module.exports = { transform };