function init(){
    var scene = new THREE.Scene();
    
    var gui = new dat.GUI();
    
    var sphereMaterial = getMaterial('standard' , 'rgb(255, 255, 255)');
    var sphere = getSphere(sphereMaterial, 1, 24);

    var planeMaterial = getMaterial('standard' , 'rgb(255, 255, 155)');
    var plane = getPlane(planeMaterial, 300);
    
    var lightLeft = getSpotLight(1, 'rgb(255, 220, 180)');
	var lightRight = getSpotLight(1, 'rgb(255, 220, 180)');
    
    
    lightLeft.position.x = -5;
    lightLeft.position.y = 2;
    lightLeft.position.z = -4;
        
    lightRight.position.x = 5;
    lightRight.position.y = 2;
    lightRight.position.z = -4;
        
    
    sphere.position.y = sphere.geometry.parameters.radius;
    plane.rotation.x = - Math.PI/2;
        
    scene.add(sphere);
    scene.add(plane);
    scene.add(lightLeft);
    scene.add(lightRight);
    
    
    var camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth/window.innerHeight,
        1,
        1000
    );
    
    camera.position.z = 7;
	camera.position.x = -2;
	camera.position.y = 7;
	camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    var folder_1 = gui.addFolder('folder_1');
    folder_1.add(lightRight, 'intensity', 0, 10);
    folder_1.add(lightLeft.position, 'x', -5, 15);
    folder_1.add(lightLeft.position, 'y', -5, 15);
    folder_1.add(lightLeft.position, 'z', -5, 15);
    
    var folder_2 = gui.addFolder('folder_2');
    folder_2.add(lightRight, 'intensity', 0, 10);
    folder_2.add(lightRight.position, 'x', -5, 15);
    folder_2.add(lightRight.position, 'y', -5, 15);
    folder_2.add(lightRight.position, 'z', -5, 15);
    
    
//    //phong material setting
//    var folder3 = gui.addFolder('material');
//    folder3.add(sphereMaterial, 'shininess', 0, 1000);
//    folder3.add(planeMaterial, 'shininess', 0, 1000);
//    folder3.open();
    
    
    //Environment Maps
    var path = "assets/cubemap/";
    var format = '.jpg';
    var urls = [
        path + 'px' + format, path + 'nx' + format,
        path + 'py' + format, path + 'ny' + format,
        path + 'pz' + format, path + 'nz' + format,
    ];
    var reflectionCube = new THREE.CubeTextureLoader().load(urls);
    reflectionCube.format = THREE.RGBFormat;
    
    
    scene.background = reflectionCube;
    
    
    //testures for standard material
    var loader = new THREE.TextureLoader();
    planeMaterial.map = loader.load('assets/textures/concrete.JPG');
    planeMaterial.bumpMap = loader.load('assets/textures/concrete.JPG');
    planeMaterial.roughnessMap = loader.load('assets/textures/concrete.JPG');
    planeMaterial.bumpScale = 0.01;
    planeMaterial.metalness = 0.1;
    planeMaterial.roughness = 0.7;
    
    sphereMaterial.roughnessMap = loader.load('assets/textures/fingerprints.jpg');
    
    sphereMaterial.envMap = reflectionCube;
    planeMaterial.envMap = reflectionCube;
    
    
    var maps = ['map','bumpMap'];
    maps.forEach(function(mapName){
        var texture = planeMaterial[mapName];
        texture.wrapS = THREE.repeatWraping;
        texture.wrapT = THREE.repeatWraping;
        texture.repeat.set(15, 15);
    });
    
    //standard material setting
    var folder3 = gui.addFolder('material');
    folder3.add(sphereMaterial, 'roughness', 0, 1);
    folder3.add(planeMaterial, 'roughness', 0, 1);
    folder3.add(sphereMaterial, 'metalness', 0, 1);
    folder3.add(planeMaterial, 'metalness', 0, 1);
    folder3.open();
    
    
    var renderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('webgl').appendChild(renderer.domElement);
    
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    
    update(renderer, scene, camera, controls);
    
    return scene;
}

function getBox(w, h, d){
    var geometry = new THREE.BoxGeometry(w, h, d);
    var material = new THREE.MeshPhongMaterial({
        color : 'rgb(120,120,120)'
    });
    
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    
    mesh.castShadow = true;
    return mesh;
}

function getSphere(material, size, segment){
    var geometry = new THREE.SphereGeometry(size, segment, segment);
    
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    mesh.castShadow = true;
    return mesh;
}


function getSpotLight(intensity, color){
    color === undefined ? 'rgb(255,255,255)' : color
    var light = new THREE.SpotLight( 'rgb(255,255,255)' ,intensity);
    light.castShadow = true;  
    light.penumbra = 0.5;
    
    //Set up shadow properties for the light
	light.shadow.mapSize.width = 2048;  // default: 512
	light.shadow.mapSize.height = 2048; // default: 512
    light.shadow.bias = 0.001;
    
    return light;
}


function getPlane(material, size){
    var geometry = new THREE.PlaneGeometry(size, size);
    
    var mesh = new THREE.Mesh(
        geometry,
        material
    );
    
    mesh.receiveShadow = true;
    return mesh;
}

function getMaterial(type, color){
    var selectedMaterial;
    var materialOptions = {
        color: color === undefined ? 'rgb(255,255,255)' : color
    };
    switch(type){
        case 'basic':
            selectedMaterial = new THREE.MeshBasicMaterial(materialOptions);
            break;
        case 'phong':
            selectedMaterial = new THREE.MeshPhongMaterial(materialOptions);
            break;
        case 'lambert':
            selectedMaterial = new THREE.MeshLambertMaterial(materialOptions);
            break;
        case 'standard':
            selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
            break;
        default :
            selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
            break;
    }
    
    return selectedMaterial;
}

function update(renderer, scene, camera, controls){
    renderer.render(
        scene,
        camera
    );
    controls.update();
    requestAnimationFrame(function(){
        update(renderer, scene, camera, controls);
    });
}

var scene = init();
