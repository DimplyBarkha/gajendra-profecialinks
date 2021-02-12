/* eslint-disable no-unused-vars */
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  // @ts-ignore
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

  for (const { group } of data) {
    for (const row of group) {
      // if (row.description) {
      //   row.description.forEach(item => {
      //     const locText = item.text;
      //     const length = locText.length;
      //     const startIdx = locText.indexOf('\n \n \n');
      //     let lastIdx = locText.lastIndexOf('\n \n \n');
      //     if (startIdx === lastIdx) lastIdx = length - 1;
      //     let firstStr = locText.substring(0, startIdx);
      //     firstStr = firstStr.replace(/\n \n/g, ' ');
      //     let secStr = locText.substring(startIdx, lastIdx);
      //     secStr = secStr.replace(/\n \n \n/g, ' || ');
      //     secStr = secStr.replace(/\n \n/g, ' || ');
      //     let lastString = locText.substring(lastIdx, length);
      //     lastString = lastString.replace(/\n \n \n/g, ' || ');
      //     lastString = lastString.replace(/\n \n/g, ' ');

      //     item.text = firstStr + secStr + lastString;
      //     // console.log(item.text);
      //   });
      // }

      if (row.additionalDescBulletInfo) {
        row.additionalDescBulletInfo.forEach(item => {
          item.text = item.text.replace(/\n \n/g, ' | ');
          // console.log(item.text);
        });
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
      if (row.ingredientsList) {
        let text = '';
        row.ingredientsList.forEach(item => {
          if (item.text.includes('İçindekiler: ')) {
            text = `${item.text.replace('İçindekiler: ', '')}`;
          } else {
            text = item.text;
          }
        });
        row.ingredientsList = [
          {
            text: text,
          },
        ];
      }
      if (row.dietaryFibrePerServingUom) {
        let text = '';
        row.dietaryFibrePerServingUom.forEach(item => {
          text = `${item.text.split(',')[1]}`;
        });
        row.dietaryFibrePerServingUom = [
          {
            text: text.replace(' ', ''),
          },
        ];
      }
      if (row.totalFatPerServingUom) {
        let text = '';
        row.totalFatPerServingUom.forEach(item => {
          text = `${item.text.split(',')[1]}`;
        });
        row.totalFatPerServingUom = [
          {
            text: text.replace(' ', ''),
          },
        ];
      }
      if (row.totalCarbPerServingUom) {
        let text = '';
        row.totalCarbPerServingUom.forEach(item => {
          text = `${item.text.split(',')[1]}`;
        });
        row.totalCarbPerServingUom = [
          {
            text: text.replace(' ', ''),
          },
        ];
      }
      if (row.totalCarbPerServing) {
        let text = '';
        row.totalCarbPerServing.forEach(item => {
          if (item.text.includes(',')) {
            text = `${item.text.replace(',', '.')}`;
          } else {
            text = item.text;
          }
        });
        row.totalCarbPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.proteinPerServing) {
        let text = '';
        row.proteinPerServing.forEach(item => {
          if (item.text.includes(',')) {
            text = `${item.text.replace(',', '.')}`;
          } else {
            text = item.text;
          }
        });
        row.proteinPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.totalSugarsPerServingUom) {
        let text = '';
        row.totalSugarsPerServingUom.forEach(item => {
          text = `${item.text.split(',')[1]}`;
        });
        row.totalSugarsPerServingUom = [
          {
            text: text.replace(' ', ''),
          },
        ];
      }
      if (row.saltPerServingUom) {
        let text = '';
        row.saltPerServingUom.forEach(item => {
          text = `${item.text.split(',')[1]}`;
        });
        row.saltPerServingUom = [
          {
            text: text.replace(' ', ''),
          },
        ];
      }
      if (row.saturatedFatPerServingUom) {
        let text = '';
        row.saturatedFatPerServingUom.forEach(item => {
          text = `${item.text.split(',')[1]}`;
        });
        row.saturatedFatPerServingUom = [
          {
            text: text.replace(' ', ''),
          },
        ];
      }
      if (row.proteinPerServingUom) {
        let text = '';
        row.proteinPerServingUom.forEach(item => {
          text = `${item.text.split(',')[1]}`;
        });
        row.proteinPerServingUom = [
          {
            text: text.replace(' ', ''),
          },
        ];
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text = text + (text ? ' ' : '') + item.text;
          text = text.replace(/table.tableizer-table\s{(.*)}/g, '');
          text = text.replace(/\n/g, ' ').replace(/\s{2,}/g, ' ').trim();
        });
        row.manufacturerDescription = [{ text }];
      }
      if (row.manufacturerDescription) {
        const variantUrls = [];
        let dupUrl = '';
        let urls = [];
        row.manufacturerDescription.forEach(item => {
          console.log('item:: ', item.text);
          urls = row.manufacturerDescription.filter(it => item.text === it.text);
          if (urls && urls.length === 1) {
            variantUrls.push(item);
          } else {
            if (dupUrl !== item.text) {
              dupUrl = item.text;
              variantUrls.push(item);
            }
          }
        });
        row.manufacturerDescription = variantUrls;
      }
      if (row.specifications) {
        const nDesc = [];
        let newDesc = '';
        let idx = 0;
        row.specifications.forEach(item => {
          nDesc[0] = item;
          if (idx > 0) {
            newDesc = newDesc + '||';
          }
          newDesc = newDesc + item.text;
          idx++;
        });
        nDesc.forEach(item => {
          item.text = newDesc;
        });
        row.specifications = nDesc;
      }
    }
  }
  return data;
};

module.exports = { transform };
