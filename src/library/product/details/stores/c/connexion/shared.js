/**
 *@param {ImportIO.Group[]} data
 *@returns {ImportIO.Group[]}
 *  */

const transform = (data) => {
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/[\r\n]+/g, ':').replace(/\n \n/g, ':')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.weightGross) {
        let text = '';
        row.weightGross.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.weightGross = [
          {
            text: text.slice(0, -4),
          },
        ];
      }

      if (row.weightNet) {
        let text = '';
        row.weightNet.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} || `;
        });
        row.weightNet = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.shippingDimensions) {
        let text = '';
        let count = 0;
        row.shippingDimensions.forEach(item => {
          if (count % 2 === 0) {
            text += `${item.text.replace(/\n \n/g, '')} : `;
          } else {
            text += `${item.text.replace(/\n \n/g, '')} || `;
          }
          count++;
        });
        row.shippingDimensions = [
          {
            text: text.slice(0, -4),
          },
        ];
      }
      if (row.alternateImages) {
        const newAlternateImages = row.alternateImages.map(item => {
          return {
            text: `${item.text.replace('/75/', '/640/').replace('75.jpg', '640.jpg')}`,
          };
        });
        row.alternateImages = newAlternateImages;
      }
    }
  }
  return data;
};
module.exports = { transform };
