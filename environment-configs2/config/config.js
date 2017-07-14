const readConfig = (env) => {
  try {
    return require(`./config.${env}.json`)
  } catch (e) {
    console.error(e);
    throw new Error(`Could not read config file: ./config.${env}.json`);
  }
}

let config;
const getConfig = () => {
  if(config) {
    return config
  } else {
    config = readConfig(getEnv())
    return config
  }
}

const getEnv = () =>  {
  return process.env.NODE_ENV
}

module.exports = { readConfig, getEnv, getConfig }
