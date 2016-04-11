import React from "react";
import Relay from "react-relay";
import { Link } from "react-router";

class WorkoutList extends React.Component {
    render() {
        const workoutEdgeList = this.props.viewer.workouts.edges;
        return (
            <div>
                <h2>Workout list</h2>
                <table>
                    <tbody>
                    {workoutEdgeList.map(edge =>
                        <tr key={edge.node.id}>
                            <td>
                                <b>
                                <Link to={`workout/${edge.node.id}`}>
                                    {edge.node.name}
                                </Link>
                                </b>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>

                <h2>Page state</h2>
                <pre style={{background: "#EEE"}}>
                    {JSON.stringify(this.props, null, 2)}
                </pre>
            </div>
        );
    }
}

export default Relay.createContainer(WorkoutList, {
    fragments: {
        viewer: () => Relay.QL`
            fragment on User {
                workouts(first: 10) {
                    edges {
                        node {
                            id,
                            name
                        },
                    },
                },
            }
        `,
    },
});
