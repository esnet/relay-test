/*eslint no-console: 0*/

import gcloud from "gcloud";
import Promise from "bluebird";

// Google Cloud DataStore API
//
// e.g. export GCLOUD_PROJECT_ID="esnet-data-collector"
const projectId = process.env.GCLOUD_PROJECT_ID;
const keyFilename = "./keyfile.json";

// A dataset for our DataStore which we can make queries against
const dataset = gcloud.datastore.dataset({
    projectId, keyFilename
});

/**
 * A standin database until we hook up our real database
 */

// Model types
class User {}
class Workout {}

// Mock data
var viewer = new User();
viewer.id = "1";
viewer.name = "Anonymous";

module.exports = {
    // Database API
    getUser: (id) => id === viewer.id ? viewer : null,
    getViewer: () => viewer,
    getWorkout: (id) => {
        console.log("getWorkout", id);
        return new Promise(function (fulfill, reject) {
            dataset.get(dataset.key(["Workout", +id]), (err, entity) => {
                if (err) {
                    reject(err);
                } else {
                    const workout = new Workout();
                    workout.name = entity.data.description;
                    workout.distance = entity.data.distance;
                    workout.duration = entity.data.duration;
                    workout.id = entity.key.id;

                    fulfill(workout);
                }
            });
        });
    },
    getWorkouts: () => {
        const q = dataset.createQuery("Workout");
        return new Promise(function (fulfill, reject) {
            return dataset.runQuery(q, (err, entities) => {
                if (err) {
                    reject(err);
                } else {
                    const workouts = entities.map(e => {
                        const workout = new Workout();
                        workout.name = e.data.description;
                        workout.distance = e.data.distance;
                        workout.duration = e.data.duration;
                        workout.id = e.key.id;
                        return workout;
                    });
                    fulfill(workouts);
                }
            });
        });
    },
    User,
    Workout,
};
