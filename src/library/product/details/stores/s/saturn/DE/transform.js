/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const clean = text => text.toString()
    .replace(/\r\n|\r|\n/g, ' ')
    .replace(/&amp;nbsp;|&nbsp;/g, ' ')
    .replace(/&amp;#160/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .replace(/"\s{1,}/g, '"')
    .replace(/\s{1,}"/g, '"')
    .replace(/^ +| +$|( )+/g, ' ')
    .trim()
    // eslint-disable-next-line no-control-regex
    .replace(/[\x00-\x1F]/g, '')
    .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
  for (const { group } of data) {
    for (const row of group) {
      if (row.specifications) {
        const text = row.specifications.map(elm => elm.text.trim().replace(/\n/, ' : ')).join(' || ');
        row.specifications = [{ text }];
      }
      if (row.promotion) {
        const text = row.promotion.map(elm => elm.text.trim()).join(', ');
        row.promotion = [{ text }];
      }

      if (row.listPrice) {
        const text = row.listPrice.map(elm => elm.text.replace(/\s/g, '').replace('UVP', '').trim());
        row.listPrice = [{ text }];
      }
      if (row.description) {
        const text = row.description[0].text.replace(/<li>/g, '<li> || ').replace(/(<([^>]+)>)/ig, '').trim();
        row.description = [{ text }];
      }
      if (row.videos) {
        let videos = row.videos.map(elm => elm.text.trim());
        videos = Array.from(new Set(videos)).map(elm => ({ text: elm }));
        row.videos = videos;
      }
      // if (row.unInterruptedPDP) {
      //   for (let i = 0; i < row.unInterruptedPDP.length; i++) {
      //   row.unInterruptedPDP[i].text = `|| ${row.unInterruptedPDP[i].text}`;
      //   }
      //   }
      if (row.variantInformation) {
        const variant = row.variantInformation[0].text.split(':');
        let text = '';
        if (variant.length === 2) {
          text = variant[1];
        } else {
          text = variant[0];
        }
        row.variantInformation = [{ text }];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};
module.exports = { transform };
