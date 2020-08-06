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
  const getPrice = function (price) {
    if (price.includes('EUR') || price.includes('€')) {
      if (!price.includes('EUR') || (price.includes('EUR') && !price.replace(/\s/g, '').match(/\.\d{2}$/))) {
        price = price.replace('.', '');
        price = price.replace(',', '.');
      }
    } else if (price.includes('￥')) {
      price = price.replace('￥', '');
      price = price.replace(',', '');
    }
    price = price.replace(/[€,£$]|EUR|CDN/g, '');
    price = price.match(/([\d,.]+[.,][\d]+)/g);
    return price;
  };
  for (const { group } of data) {
    for (const row of group) {
      const sub_and_save = Boolean(row.sub_and_save);
      row.sub_and_save = [{
        text: sub_and_save.toString(),
        type: 'BOOLEAN',
        value: sub_and_save,
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
        row.price.forEach(item => {
          const price = getPrice(item.text);
          item.text = price && price[0];
          if (price && price.length > 1) {
            row.min_price = [{
              text: price[0],
            }];
            row.max_price = [{
              text: price[1],
            }];
          }
        });
      }
      if (row.original_price) {
        row.original_price.forEach(item => {
          const price = getPrice(item.text);
          item.text = price && price[0];
          if (price && price.length > 1) {
            row.min_original_price = [{
              text: price[0],
            }];
            row.max_original_price = [{
              text: price[1],
            }];
          }
        });
      }
      if (row.aggregateRatingText) {
        row.aggregateRating = [
          {
            text: row.aggregateRatingText[0].text.replace(/ \D.*/, ''),
          },
        ];
      }
      rankCounter = rankCounter + 1;
      if (!row.sponsored) {
        orgRankCounter = orgRankCounter + 1;
        row.rank_organic = [{ text: orgRankCounter }];
      } else {
        sponsRankCounter = sponsRankCounter + 1;
        row.rank_sponsored = [{ text: sponsRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      context.setState({ rankCounter });
      context.setState({ orgRankCounter });
      context.setState({ sponsRankCounter });
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};

module.exports = { transform };
