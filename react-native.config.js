module.exports = {
  dependencies: {
    ...(process.env.NO_FLIPPER ? { 'react-native-flipper': { platforms: { ios: null } } } : {}), 
    'react-native-background-timer': {
      platforms: {
        ios: null,
      },
    },
  },
  project: {
    ios: {},
    android: {},
  },
  assets: ["./src/assets/fonts/"],
};
