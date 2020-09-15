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
      if (row.description) {
        const text = row.description[0].text.replace(/<li[^>]+>/g, '<li> || ').replace(/(<([^>]+)>)/ig, '').trim();
        row.description = [{ text }];
      }
      if (row.aggregateRating) {
        const text = row.aggregateRating[0].text.replace(/./g, ',').trim();
        row.aggregateRating = [{ text }];
      }
      if (row.videos) {
        const videos = row.videos.map(video => {
          if (video.text.includes('url_video')) {
            const videoLink = video.text.match(/url_video\s*=\s*'([^']+);/) && video.text.match(/url_video\s*=\s*'([^']+);/)[1];
            if (!videoLink) return;
            return { text: videoLink };
          }
          if (video.text.includes('content.jwplatform.com')) {
            const json = JSON.parse(video.text);
            return { text: json.playlist.map(elm => `https${elm.file}`).join(' | ') };
          }
          return { text: video.text };
        });
        row.videos = videos.map(elm => elm);
      }
      if (row.manufacturerDescription) {
        const text = row.manufacturerDescription.map(elm => elm.text).join(' ');
        row.manufacturerDescription = [{ text }];
      }
      Object.keys(row).forEach(header => row[header].forEach(el => {
        el.text = clean(el.text);
      }));
    }
  }
  return data;
};
module.exports = { transform };
