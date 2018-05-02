const { injectBabelPlugin, getBabelLoader, getLoader } = require('react-app-rewired');
// const rewireSass = require('react-app-rewire-sass');

const rewireSass = config => {
    const cssLoader = getLoader(
      config.module.rules,
      rule => rule.test && String(rule.test) === String(/\.css$/)
    );
  
    const sassLoader = {
      test: /\.scss$/,
      use: [...(cssLoader.loader || cssLoader.use), 'sass-loader']
    };
  
    const oneOf = config.module.rules.find(rule => rule.oneOf).oneOf;
    oneOf.unshift(sassLoader);
  
    return config;
  }

module.exports = function override(config, env) {
    
    config = injectBabelPlugin(['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }], config);
    config = injectBabelPlugin("transform-decorators-legacy", config);
    config = rewireSass(config, env);
    
    console.log(config)

    return config;
};
