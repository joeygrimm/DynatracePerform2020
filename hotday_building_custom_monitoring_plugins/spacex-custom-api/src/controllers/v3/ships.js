const find = require("../../lib/query-builder/v3/find");
const limit = require("../../lib/query-builder/v3/limit");
const offset = require("../../lib/query-builder/v3/offset");
const project = require("../../lib/query-builder/v3/project");
const sort = require("../../lib/query-builder/v3/sort");

const weather_states = [
  "Fair",
  "Cloudy",
  "Sunny",
  "Rainy",
  "Stormy",
  "Snowy",
  "Windy",
  "Hail"
];

module.exports = {
  /**
   * Returns all ship info
   */
  all: async ctx => {
    const data = await global.db
      .collection("ship")
      .find(find(ctx.request))
      .project(project(ctx.request.query))
      .sort(sort(ctx.request))
      .skip(offset(ctx.request.query))
      .limit(limit(ctx.request.query));
    ctx.state.data = data;
    const res = await data.toArray();

    let i = 0;
    let j = 1;
    const multiplier = new Date().getMinutes();
    const min_value = multiplier >= 10 ? multiplier - 10 : 0;
    res.forEach(ship => {
      const ip = `192.168.${i}.${j}`;
      ship.ship_ip = ip;

      // Fuel slowly decreases over the hour
      const fuel = multiplier * (j + 50) + Math.random() * 4;
      ship.fuel = fuel.toFixed(2);

      // This is only available via MongoDB
      delete ship.course_deg;

      // This is the IPs incrementer (192.168.i.j)
      j += 1;
      if (j >= 255) {
        j = 0;
        i += 1;
      }

      ship.thrust = [];
      for (let index = 0; index < 4; index++) {
        ship.thrust[index] = {
          engine: `Main Engine ${index + 1}`,
          power: (60 + Math.random() * 40).toFixed(2)
        };
      }

      ship.sattelite_latency = (250 + Math.random() * 50).toFixed(2);
      ship.weather = weather_states[Math.round(multiplier / 8.5)];
    });
    ctx.body = res;
  },

  /**
   * Returns specific ship info
   */
  specific: async ctx => {
    const data = await global.db
      .collection("ship")
      .find({ ship_id: ctx.params.ship_id })
      .project(project(ctx.request.query))
      .limit(1)
      .toArray();
    if (data.length === 0) {
      ctx.throw(404);
    }
    [ctx.body] = data;
  }
};
