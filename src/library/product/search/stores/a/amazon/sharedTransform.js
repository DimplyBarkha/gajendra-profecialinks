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
  let sponsRankCounter = state.sponsRankCounter || 0;
  const productCodes = state.productCodes || [];
  for (const { group } of data) {
    for (const row of group) {
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      } else {
        sponsRankCounter = sponsRankCounter + 1;
        row.rankSponsored = [{ text: sponsRankCounter }];
      }
      row.rank = [{ text: rankCounter }];

      /* not using the function.
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
      }; */

      if (row.productUrl && row.productUrl[0].text) {
        const domain = row.domain[0].text;
        const url = row.productUrl[0].text;
        const splitData = url.split(domain).map(elm => elm.split('amazon-adsystem.com')).flat();
        if (splitData.length > 2) {
          row.productUrl = [{ text: 'https://www.' + domain + splitData[2] }];
        }
      }

      if (row.sponsName && !row.name) {
        row.name = [{ text: row.sponsName[0].text }];
        delete row.sponsName;
      }

      if (row.sponsRatingCount && !row.ratingCount) {
        let replace = ['.', '.'];
        if (row.sponsorReplace) {
          replace = row.sponsorReplace[0].text.split('|');
        }
        row.ratingCount = [{ text: row.sponsRatingCount[0].text.replace(replace[0], replace[1]) }];
        row.reviewCount = [{ text: row.sponsRatingCount[0].text.replace(replace[0], replace[1]) }];
        delete row.sponsRatingCount;
      }

      if (row.sponsAgRating && !row.aggregateRating2) {
        let replace = ['.', '.'];
        if (row.sponsorReplace) {
          replace = row.sponsorReplace[0].text.split('|');
        }
        row.aggregateRating2 = [{ text: row.sponsAgRating[0].text.replace(replace[0], replace[1]) }];
        delete row.sponsAgRating;
      }
      delete row.sponsorReplace;
      if (row.sponsThumbnail && !row.thumbnail) {
        row.thumbnail = [{ text: row.sponsThumbnail[0].text }];
      }

      const subscribe = Boolean(row.sub_and_save);
      row.subscribe = [{
        text: subscribe.toString(),
        type: 'BOOLEAN',
        value: subscribe,
      }];
      if (row.badgeType) {
        let pantry = false;
        let prime = false;
        row.badgeType.forEach(badge => {
          if (badge.text.includes('rime')) {
            prime = true;
          }
          if (badge.text.includes('antry')) {
            pantry = true;
          }
        });
        row.pantry = [{
          text: pantry.toString(),
          type: 'BOOLEAN',
          value: pantry,
        }];
        row.prime = [{
          text: prime.toString(),
          type: 'BOOLEAN',
          value: prime,
        }];
      } else {
        row.pantry = [{
          text: 'false',
          type: 'BOOLEAN',
          value: false,
        }];
        row.prime = [{
          text: 'false',
          type: 'BOOLEAN',
          value: false,
        }];
      }
      if (row.price) {
        if (row.price.length > 1) {
          row.minPrice = [{
            text: row.price[0],
          }];
          row.maxPrice = [{
            text: row.price[1],
          }];
        }
      }
      if (row.listPrice) {
        if (row.listPrice.length > 1) {
          row.minListPrice = [{
            text: row.price[0],
          }];
          row.maxListPrice = [{
            text: row.price[1],
          }];
        }
      }
      delete row.sponsorReplace;
      delete row.domain;
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  context.setState({ sponsRankCounter });
  context.setState({ productCodes });
  console.log(productCodes);
  return data;
};
module.exports = { transform };
