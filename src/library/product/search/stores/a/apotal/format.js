/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data) => {
  for (const { group } of data) {
    var rank = 1;
    for (const row of group) {
      if (row.thumbnail) {
        const thumbnail = row.thumbnail.map((item) => {
          return 'https://shop.apotal.de' + item.text;
        });
        row.thumbnail = [{ text: thumbnail, xpath: row.thumbnail[0].xpath }];
      }
      if (row.aggregateRating) {
        console.log('row.aggregateRating ->', row.aggregateRating);
        // const aggregateRating = row.aggregateRating.map((item) => {
        //   return row.aggregateRating.text.length === 5 ? item.text.charAt(0) : '0';
        // });
        const aggregateRating = row.aggregateRating[0].text.length === 5 ? row.aggregateRating[0].text.charAt(0) : '0';
        console.log('aggregateRating ->', aggregateRating);
        // const rating = aggregateRating.length === 5 ? aggregateRating[0].charAt(0) : '0';
        row.aggregateRating = [{ text: aggregateRating, xpath: row.aggregateRating[0].xpath }];
      }
      const updatedRank = rank++;
      row.rankOrganic = [{ text: updatedRank }];
      row.rank = [{ text: updatedRank }];
    }
  }

  const clean = text =>
    text
      .toString()
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

  data.forEach(obj =>
    obj.group.forEach(row =>
      Object.keys(row).forEach(header =>
        row[header].forEach(el => {
          el.text = clean(el.text);
        }),
      ),
    ),
  );
  return data;
};

module.exports = { transform };
