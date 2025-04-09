/**
 * Hjälpfunktioner för att hantera API-svar
 */

// Skapa ett framgångssvar med data
function createResponseSuccess(data) {
  return {
    status: 200,
    data
  };
}

// Skapa ett felsvar med statuskod och felmeddelande
function createResponseError(status, message) {
  return {
    status: status || 500,
    data: { error: message || 'Ett fel inträffade' }
  };
}

// Skapa ett meddelandesvar med statuskod och meddelande
function createResponseMessage(status, message) {
  return {
    status: status || 200,
    data: { message }
  };
}

module.exports = {
  createResponseSuccess,
  createResponseError,
  createResponseMessage
};
