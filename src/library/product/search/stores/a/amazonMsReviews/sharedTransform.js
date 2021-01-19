/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
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
  const state = context.getState();
  let orgRankCounter = state.orgRankCounter || 0;
  let rankCounter = state.rankCounter || 0;
  const productCodes = state.productCodes || [];
  for (const { group } of data) {
    for (const row of group) {
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];

      const filterStringToAfterSecondIndex = (string, text) => {
        const wordSize = text.length;
        let count = 0;
        let secondIdx = null;
        for (let i = 0; i < string.length; i++) {
          if (string.slice(i, wordSize + i) === text) {
            count++;
            if (count === 2) secondIdx = i;
          }
        }
        return string.slice(secondIdx);
      };

      if (row.productUrl && row.productUrl[0].text) {
        const url = row.productUrl[0].text;
        if (url.split('amazon.com').length > 2) {
          row.productUrl = [{ text: filterStringToAfterSecondIndex(url, 'https://www.amazon.com') }];
        } else if (url.split('amazon.de').length > 2) {
          row.productUrl = [{ text: filterStringToAfterSecondIndex(url, 'https://www.amazon.de') }];
        }
      }

      if (row.sponsName && !row.name) {
        row.name = [{ text: row.sponsName[0].text }];
        delete row.sponsName;
      }

      if (row.sponsRatingCount && !row.ratingCount) {
        row.ratingCount = [{ text: row.sponsRatingCount[0].text }];
        row.reviewCount = [{ text: row.sponsRatingCount[0].text }];
        delete row.sponsRatingCount;
      }

      if (row.sponsAgRating && !row.aggregateRating2) {
        row.aggregateRating2 = [{ text: row.sponsAgRating[0].text }];
        delete row.sponsAgRating;
      }

      if (row.sponsThumbnail && !row.thumbnail) {
        row.thumbnail = [{ text: row.sponsThumbnail[0].text }];
      }

      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ productCodes });
  console.log(productCodes);
  return data;
};
module.exports = { transform };
