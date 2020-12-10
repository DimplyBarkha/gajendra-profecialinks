
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // Default transform function
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));

  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.specifications = [
          {
            text: text,
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.image) {
        const img = [];
        row.image.forEach(item => {
          if (item.text.indexOf('https:') === -1) {
            item.text = `https:${item.text}`;
          }
        });
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += item.text.replace(/\s{2,}/g, ' ').replace(/\n/g, ' ').trim();
        });
        row.manufacturerDescription = [
          {
            text: text,
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ' ')} || `;
        });
        row.description = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        row.specifications.forEach(item => {
          text += `${item.text.replace(/\n \n/g, '')} || `;
        });
        row.specifications = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
      if (row.brandText) {
        let text = '';
        row.brandText.forEach(item => {
          text += `${item.text.replace('bz', '')}`;
        });
        row.brandText = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if ((!row.quantity || !row.quantity.length) && row.quantity1) {
        console.log('quantity1',row.quantity1);
        row.quantity = row.quantity1;
        console.log("quantity", row.quantity);
      }
      if ((!row.quantity || !row.quantity.length) && row.quantity2) {
        console.log('quantity2',row.quantity2);
        row.quantity = row.quantity2;
        console.log("quantity", row.quantity);
      }
      if (row.saltPerServing) {
        let text = '';
        row.saltPerServing.forEach(item => {
          text += `${item.text.replace(/\n \n/g, '')}.`;
        });
        row.saltPerServing = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.replace('•', '||')} `;
        });
        row.description = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if ((!row.saltPerServing || !row.saltPerServing.length) && row.saltPerServing1) {
        console.log('saltPerServing1', row.saltPerServing1);
        row.saltPerServing = row.saltPerServing1;
        console.log('saltPerServing', row.saltPerServing);
      }
      if ((!row.totalFatPerServing || !row.totalFatPerServing.length) && row.totalFatPerServing1) {
        console.log('totalFatPerServing1', row.totalFatPerServing1);
        row.totalFatPerServing = row.totalFatPerServing1;
        console.log('totalFatPerServing', row.totalFatPerServing);
      }
      if ((!row.dietaryFibrePerServing || !row.dietaryFibrePerServing.length) && row.dietaryFibrePerServing1) {
        console.log('dietaryFibrePerServing1', row.dietaryFibrePerServing1);
        row.dietaryFibrePerServing = row.dietaryFibrePerServing1;
        console.log('dietaryFibrePerServing', row.dietaryFibrePerServing);
      }
      if ((!row.proteinPerServing || !row.proteinPerServing.length) && row.proteinPerServing1) {
        console.log('proteinPerServing1', row.proteinPerServing1);
        row.proteinPerServing = row.proteinPerServing1;
        console.log('proteinPerServing', row.proteinPerServing);
      }
      if (row.saltPerServing) {
        let text = '';
        row.saltPerServing.forEach(item => {
          text += `${item.text.replace(/\n \n/g, '')}.`;
        });
        row.saltPerServing = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.totalFatPerServing) {
        let text = '';
        row.totalFatPerServing.forEach(item => {
          text += `${item.text.replace(/\n \n/g, '')}.`;
        });
        row.totalFatPerServing = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.dietaryFibrePerServing) {
        let text = '';
        row.dietaryFibrePerServing.forEach(item => {
          text += `${item.text.replace(/\n \n/g, '')}.`;
        });
        row.dietaryFibrePerServing = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.proteinPerServing) {
        let text = '';
        row.proteinPerServing.forEach(item => {
          text += `${item.text.replace(/\n \n/g, '')}.`;
        });
        row.proteinPerServing = [
          {
            text: text.slice(0, -1),
          },
        ];
      }
      if (row.additionalDescBulletInfo) {
        let text = '';
        row.additionalDescBulletInfo.forEach(item => {
          text += `${item.text.replace(/\n \n/g, ' ')} || `;
        });
        row.additionalDescBulletInfo = [
          {
            text: text.slice(0, -3),
          },
        ];
      }
    }
  }
  return data;
};
module.exports = { transform };
