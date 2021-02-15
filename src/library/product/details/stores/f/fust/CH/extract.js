/** @format */

const { transform } = require('./format');
module.exports = {
	implements: 'product/details/extract',
	parameterValues: {
		country: 'CH',
		store: 'fust',
		transform,
		domain: 'fust.ch',
		zipcode: '',
	},
	implementation: async (
		{ inputString },
		{ country, domain, transform },
		context,
		{ productDetails }
	) => {
		await new Promise((resolve, reject) => setTimeout(resolve, 3000));
		const applyScroll = async function (context) {
			await context.evaluate(async function () {
				let scrollTop = 0;
				while (scrollTop !== 20000) {
					await stall(1000);
					scrollTop += 4000;
					window.scroll(0, scrollTop);
					if (scrollTop === 20000) {
						await stall(1000);
						break;
					}
				}
				function stall(ms) {
					return new Promise((resolve, reject) => {
						setTimeout(() => {
							resolve();
						}, ms);
					});
				}
				function addHiddenDiv(id, content) {
					const newDiv = document.createElement('div');
					newDiv.id = id;
					newDiv.textContent = content;
					newDiv.style.display = 'none';
					document.body.appendChild(newDiv);
				}
				try {
					// @ts-ignore
					const videos = DemoUpVars[0].movies
						.map(
							(m) =>
								`http:${
									m.videos.find((v) => v.quality === 'HD').videoFiles[0].fileURI
								}`
						)
						.join('|');
					addHiddenDiv('ii_videos', videos);
				} catch (error) {
					console.log('no demo videos');
				}
				//Adding a fix for the video issue
			});
		};
		await applyScroll(context);
		await context.evaluate(() => {
			try {
				const videoElementArray = document.querySelectorAll(
					'div[class*="videocontainer"] div input'
				);
				const videoJsonData =
					videoElementArray &&
					[...videoElementArray][0] &&
					[...videoElementArray][0].getAttribute('value');
				const obj = JSON.parse(videoJsonData);
				const videoLink =
					obj && obj.playlist && obj.playlist[0] && obj.playlist[0].file;
				const finalVideoLink = `https:${videoLink}`;
				const videoInformationDiv = document.createElement('div');
				videoInformationDiv.className = 'videoinformation';
				videoInformationDiv.setAttribute('videolink', finalVideoLink);
				document.body.append(videoInformationDiv);
			} catch (e) {
				console.log(
					`Some error occured while retriving the video information ${e}`
				);
			}
		});
		await new Promise((resolve, reject) => setTimeout(resolve, 3000));
		return await context.extract(productDetails, { transform });
	},
};
