/**
*
* @param {ImportIO.Group[]} data
* @returns {ImportIO.Group[]}
*/
const transform = (data) => {
    const cleanUp = text => text.toString()
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
        if (row.variantId) {
          if (row.variantId.length > 1) {
            row.variantId.shift();
          }
        }
        if (row.variantUrl) {
          if (row.variantUrl.length > 1) {
            row.variantUrl.shift();
          }
        }
        if (row.variantAsins) {
          let text = '';
          row.variantAsins.forEach(item => {
            text += `${item.text} | `;
          });
          row.variantAsins = [
            {
              text: cleanUp(text.slice(0, -3)),
            },
          ];
        }
        if (row.variants) {
          let text = '';
          row.variants.forEach(item => {
            text += `${item.text} | `;
          });
          row.variants = [
            {
              text: cleanUp(text.slice(0, -3)),
            },
          ];
          row.firstVariant = row.gtin;
        }
      }
    }
    return data;
  };
module.exports = { transform };