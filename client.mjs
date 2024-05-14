export class Client {
    async getUser() {
        const response = await fetch('/api/user');
        const userData = await response.json();
        return userData.username;
    }

    async loginUser(username) {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username}),
        });
        const userData = await response.json();
        return userData.username;
    }

    async logoutUser() {
        await fetch('/api/logout', {
            method: 'POST',
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
        const response = await fetch('https://api.spacexdata.com/v4/company');
        const data = await response.json();
        return {
            founder: data.founder,
            founded: data.founded,
            employees: data.employees,
            ceo: data.ceo,
            coo: data.coo,
            cto: data.cto,
            valuation: data.valuation,
            headquarters: {
                address: data.headquarters.address,
                city: data.headquarters.city,
                state: data.headquarters.state
            },
            summary: data.summary
        };
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
        const response = await fetch('https://api.spacexdata.com/v4/history');
        const data = await response.json();

        const eventBriefs = data.map(event => ({
            id: event.id,
            title: event.title
        }));

        return eventBriefs;
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
        const response = await fetch(`https://api.spacexdata.com/v4/history/${id}`);
        const eventData = await response.json();

        return {
            id: eventData.id,
            title: eventData.title,
            event_date_utc: eventData.event_date_utc,
            details: eventData.details,
            links: eventData.links
        };
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
        const response = await fetch('https://api.spacexdata.com/v4/rockets');
        const data = await response.json();

        const rocketBriefs = data.map(rocket => ({
            rocket_id: rocket.rocket_id,
            rocket_name: rocket.rocket_name
        }));

        return rocketBriefs;
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
        const response = await fetch(`https://api.spacexdata.com/v4/rockets/${id}`);
        const rocketData = await response.json();

        return {
            rocket_id: rocketData.rocket_id,
            rocket_name: rocketData.rocket_name,
            first_flight: rocketData.first_flight,
            description: rocketData.description,
            wikipedia: rocketData.wikipedia,
            flickr_images: rocketData.flickr_images,
            height: rocketData.height,
            diameter: rocketData.diameter,
            mass: rocketData.mass,
            engines: rocketData.engines,
            first_stage: rocketData.first_stage,
            second_stage: rocketData.second_stage
        };
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
        const response = await fetch('https://api.spacexdata.com/v4/roadster');
        const data = await response.json();

        return {
            name: data.name,
            launch_date_utc: data.launch_date_utc,
            details: data.details,
            earth_distance_km: data.earth_distance_km,
            mars_distance_km: data.mars_distance_km,
            wikipedia: data.wikipedia
        };
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
        const response = await fetch('https://api.spacexdata.com/v4/sent_to_mars');
        const data = await response.json();

        return data;
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
        throw new Error("Not implemented");
    }

    /**
     * Должен отменять отправку на марс переданного предмета и
     * возвращать информацию о всех посланных на Марс предметах
     *
     * @param {Item} item
     * @return {Promise<Item[]>}
     * */
    async cancelSendingToMars(item) {
        throw new Error("Not implemented");
    }
}
