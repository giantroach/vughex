module.exports = {
    configureWebpack: (config) => {
        config.output.filename = 'modules/[name].js';
        config.output.chunkFilename = 'modules/[name].js';
    },
};
