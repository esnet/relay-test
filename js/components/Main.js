import React from "react";
import { Link } from "react-router";

class Main extends React.Component {
    render() {
        return (
            <div>
                Welcome to the workout app.

                See also <Link to={`workouts`}>Workouts</Link>
            </div>
        );
    }
}

export default Main;
