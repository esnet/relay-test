
// GraphQL types
import {
    GraphQLBoolean,
    GraphQLFloat,
    GraphQLID,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLString,
} from "graphql";

// Relay helpers
import {
    connectionArgs,
    connectionDefinitions,
    connectionFromPromisedArray,
    fromGlobalId,
    globalIdField,
    mutationWithClientMutationId,
    nodeDefinitions
} from "graphql-relay";

//Database methods and objects
import {
    User,
    Workout,
    getUser,
    getViewer,
    getWorkout,
    getWorkouts,
} from "./database";

/**
 * Relay wants a "node" interface. We get the node interface
 * and field from the Relay library.
 *
 * This nodeDefinitions() function returns an object with:
 *   - nodeInterface
 *   - nodeField
 * To generate this it takes in two functions:
 *   - the first defines the way we resolve an globalId to its object.
 *   - the second defines the way we resolve an object to its GraphQL Type.
 */
var {nodeInterface, nodeField} = nodeDefinitions(

    (globalId) => {
        var {type, id} = fromGlobalId(globalId);
        if (type === 'User') {
            return getUser(id);
        } else if (type === 'Workout') {
            return getWorkout(id);
        } else {
            return null;
        }
    },
    (obj) => {
        if (obj instanceof User) {
            return userType;
        } else if (obj instanceof Workout)  {
            return workoutType;
        } else {
            return null;
        }
    }
);

/**
 * Define a person as a userType
 */
const userType = new GraphQLObjectType({
    name: "User",
    description: "A person who uses our app",
    fields: () => ({
        id: globalIdField("User"),
        workouts: {
            type: workoutConnection,
            description: "A person's collection of workouts",
            args: connectionArgs,
            resolve: (_, args) => {
                return connectionFromPromisedArray(getWorkouts(), args)
            }
        },
        workout: {
            type: workoutType,
            description: 'A single workout',
            args: {
                id: {
                    type: new GraphQLNonNull(GraphQLID),
                    description: 'The id of the workout',
                },
            },
            resolve: (user, args) => {
                const { id } = fromGlobalId(args.id);
                return getWorkout(id);
            },
        }
    }),
    interfaces: [nodeInterface],
});

/**
 * Define a workout that a person may do as a workoutType
 */
const workoutType = new GraphQLObjectType({
    name: "Workout",
    description: "A workout activity logged by a person",
    fields: () => ({
        id: globalIdField("Workout"),
        name: {
            type: GraphQLString,
            description: "How did the workout go?",
        },
        distance: {
            type: GraphQLFloat,
            description: "How far was the workout, in miles",
        },
        duration: {
            type: GraphQLInt,
            description: "How long did the workout take?",
        }
    }),
    interfaces: [nodeInterface],
});

/**
 * Connections between our objects
 */
const {connectionType: workoutConnection} = connectionDefinitions({
    name: "Workout",
    nodeType: workoutType
});

/**
 * Schema entry point
 */
const queryType = new GraphQLObjectType({
    name: "Query",
    fields: () => ({
        node: nodeField,
        // Add your own root fields here
        viewer: {
            type: userType,
            resolve: () => getViewer(),
        },
    }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 */
const mutationType = new GraphQLObjectType({
    name: 'Mutation',
    fields: () => ({
        // Add your own mutations here
    })
});

/**
 * Finally, we construct our schema using the query entry point
 */
export var Schema = new GraphQLSchema({
    query: queryType,
    // Uncomment the following after adding some mutation fields:
    // mutation: mutationType
});
