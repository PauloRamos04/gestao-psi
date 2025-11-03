const CompressionPlugin = require('compression-webpack-plugin');

module.exports = function override(config, env) {
  // Garantir que o hot reload está ativo em desenvolvimento
  if (env === 'development') {
    // Habilita Fast Refresh (hot reload do React)
    config.optimization = {
      ...config.optimization,
    };
    
    // Garante que o devServer está configurado corretamente
    if (!config.devServer) {
      config.devServer = {};
    }
    
    // Configurações para hot reload
    config.devServer.hot = true;
    config.devServer.liveReload = true;
    config.devServer.inline = true;
  }
  
  if (env === 'production') {
    // Adicionar compressão Gzip
    config.plugins.push(
      new CompressionPlugin({
        filename: '[path][base].gz',
        algorithm: 'gzip',
        test: /\.(js|css|html|svg)$/,
        threshold: 8192,
        minRatio: 0.8,
      })
    );

    // Otimizar chunks
    config.optimization = {
      ...config.optimization,
      splitChunks: {
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          antd: {
            test: /[\\/]node_modules[\\/](antd|@ant-design)[\\/]/,
            name: 'antd',
            priority: 20,
          },
          common: {
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      },
      runtimeChunk: 'single',
    };

    // Remover source maps em produção
    config.devtool = false;
  }

  return config;
};

