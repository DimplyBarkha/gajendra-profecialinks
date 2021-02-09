/**
 *
 * @param {ImportIO.Group[]} data
 * @returns {ImportIO.Group[]}
 */
const transform = (data, context) => {
  const cleanUp = (data) => {
    const clean = text => text.toString()
      .replace(/\r\n|\r|\n/g, ' ')
      .replace(/&amp;nbsp;/g, ' ')
      .replace(/&amp;#160/g, ' ')
      .replace(/\u00A0/g, ' ')
      .replace(/\s{2,}/g, ' ')
      .replace(/"\s{1,}/g, '" ')
      .replace(/\s{1,}"/g, ' "')
      .replace(/^ +| +$|( )+/g, ' ')
      // eslint-disable-next-line no-control-regex
      .replace(/[\x00-\x1F]/g, '')
      .replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ' ');
    data.forEach(obj => obj.group.forEach(row => Object.keys(row).forEach(header => row[header].forEach(el => {
      el.text = clean(el.text);
    }))));
    return data;
  };
  const state = context.getState();
  let indexTemp = state.indexTemp || 0;
  for (const { group } of data) {
    for (const row of group) {
      if (row.variantId) {
        console.log('row.variankjklfd')
        console.log(row.variantId);
        if (row.variantId[0] && row.variantId[0].text) {
          console.log('row.variankjk dfd dtrt lfd')
          console.log(row.variantId[0]);
          console.log(row.variantId[0].text);
          if (row.variantId[0].text.includes(',')) {
            var arrIds = row.variantId[0].text.split(',');
            arrIds.length > 1 && arrIds.splice(0, 1);
            row.variantId = [{ text: arrIds[indexTemp] }];
            row.sku = [{ text: arrIds[indexTemp] }];
          }
        }
      }
      if (row.sku) {
        var arrSkus = row.sku[0].text.split(',');
        arrSkus.length > 1 && arrSkus.splice(0, 1);
        row.sku = [{ text: arrSkus[indexTemp] }];
      }
      if (row.altVariantId) {
        row.variantId = [{ text: row.altVariantId[0].text }];
      }
      if (row.altVariantSku) {
        row.sku = [{ text: row.altVariantSku[0].text }];
      }
      if (row.additionalDescBulletInfo) {
        var arrBullets = [];
        row.additionalDescBulletInfo.forEach(item => {
          arrBullets.push(item.text);
        });
        row.additionalDescBulletInfo = [{ text: arrBullets.join(' ') }];
        row.descriptionBullets = [{ text: arrBullets.length }];
      }
      if (row.alternateImages) {
        var arrImg = [];
        row.alternateImages.forEach(item => {
          arrImg.push(item.text);
        });
        row.alternateImages = [{ text: arrImg.join(' | ') }];
      }
      if (row.nameExtended && row.variantName) {
        row.nameExtended.forEach(item => {
          item.text = `${item.text} ${row.variantName[0].text}`;
        });
      }
      if (row.videos) {
        var arrVideos = [];
        var arrJsonVideo = JSON.parse(row.videos[0].text);
        arrJsonVideo.forEach(vdoUrl => {
          arrVideos.push(vdoUrl);
        });
        row.videos = [{ text: arrVideos.join(' | ') }];
      }
      indexTemp = indexTemp + 1;
    }
  }
  context.setState({ indexTemp });
  return cleanUp(data);
};

module.exports = { transform };
