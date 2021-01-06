
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
      if (row.description) {
        let text = '';
        row.description.forEach(item => {
          text += item.text.replace(/\\n/g, ' ');
        });
        row.description = [
          {
            text: text,
          },
        ];
      }
      if (row.manufacturerDescription) {
        let text = '';
        row.manufacturerDescription.forEach(item => {
          text += item.text.replace(/\\n/g, ' ');
        });
        row.manufacturerDescription = [
          {
            text: text,
          },
        ];
      }
      if (row.aggregateRating) {
        let text = '';
        let rating = '';
        row.aggregateRating.forEach(item => {
          text += item.text;
          rating = parseFloat(text).toFixed(2).replace('.', ',');
        });
        row.aggregateRating = [
          {
            text: rating,
          },
        ];
      }
      if (row.specifications) {
        let text = '';
        let count = 0;
        row.specifications.forEach(item => {
          count++;
          const val = (count % 2);
          if (val === 0) {
            text += `: ${item.text}`;
          } else {
            text += ` | ${item.text}`;
          }
        });
        row.specifications = [
          {
            text: text.replace(new RegExp('(\\s\\|\\s)(.+)', 'g'), '$2'),
          },
        ];
      }
      if (row.productOtherInformation) {
        let text = '';
        let count = 0;
        row.productOtherInformation.forEach(item => {
          count++;
          const val = (count % 2);
          if (val === 0) {
            text += ` ${item.text}`;
          } else {
            text += ` || ${item.text}`;
          }
        });
        row.productOtherInformation = [
          {
            text: text.replace(new RegExp('(\\s\\|\\|\\s)(.+)', 'g'), '$2'),
          },
        ];
      }
      if (row.inTheBoxUrl) {
        row.inTheBoxUrl.forEach(item => {
          if (item.text.includes('200w')) {
            item.text = item.text.match(/^.*(?=\s200w)/gm) ? item.text.match(/^.*(?=\s200w)/gm)[0] : ''
          }
          if (!(item.text.startsWith('http'))) {
            const img = item.text;
            const imgText = 'https:' + img;
            item.text = imgText;
          }
        });
      }
    }
  }
  return data;
};

module.exports = { transform };
