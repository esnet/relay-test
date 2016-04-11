import React from "react";
import Relay from "react-relay";

class App extends React.Component {
    render() {
        return (
            <div>
                <h1>App</h1>
                <hr />
                {this.props.children}
            </div>
        );
    }
}

export default App;
