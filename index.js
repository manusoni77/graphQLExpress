const express = require('express');
const {graphqlHTTP} = require('express-graphql');
const { GraphQLObjectType, GraphQLNonNull, GraphQLInt, GraphQLString, GraphQLList, GraphQLSchema } = require('graphql');

const app = express()   
const PORT = 5000


var Owners = [
    { id: 1, name: "Manoj"},
    { id: 2, name: "Manu"},
    { id: 3, name: "Tanuj"}
]

var Websites = [
    { id: 1, name: "facebook", ownerId: 1},
    { id: 2, name: "google", ownerId: 1},
    { id: 3, name: "amazon", ownerId: 1},
    { id: 4, name: "microsoft", ownerId: 1},
    { id: 5, name: "medium", ownerId: 1},
    { id: 6, name: "zepak", ownerId: 1},
    { id: 7, name: "cricinfo", ownerId: 1},
    { id: 8, name: "Baidu", ownerId: 1},
]

const WebsiteType = new GraphQLObjectType({
    name: 'website',
    description: 'This represent a website made by an owner',
    fields: ()=> ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
        ownerId: {type:new GraphQLNonNull(GraphQLInt)}
    })
})

const OwnerType = new GraphQLObjectType({
    name: 'Owner',
    description: 'This represent a owner',
    fields: ()=> ({
        id: {type: new GraphQLNonNull(GraphQLInt)},
        name: {type: new GraphQLNonNull(GraphQLString)},
    })
})

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({
        websites: {
            type: new GraphQLList(WebsiteType),
            description: 'List of all websites',
            resolve: () => Websites
        },
        owners: {
            type: new GraphQLList(OwnerType),
            description: 'List of all Owners',
            resolve: () => Owners
        }
    })
})

const RootMutationType = new GraphQLObjectType({
    name: 'mutation',
    description: 'Root Mutation',
    fields: () => ({
        addWebsite: {
            type: WebsiteType,
            description: 'Add a website',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)},
                ownerId: { type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                const website = { id: Websites.length +1, name: args.name, ownerId:args.ownerId}
                Websites.push(website);
                return website
            }
        },
        removeWebsite: {
            type: WebsiteType,
            description: 'Remove a website',
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent, args) => {
                Websites = Websites.filter(website => website.id !== args.id)
                return Websites[args.id]
            }
        },
        addOwner: {
            type: OwnerType,
            description: 'Add a owner',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                const owner = { id: Owners.length + 1, name: args.name}
                Owners.push(owner)
                return owner
            }
        },
        removeOwner: {
            type: OwnerType,
            description: 'Remove a owner',
            args: {
                id: { type: new GraphQLNonNull(GraphQLInt)}
            },
            resolve: (parent,args) => {
                Owners = Owners.filter(owner => owner.id !== args.id)
                return Owners[args.id]
            }
        },
        updateOwner: {
            type: OwnerType,
            description: 'Update an owner',
            args: {
                id: {type: new GraphQLNonNull(GraphQLInt)},
                name: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve: (parent, args) => {
                Owners[args.id - 1].name = args.name
                return Owners[args.id - 1]
            }
        }

        
    })
})
const schema =new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})
app.use('/graphql',graphqlHTTP({
    graphiql: true,
    schema: schema
}))
app.listen(PORT,()=>{
    console.log(`App is listening on port ${PORT}`);
})