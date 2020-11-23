/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const cleanUp = (data, context) => {
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
  const nutritionalProps = ['totalFatPerServing', 'saturatedFatPerServing', 'sodiumPerServing', 'totalCarbPerServing', 'dietaryFibrePerServing', 'totalSugarsPerServing', 'proteinPerServing', 'saltPerServing'];
  for (const { group } of data) {
    for (const row of group) {
      for (let i = 0; i < nutritionalProps.length; i++) {
        if (row[nutritionalProps[i]] && row[nutritionalProps[i]][0].text) {
          console.log('Value' + row[nutritionalProps[i]][0].text);
          row[nutritionalProps[i]] = [
            {
              text: row[nutritionalProps[i]][0].text.replace(',', '.'),
            },
          ];
        }
      }

      if (row.caloriesPerServing && row.caloriesPerServing[0].text === '/') {
        delete row.caloriesPerServing;
      }

      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += `${item.text.trim()} `;
        });
        row.description = [
          {
            text: text.trim(),
          },
        ];
      }

      if (row.nameExtended && row.brandText) {
        row.nameExtended = [
          {
            text: `${row.brandText[0].text} - ${row.nameExtended[0].text}`,
          },
        ];
      }
      if (!row.description && row.descriptionAlternate) {
        row.description = [
          {
            text: row.descriptionAlternate[0].text,
          },
        ];
      }
    }
  }
  return data;
};

module.exports = { cleanUp };
