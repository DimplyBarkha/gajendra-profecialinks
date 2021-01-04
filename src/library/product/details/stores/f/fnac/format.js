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

  for (const { group }
    of data) {
    for (const row of group) {
      if (row.description) {
        console.log('#########Checking transform#########');
        row.description[0].text = cleanUp(row.description[0].text);
      }
      if (row.enhancedContent) {
        row.enhancedContent[0].text = row.enhancedContent[0].text.replace(/<(style|script|noscript)\b[^<]*(?:(?!<\/(style|script|noscript)>)<[^<]*)*<\/(style|script|noscript)>/g, '').replace(/(<([^>]+)>)/ig, '').replace(/&nbsp;/g, '').trim();
      }

      if (row.specifications) {
        row.specifications = row.specifications.map((specification) => {
          return { text: specification.text.replace(/(\n\s*){5,}/g, ' || ').replace(/(\n\s*){4,}/g, ' || ').replace(/(\n\s*){3,}/g, ' : ').replace(/(\n\s*){1,}/g, ' : ') };
        });
      }

      if (row.imageZoomFeaturePresent) {
        row.imageZoomFeaturePresent[0].text = 'Yes';
      } else {
        row.imageZoomFeaturePresent[0].text = 'No';
      }

      /* if (row.brandText && row.name) {
        if (row.name[0].text.split(' ')[0] !== row.brandText[0].text) {
          // row.nameExtended[0].text = row.brandText[0].text + ' - ' + row.name[0].text;
          row.nameExtended = [{ text: row.brandText[0].text + ' - ' + row.name[0].text }];
        }
      } */

      if (!row.brandText) {
        row.brandText = [{ text: row.name[0].text.split(' ')[0] }];
      }

      if (row.mpc) {
        row.mpc[0].text = row.mpc[0].text.trim();
      }

      if (row.attributes) {
        row.attributes.forEach(elm => { elm.text = elm.text.replace(/[\n\s]+/, ' : '); });
      }
      if (row.videos) {
        const videos = Array.from(new Set(row.videos.map(elm => elm.text.trim())));
        row.videos = videos.map(text => ({ text }));
      }
      if (row.discount) {
        const discount = row.discount[0].text;
        const price = row.price[0].text;
        const listPrice = row.listPrice[0].text;
        row.promotion = [{ text: `Antes ${listPrice.trim()} ahora ${price.trim()}, Oportunidad ${discount.trim()}` }];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = el.text ? cleanUp(el.text) : el.text;
      }));
      if (row.description) {
        row.productDescriptionLength = [{ text: row.description[0].text.length }];
        row.productDescriptionWordCount = [{ text: row.description[0].text.split(' ').length }];
      }
    }
  }
  return data;
};
module.exports = { transform };
