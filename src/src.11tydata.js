module.exports = {
  eleventyComputed: {
    permalink: function (data) {
      // Pages with pagination handle their own permalink
      if (data.pagination) return data.permalink;
      // If page sets its own permalink, respect it
      if (data.permalink) return data.permalink;
      // Default: use file stem + .html
      return data.page.filePathStem + ".html";
    }
  }
};
