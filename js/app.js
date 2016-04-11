import "babel-polyfill";

import React from "react";
import ReactDOM from "react-dom";
import Relay from "react-relay";
import { RelayRouter } from "react-router-relay";
import createHashHistory from 'history/lib/createHashHistory';
import { IndexRoute, Route, useRouterHistory } from "react-router";

import App from "./components/App";
import Workout from "./components/Workout";
import WorkoutList from "./components/WorkoutList";
import Main from "./components/Main";

const history = useRouterHistory(createHashHistory)({
    queryKey: false
});

const ViewerQueries = {
    viewer: () => Relay.QL`
        query {
            viewer
        }
    `
};

const WorkoutQueries = {
     workout: (Component) => Relay.QL`
        query {
            node(id: $workoutId) {
                ${Component.getFragment("workout")},
            },
        }
    `
};

ReactDOM.render((
    <RelayRouter history={history}>
        <Route path="/" component={App} >
            <IndexRoute
                component={Main} />
            <Route
                path="workouts"
                component={WorkoutList}
                queries={ViewerQueries} />
            <Route
                path="workout/:workoutId"
                component={Workout}
                queries={WorkoutQueries}
                forceFetch={true}
                renderLoading={() => <div>Loading...</div>} />
        </Route>
    </RelayRouter>
), document.getElementById("root"));
