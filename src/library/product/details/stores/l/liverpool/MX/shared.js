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
  for (const { group } of data) {
    for (const row of group) {
      try {
        if (row.aggregateRating) {
          row.aggregateRating = [{ text: parseFloat(row.aggregateRating[0].text).toFixed(1) }];
        }

        if (row.specifications) {
          let text = '';
          row.specifications.forEach(item => {
            text += `${item.text.replace(/\n/g, ' : ')} || `;
          });
          row.specifications = [
            {
              text: text.slice(0, -4),
            },
          ];
        }

        if (row.promotion) {
          let text = '';
          row.promotion.forEach(item => {
            text += `${item.text} `;
          });
          row.promotion = [
            {
              text: text.trim(),
            },
          ];
        }

        if (row.videos) {
          let text = '';
          row.videos.forEach(item => {
            text += `${item.text} | `;
          });
          row.videos = [
            {
              text: text.slice(0, -3),
            },
          ];
        }

        if (row.quantity && row.quantity[0].text.match('Capacidad:(.+).')) {
          row.quantity = [{
            text: row.quantity[0].text.match('Capacidad:(.+).')[1].trim(),
          }];
        }

        if (row.brandText && row.brandText[0].text.match('Marca:(.+).')) {
          row.brandText = [{
            text: row.brandText[0].text.match('Marca:(.+).')[1].trim(),
          }];
        }

        if (row.ingredientsList && row.ingredientsList[0].text.match('Ingredientes:(.+).')) {
          row.ingredientsList = [{
            text: row.ingredientsList[0].text.match('Ingredientes:(.+).')[1].trim(),
          }];
        }

        if (row.packSize && row.packSize[0].text.match('Número de piezas:(.+).')) {
          row.packSize = [{
            text: row.packSize[0].text.match('Número de piezas:(.+).')[1].trim(),
          }];
        }
      } catch (err) {
        console.log('Error while applying transformations');
      }
    }
  }
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { cleanUp };
