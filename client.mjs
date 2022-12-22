const HOST = 'https://localhost:3000';
const SPACEX_HOST = 'https://api.spacexdata.com/v3';

const API = {
  LOGIN_URL: `${HOST}/api/login`,
  GETUSER_URL: `${HOST}/api/getUser`,
  LOGOUT_URL: `${HOST}/api/logout`,
};

const SPACEX_API = {
  GET_INFO_URL: `${SPACEX_HOST}/info`,
  GET_HISTORY_URL: `${SPACEX_HOST}/history`,
  GET_ROCKETS_URL: `${SPACEX_HOST}/rockets`,
  GET_ROADSTER_URL: `${SPACEX_HOST}/roadster`,
};

const LOCAL_API = {
  GET_SENT_TO_MARS_URL: `${HOST}/getSentToMars`,
  SEND_TO_MARS_URL: `${HOST}/sendToMars`,
};

export class Client {
  /**
   * Должен возвращать имя пользователя или null
   * если пользователь не залогинен
   *
   * @return {Promise<string | null>} username
   * */
  async getUser() {
    let response = await fetch(API.GETUSER_URL);

    if (response.ok) {
      response = await response.json();
      return response.username;
    }

    return null;
  }

  /**
   * Должен логинить пользователя с именем username
   * и возвращать его имя
   *
   * @param {string} username
   * @return {Promise<string | null>} username
   * */
  async loginUser(username) {
    let response = await fetch(API.LOGIN_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    if (!response.ok) return null;

    response = await response.json();
    console.log(response);

    username = response.username;

    return username || null;
  }

  /**
   * Должен разлогинивать текущего пользователя
   *
   * @return {void}
   * */
  async logoutUser() {
    let response = await fetch(API.LOGOUT_URL, {
      method: 'get',
    });
  }

  /**
   * Должен возвращать информацию о компании
   *
   * @typedef {Object} Headquarters
   * @property {string} address
   * @property {string} city
   * @property {string} state
   *
   * @typedef {Object} About
   * @property {string} founder
   * @property {string} founded
   * @property {number} employees
   * @property {string} ceo
   * @property {string} coo
   * @property {string} cto
   * @property {number} valuation
   * @property {Headquarters} headquarters
   * @property {string} summary
   * @return {Promise<About>}
   * */
  async getInfo() {
    return await fetch(SPACEX_API.GET_INFO_URL).then((res) => res.json());
  }

  /**
   * Должен возвращать информацию о всех событиях
   *
   * @typedef {Object} EventBrief
   * @property {number} id
   * @property {string} title
   *
   * @return {Promise<EventBrief[]>}
   * */
  async getHistory() {
    return await fetch(SPACEX_API.GET_HISTORY_URL).then((res) => res.json());
  }

  /**
   * Должен возвращать информацию о запрошенном событии
   *
   * @typedef {Object} EventFull
   * @property {number} id
   * @property {string} title
   * @property {string} event_date_utc
   * @property {string} details
   * @property {Object.<string, ?string>} links
   *
   * @param {number} id
   * @return {Promise<EventFull>}
   * */
  async getHistoryEvent(id) {
    return await fetch(`${SPACEX_API.GET_HISTORY_URL}/${id}`).then((res) =>
      res.json()
    );
  }

  /**
   * Должен возвращать информацию о всех ракетах
   *
   * @typedef {Object} RocketBrief
   * @property {number} rocket_id
   * @property {string} rocket_name
   *
   * @return {Promise<RocketBrief[]>}
   * */
  async getRockets() {
    return await fetch(SPACEX_API.GET_ROCKETS_URL).then((res) => res.json());
  }

  /**
   * Должен возвращать информацию о запрошенной ракете
   *
   * @typedef {Object} RocketFull
   * @property {number} rocket_id
   * @property {string} rocket_name
   * @property {string} first_flight
   * @property {string} description
   * @property {string} wikipedia
   * @property {string[]} flickr_images
   * Смотри источник данных:
   * @property {Object} height
   * @property {Object} diameter
   * @property {Object} mass
   * @property {Object} engines
   * @property {Object} first_stage
   * @property {Object} second_stage
   *
   * @param {string} id
   * @return {Promise<RocketFull>}
   * */
  async getRocket(id) {
    return await fetch(`${SPACEX_API.GET_ROCKETS_URL}/${id}`).then((res) =>
      res.json()
    );
  }

  /**
   * Должен возвращать информацию о машине в космосе
   *
   * @typedef {Object} Roadster
   * @property {string} name
   * @property {string} launch_date_utc
   * @property {string} details
   * @property {number} earth_distance_km
   * @property {number} mars_distance_km
   * @property {string} wikipedia
   *
   * @return {Promise<Roadster>}
   * */
  async getRoadster() {
    return await fetch(SPACEX_API.GET_ROADSTER_URL).then((res) => res.json());
  }

  /**
   * Должен возвращать информацию о всех посланных на Марс предметах
   *
   * @typedef {Object} Item
   * @property {!string} id
   * @property {!string} name
   * @property {!string} phone
   * @property {?number} weight
   * @property {?string} color
   * @property {?boolean} important
   *
   * @return {Promise<Item[]>}
   * */
  async getSentToMars() {
    return await fetch(LOCAL_API.GET_SENT_TO_MARS_URL);
  }

  /**
   * Должен посылать на марс переданный предмет и
   * возвращать информацию о всех посланных на Марс предметах
   *
   * @typedef {Object} ItemToSend
   * @property {!string} name
   * @property {!string} phone
   * @property {?number} weight
   * @property {?string} color
   * @property {?boolean} important
   *
   * @param {ItemToSend} item
   * @return {Promise<Item[]>}
   * */
  async sendToMars(item) {
    throw new Error('not imp');
  }

  /**
   * Должен отменять отправку на марс переданного предмета и
   * возвращать информацию о всех посланных на Марс предметах
   *
   * @param {Item} item
   * @return {Promise<Item[]>}
   * */
  async cancelSendingToMars(item) {
    throw new Error('Not implemented');
  }
}
