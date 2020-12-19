/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  let nameData = "";
  let brandData = "";
  function remove_character(str, char_pos) {
    var part1 = str.substring(0, char_pos);
    var part2 = str.substring(char_pos + 1, str.length);
    return (part1 + part2);
  }
  for (const { group } of data) {
    for (const row of group) {
      if (row.name) {
        row.name.forEach(item => {
          nameData = item.text;
        });
      }
      // if (row.brandText) {
      //   row.brandText.forEach(item => {
      //     brandData = item.text;
      //   });
      // }
      if (row.price) {
        row.price.forEach(item => {
          item.text = item.text.replace("(Oferta)", '').trim();
          item.text = item.text.replace(/(\s*\(Precio\s+final\)\s*)+/g, '').trim();
          item.text = item.text.replace('.', ',');
        });
      }
      var sepratorIndex = nameData.indexOf('-');
      nameData = remove_character(nameData, sepratorIndex);
      nameData = remove_character(nameData, sepratorIndex);
      row.name = [{ text: nameData }];
    }
  }
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
  for (const { group } of data) {
    for (const row of group) {
      rankCounter += 1;
      if (!row.sponsored) {
        orgRankCounter += 1;
        row.rankOrganic = [{ text: orgRankCounter }];
      }
      row.rank = [{ text: rankCounter }];
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }

  context.setState({ rankCounter });
  context.setState({ orgRankCounter });
  data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
    el.text = clean(el.text);
  }))));
  return data;
};

module.exports = { transform };