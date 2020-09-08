
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
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
      if (row.listPrice) {
        var r = /\d+/;
        let text = '';
        row.listPrice.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}   `;
        });
        row.listPrice = text.match(r);
      } 
      if (row.harvestedListPrice) {
        var r = /\d+/;
        let text = '';
        row.harvestedListPrice.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}   `;
        });
        row.harvestedListPrice = text.match(r);
      } 
      if (row.onlinePrice) {
        var r = /\d+/;
        let text = '';
        row.onlinePrice.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}   `;
        });
        row.onlinePrice = text.match(r);
      } 
      if (row.harvestedPrice) {
        var r = /\d+/;
        let text = '';
        row.harvestedPrice.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')}   `;
        });
        row.harvestedPrice = text.match(r);
      } 
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.description = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
       if (row.productOtherInformation) {
        let text = '';
        row.productOtherInformation.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.productOtherInformation = [
          {
            text: text.slice(0, -4),
          },
        ];
      } 
      if (row.alternateImages) {
        let text = '';
        row.alternateImages.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.alternateImages = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { transform };
