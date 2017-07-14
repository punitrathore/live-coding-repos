const renderError = function(error, response, response){
  response.send(`ERROR: ${error.message}\n\n${error.stack}`)
}

const renderUnauthorized = function(response) {
  response.send('You do not have access to this page.');
}

module.exports = {renderError, renderUnauthorized}
