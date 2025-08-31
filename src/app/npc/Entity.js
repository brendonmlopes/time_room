import * as t from 'three';
export default class Villager{
	constructor( mesh , dir ){
		this.mesh = mesh
		this.dir = dir
		this.speed = 0;
	}
	walk(stepSize){
		const move = this.dir.clone().normalize().multiplyScalar(stepSize)
		this.mesh.position.add(move)
	}
	rotate(angle){
		this.dir.applyAxisAngle(new t.Vector3(0,1,0),angle)
	}
}
