module.exports.transform = (data, context) => {
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
  for (const { group } of data) {
    for (const row of group) {
      if (row.id && row.id[0]) {
        rankCounter += 1;
        if (!row.sponsored) {
          orgRankCounter += 1;
          row.rankOrganic = [{ text: orgRankCounter }];
        } else {
          sponsRankCounter = sponsRankCounter + 1;
          row.rankSponsored = [{ text: sponsRankCounter }];
        }
        row.rank = [{ text: rankCounter }];
      } else {
        console.log(`${row.id[0].text} : ${row.name[0].text}`);
        row.id = [{ text: '' }];
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
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  return data;
};
