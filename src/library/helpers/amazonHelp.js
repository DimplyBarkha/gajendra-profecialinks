
module.exports.AmazonHelp = class {
  constructor (context, helpers) {
    this.context = context;
    this.helpers = helpers;
  }

  // Function which sets the locale on amazon.com
  async setLocale (wantedZip) {
    await new Promise(resolve => setTimeout(resolve, 5000));
    const shouldChangeAddress = await this.helpers.checkAndReturnProp('div#nav-global-location-slot', 'css', 'innerText');

    if (shouldChangeAddress && shouldChangeAddress.includes(wantedZip)) {
      return;
    }

    try {
      await this.helpers.checkAndClick('span#glow-ingress-line2.nav-line-2', 'css', 6000);
      await new Promise(r => setTimeout(r, 2000));
      try {
        await this.helpers.checkAndClick('a#GLUXChangePostalCodeLink', 'css', 6000);
      } catch (e) {}
      await this.helpers.checkAndClick('input[aria-label="or enter a US zip code"]', 'css', 6000, wantedZip);
      await this.helpers.checkAndClick('input[aria-labelledby="GLUXZipUpdate-announce"]', 'css', 6000);
      await this.helpers.checkAndClick('button[name="glowDoneButton"]', 'css', 6000);
    } catch (exception) {
      console.log('Failed to update zipcode!');
      throw exception;
    }

    await new Promise(r => setTimeout(r, 5000));
  }
};
