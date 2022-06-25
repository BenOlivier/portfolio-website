export default [
    {
        name: 'hello',
        type: 'gltfModel',
        path: 'models/Hello.glb'
    },
    {
        name: 'hello_albedo',
        type: 'texture',
        path: 'images/models/hello.png'
    },
    {
        name: 'about',
        type: 'texture',
        path: 'images/models/about.png'
    },
    {
        name: 'litho',
        type: 'gltfModel',
        path: 'models/Litho.glb'
    },
    {
        name: 'environmentMapTexture',
        type: 'cubeTexture',
        path:
        [
            'images/environmentMap/px.jpg',
            'images/environmentMap/nx.jpg',
            'images/environmentMap/py.jpg',
            'images/environmentMap/ny.jpg',
            'images/environmentMap/pz.jpg',
            'images/environmentMap/nz.jpg'
        ]
    }
]