
/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, inputs) => {
  // console.log(inputs, '<=========');
  for (const { group } of data) {
    for (const row of group) {
      // let text = '';
      // text = [String(row.brandText && row.brandText[0].text), String(row.name && row.name[0].text)].filter(e => e !== 'undefined').join(' - ');
      // row.nameExtended = [
      //   {
      //     text: text,
      //   },
      // ];
      if (row.totalFatPerServing) {
        let text = '';
        row.totalFatPerServing.forEach(item => {
          text += item.text.replace(',', '.');
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
          text += item.text.replace(',', '.');
        });
        row.saturatedFatPerServing = [
          {
            text: text,
          },
        ];
      }

      if (row.totalCarbPerServing) {
        let text = '';
        row.totalCarbPerServing.forEach(item => {
          text += item.text.replace(',', '.');
        });
        row.totalCarbPerServing = [
          {
            text: text,
          },
        ];
      }

      if (row.dietaryFibrePerServing) {
        let text = '';
        row.dietaryFibrePerServing.forEach(item => {
          text += item.text.replace(',', '.');
        });
        row.dietaryFibrePerServing = [
          {
            text: text,
          },
        ];
      }

      if (row.totalSugarsPerServing) {
        let text = '';
        row.totalSugarsPerServing.forEach(item => {
          text += item.text.replace(',', '.');
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
          text += item.text.replace(',', '.');
        });
        row.proteinPerServing = [
          {
            text: text,
          },
        ];
      }

      if (row.saltPerServing) {
        let text = '';
        row.saltPerServing.forEach(item => {
          text += item.text.replace(',', '.');
        });
        row.saltPerServing = [
          {
            text: text,
          },
        ];
      }
      if (row.otherSellersName) {
        let text = '';
        row.otherSellersName.forEach(item => {
          text = row.otherSellersName.map(elm => elm.text).join(' | ');
        });
        row.otherSellersName = [{ text }];
      }

      if (row.drive) {
        const driveJson = JSON.parse(row.drive[0].text);
        row.drive[0].text = driveJson.zipcode;
        row.retailerId[0].text = driveJson.zipcode;
        row.driveId[0].text = driveJson.zipcode;
      }
    }
  }

  try{
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
      if(el.text){
        el.text = clean(el.text);
      }
    }))));
  }catch(e){
    console.log(e);
  }

  return data;
};

module.exports = { transform };
