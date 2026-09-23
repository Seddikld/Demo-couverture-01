/*
 * GlowHomeFinds — site settings (the ONLY file you need to change).
 *
 * After editing, run `npm run build` inside /tools to regenerate every page,
 * image, sitemap and share tag with the new values. The browser also reads
 * this file, so affiliate links update even without a rebuild.
 */
var SITE_CONFIG = {
  BRAND_NAME: "GlowHomeFinds",

  // Temporary: official product page. Replace with the Impact/Govee affiliate link once approved.
  AFFILIATE_LINK: "https://us.govee.com/products/govee-permanent-outdoor-lights-2",

  // Kept for reference; the product page link above is also what the "official page" mentions use.
  PRODUCT_PAGE: "https://us.govee.com/products/govee-permanent-outdoor-lights-2",

  CONTACT_EMAIL: "contact@glowhomefinds.com",

  // Final live address, no trailing slash.
  SITE_URL: "https://glowhomefinds.netlify.app",

  // Date the price below was last checked.
  PRICE_CHECK_DATE: "September 23, 2026",
  PRICE_FROM: "$279.99"
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = SITE_CONFIG;
} else {
  window.SITE_CONFIG = SITE_CONFIG;
}
