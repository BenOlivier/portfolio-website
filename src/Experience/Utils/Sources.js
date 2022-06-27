export default [
    {
        name: 'hello',
        type: 'gltfModel',
        path: 'models/Hello.glb'
    },
    {
        name: 'hello_tex',
        type: 'texture',
        path: 'images/models/hello.png'
    },
    {
        name: 'about_tex',
        type: 'texture',
        path: 'images/models/about.png'
    },
    {
        name: 'litho',
        type: 'gltfModel',
        path: 'models/Litho.glb'
    },
    {
        name: 'diorama',
        type: 'gltfModel',
        path: 'models/Diorama.glb'
    },
    {
        name: 'diorama_tex',
        type: 'texture',
        path: 'images/models/diorama2.png'
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