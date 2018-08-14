const Hapi = require('hapi');

const server = Hapi.server({
    host: '192.168.0.136', // localhost
    port: 3000
});

const Profile = {
    method: 'GET',
    path: '/profile',
    handler: (request, h) => {
        return {
            'id': 'fa0dbda9b1b',
            'name': 'John Doe'
        };
    }
};

const ActiveItem = {
    method: 'GET',
    path: '/item',
    handler: (request, h) => {
        return {
            'id': '55cf687663',
            'name': 'Active Item'
        };
    }
};

const Item = {
    method: 'GET',
    path: '/item/{id}',
    handler: (request, h) => {
        return {
            'id': request.params.id,
            'name': 'Item',
            'query': request.query
        };
    }
};

const Requestbatch = { 
    method: 'GET', 
    path: '/request',
    handler: async (request, h) => {
        let res = await server.inject({
            method: 'POST',
            url: '/batch',
            payload: `{ 
                "requests": [
                    { "method": "get", "path": "/profile" }, 
                    { "method": "get", "path": "/item" }, 
                    { "method": "get", "path": "/item/$1.id" },
                    { "method": "get", "path": "/item/$0.id", "query": { "id": "23", "user": "John" } }
                ] 
            }`
        });

        let response = null;
        if (res.statusCode === 200) {
            response = h.response(res.payload);
            response.header('Content-Type', 'application/json');
        }
        else {
            response = h.response('error');
        }
        return response;
    }
};

const init = async () => {
    try {
        await server.register(require('bassmaster'));

        server.route([
            Profile, 
            ActiveItem, 
            Item,
            Requestbatch
        ]);
    
        await server.start();
        console.log(`Server running at: ${server.info.uri}`);
    } catch (error) {
        throw error;
    }
};

init();
