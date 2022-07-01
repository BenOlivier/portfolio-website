export default [
    {
        name: 'hello',
        type: 'gltfModel',
        path: 'models/hello.glb'
    },
    {
        name: 'hello_tex',
        type: 'texture',
        path: 'images/models/hello.png'
    },
    {
        name: 'environmentMap_tex',
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