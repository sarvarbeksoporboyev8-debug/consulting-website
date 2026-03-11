module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("css");
  eleventyConfig.addPassthroughCopy("js");
  eleventyConfig.addPassthroughCopy("robots.txt");
  eleventyConfig.addPassthroughCopy("favicon.ico");

  // Custom filters for data-driven templates
  eleventyConfig.addFilter("head", function (array, n) {
    if (!Array.isArray(array)) return array;
    return array.slice(0, n);
  });

  eleventyConfig.addFilter("slice", function (array, start, end) {
    if (!Array.isArray(array)) return array;
    return array.slice(start, end);
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
