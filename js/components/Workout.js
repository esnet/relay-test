import React from "react";
import Relay from "react-relay";
import { Link } from "react-router";

import moment from "moment";
import "moment-duration-format";


class Workout extends React.Component {

    componentWillReceiveProps(nextProps) {
        console.log("!!", nextProps);
    }

    render() {
        console.log("!!!", this.props);
        const workout = this.props.workout;
        return (
            <div>
                <h2>Workout</h2>

                <table>
                    <tbody>
                        <tr>
                            <td><b>Description</b></td>
                            <td>{workout.name}</td>
                        </tr>

                        <tr>
                            <td><b>Distance</b></td>
                            <td>{workout.disance} miles</td>
                        </tr>

                        <tr>
                            <td><b>Duration</b></td>
                            <td>{moment.duration(workout.duration, "seconds").format()}</td>
                        </tr>
                    </tbody>
                </table>

                <hr />

                <h2>Page state</h2>
                <pre style={{background: "#EEE"}}>
                    {JSON.stringify(this.props, null, 2)}
                </pre>
            </div>
        );
    }
}

export default Relay.createContainer(Workout, {
    fragments: {
        workout: () => Relay.QL`
            fragment on Workout {
                id,
                name,
                distance,
                duration
            }
        `
    }
});
