export default [
    {
        name: 'hello',
        type: 'gltfModel',
        path: 'models/Hello.glb'
    },
    {
        name: 'hello_albedo',
        type: 'texture',
        path: 'images/other/hello_albedo_alpha.png'
    },
    {
        name: 'profile',
        type: 'texture',
        path: 'images/other/profile.png'
    },
    {
        name: 'squash',
        type: 'texture',
        path: 'images/other/squash.png'
    },
    {
        name: 'carrots',
        type: 'texture',
        path: 'images/other/carrots.png'
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
            'images/environmentMaps/1/px.jpg',
            'images/environmentMaps/1/nx.jpg',
            'images/environmentMaps/1/py.jpg',
            'images/environmentMaps/1/ny.jpg',
            'images/environmentMaps/1/pz.jpg',
            'images/environmentMaps/1/nz.jpg'
        ]
    }
]