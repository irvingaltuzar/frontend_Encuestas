import Cookies from 'js-cookie'

const TokenKey = 'Token-DMI'

export function getToken() {

  return Cookies.get(TokenKey)
}

export function setToken(token) {
  var date = new Date();
	date.setTime(date.getTime() + (3600 * 1000) * 3 );
  return Cookies.set(TokenKey, token,{expires: date})
}

export function removeToken() {
  Object.keys(Cookies.get()).forEach(function(cookieName) {
    var neededAttributes = {};
    Cookies.remove(cookieName, neededAttributes);
  });

  return Cookies.remove(TokenKey)
}
