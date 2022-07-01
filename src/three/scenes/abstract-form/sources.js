export default [
    {
        name: 'abstractForm',
        type: 'gltfModel',
        path: 'models/abstract-form.glb'
    },
    {
        name: 'floorTexture',
        type: 'texture',
        path: 'images/models/floor.png'
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