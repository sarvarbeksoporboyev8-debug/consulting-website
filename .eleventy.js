module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("img");
  eleventyConfig.addPassthroughCopy("fonts");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("favicon.ico");
  eleventyConfig.addPassthroughCopy("favicon.svg");

  // Custom filters for data-driven templates
  eleventyConfig.addFilter("head", function (array, n) {
    if (!Array.isArray(array)) return array;
    return array.slice(0, n);
  });

  eleventyConfig.addFilter("slice", function (array, start, end) {
    if (!Array.isArray(array)) return array;
    return array.slice(start, end);
  });

  eleventyConfig.addFilter("striptags", function (str) {
    if (!str) return str;
    return String(str).replace(/<[^>]*>/g, "");
  });

  // Global data: compute language helpers for every page
  eleventyConfig.addGlobalData("eleventyComputed", {
    // L = language code string (e.g. "en", "uz")
    L: function (data) {
      if (data.lang && data.lang.code) return data.lang.code;
      return "en";
    },
    // t = UI translation strings for current language
    t: function (data) {
      var code = (data.lang && data.lang.code) ? data.lang.code : "en";
      return data.ui ? (data.ui[code] || data.ui.en) : {};
    },
    // langRoot = path prefix for assets/links (e.g. "" for root, "../" for subdir)
    langRoot: function (data) {
      if (!data.lang || !data.lang.code) return "";
      // Pages in language subdirs need ../ to reach root assets
      return "../";
    }
  });

  return {
    dir: {
      input: "src",
      output: "_site",
      includes: "_includes",
      data: "_data"
    },
    templateFormats: ["njk"],
    htmlTemplateEngine: "njk"
  };
};
