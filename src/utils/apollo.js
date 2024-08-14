import { ApolloClient, createHttpLink, InMemoryCache, split} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { createClient } from 'graphql-ws'
import {getMainDefinition} from "@apollo/client/utilities";
import {HOST_API_KEY, HOST_WS_API_KEY} from '../config-global';
const httpLink = createHttpLink({uri: `${HOST_API_KEY}/graphql`,
});
const wsLink = new GraphQLWsLink(createClient({
    url: `${HOST_WS_API_KEY}/graphql`,
    connectionParams: {
        authorization: localStorage.getItem('accessToken') ? `Bearer ${localStorage.getItem('accessToken')}` : '',
    }
}))

const authLink = setContext((_, {headers}) => {
        // get the authentication token from local storage if it exists
        const token = localStorage.getItem('accessToken') || ""
        // return the headers to the context so httpLink can read them
        return {
            headers: {
                ...headers,
                authorization: token ? `Bearer ${token}` : '',
            },
        };
    }
);
const combinedLink = split(
    ({query}) => {
        const {kind, operation} = getMainDefinition(query);
        return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    authLink.concat(httpLink)
);

const client = new ApolloClient({
    link: combinedLink,
    cache: new InMemoryCache(),
});

export default client;
