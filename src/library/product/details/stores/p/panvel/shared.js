
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
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
      if ((!row.directions || !row.directions.length) && row.directions1) {
        console.log('directions1',row.directions1);
        row.directions = row.directions1;
        console.log("directions", row.directions);
      }
      if ((!row.brandText || !row.brandText.length) && row.brandText1) {
        console.log('brandText1',row.brandText1);
        row.brandText = row.brandText1;
        console.log("brandText", row.brandText);
      }
      if ((!row.ingredientsList || !row.ingredientsList.length) && row.ingredientsList1) {
        console.log('ingredientsList1',row.ingredientsList1);
        row.ingredientsList = row.ingredientsList1;
        console.log("ingredientsList", row.ingredientsList);
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} `;
        });
        row.description = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ':')} | `;
        });
        row.additionalDescBulletInfo = [
          {
            text: text.slice(0, -3),
          },
        ];
      }

      if (row.otherSellersShipping2) {
        for (const item of row.otherSellersShipping2) {
          if (item.text.toLowerCase().includes('free')) {
            item.text = '0.00';
          } else if (item.text.match(/\$([^\s]+)/)) {
            item.text = item.text.match(/\$([^\s]+)/)[1];
          }
        }
      }
      if (row.price) {
        let text = '';
        row.price.forEach(item => {
          text += `${item.text.replace('.', ',')} `;
        });
        row.price = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.listPrice) {
        let text = '';
        row.listPrice.forEach(item => {
          text += `${item.text.replace('.', ',')} `;
        });
        row.listPrice = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.promotion) {
        for (const item of row.promotion) {
          if (item.text.includes('\n')) {
            item.text = item.text.replace(/\n/g, '');
          }
        }
      }

      if (row.category) {
        for (const item of row.category) {
          if (item.text.includes('/ ')) {
            item.text = item.text.replace('/ ', '');
          }
        }
      }

      if (row.variantAsins) {
        for (const item of row.variantAsins) {
          if (item.text.match(/(.+),(.+)/)) {
            item.text = item.text.match(/(.+),(.+)/)[2];
          }
        }
      }

      if (row.variantCount) {
        row.variantCount.forEach(item => {
          if (item.text === '0') {
            row.variantCount = [
              {
                text: '1',
              },
            ];
          }
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
