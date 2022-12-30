module.exports = {
  configureWebpack: (config) => {
    config.output.filename = "modules/[name].js";
    config.output.chunkFilename = "modules/[name].js";
    config.watchOptions ||= {};
    config.watchOptions.aggregateTimeout = 200;
    config.watchOptions.poll = 1000;
  },
};
