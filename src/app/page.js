"use client"

import styles from "./page.module.css";
import { useEffect } from 'react';
import { useRef } from 'react';
import * as t from "three";
import Entity from './npc/Entity.js';

const walkSpeed = 2
const enemyRadius = 10
const wallWidth = 500
const wallHeight = 200
const wallThickness = 1

export default function Home() {
	const mountRef = useRef(null);
	useEffect(()=>{
		const scene = new t.Scene();
		const camera = new t.PerspectiveCamera(75,mountRef.current.clientWidth/mountRef.current.clientHeight,0.1,1000);
		const renderer = new t.WebGLRenderer();
		renderer.setSize(mountRef.current.clientWidth,mountRef.current.clientHeight)
		mountRef.current.appendChild(renderer.domElement)


		const wall1 = new t.Mesh(
			new t.BoxGeometry(wallThickness,wallHeight,wallWidth),
			new t.MeshStandardMaterial({color:0xff0000}),
		)
		const wall2 = new t.Mesh(
			new t.BoxGeometry(wallWidth,wallThickness,wallWidth),
			new t.MeshStandardMaterial({color:0x00ff00}),
		)
		const wall3 = new t.Mesh(
			new t.BoxGeometry(wallWidth,wallHeight,wallThickness),
			new t.MeshStandardMaterial({color:0x0000ff}),
		)
		const wall4 = new t.Mesh(
			new t.BoxGeometry(wallThickness,wallHeight,wallWidth),
			new t.MeshStandardMaterial({color:0xff00ff}),
		)

		wall1.position.set(wallWidth/2,0,0)
		wall2.position.set(0,-wallHeight/2,0)
		wall3.position.set(0,0,-wallWidth/2)
		wall4.position.set(-wallWidth/2,0,0)
		scene.add( wall1 )
		scene.add( wall2 )
		scene.add( wall3 )
		scene.add( wall4 )

		const light = new t.PointLight( 0xffffff ,10000);
		light.position.set(0,0,0)

		const sunlight = new t.PointLight( 0xffffff ,10);
		sunlight.position.set(10,100,10)

		//Making enemies
		const enemyMesh = new t.Mesh(
			new t.SphereGeometry(enemyRadius,10,10),
			new t.MeshStandardMaterial({color:0xff0000})
		)
		const e = new Entity( enemyMesh , new t.Vector3(1,0,0))
		enemyMesh.position.set(0,10,0)

		let player = new Entity(camera,new t.Vector3(0,0,-1))

		scene.add( light );
		scene.add( sunlight );
		scene.add( enemyMesh );

		const pressed = new Set();
		const onKeyDown = (e) => pressed.add(e.key.toLowerCase());
		const onKeyUp = (e) => pressed.delete(e.key.toLowerCase());
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);

		camera.position.x = -10
		camera.position.y = -wallHeight/2+30
		camera.position.z = 70


		function animate(){
			requestAnimationFrame(animate);
			renderer.render(scene,camera);

			light.position.x = player.mesh.position.x
			light.position.y = player.mesh.position.y
			light.position.z = player.mesh.position.z

			e.speed = 1/e.mesh.position.distanceTo(camera.position)
			for(let i = 0 ; i < 1000 ; i++){
				if(e.mesh.position.y <= enemyRadius-(wallHeight/2)){
					e.mesh.position.y = enemyRadius - wallHeight/2 
					e.mesh.position.y += e.speed
					e.speed *= -0.9999*e.speed
				}else{
					e.mesh.position.y -= e.speed
					e.speed+=0.00000001
				}
			}
			if(e.mesh.position.x <= wallWidth/2 && e.mesh.position.x >=-wallWidth/2){
				e.walk(1)
			}

			e.mesh.lookAt(camera.position)

			if (pressed.has(" ")) {player.jump(1)}
			if (pressed.has("w")) {player.walk(player.speed)};
			if (pressed.has("s")) {player.walk(-player.speed)}
			if (pressed.has("a")) {
				player.rotate(walkSpeed/20)
				camera.rotation.y += walkSpeed/20
			}
			if (pressed.has("d")) {
				player.rotate(-walkSpeed/20)
				camera.rotation.y -= walkSpeed/20
			}
		}
		animate();
		return ()=>{
			mountRef.current.removeChild(renderer.domElement);
		}

	},[])

	return (
		<div ref={mountRef} style={{ width:"100vw", height:"100vh" }} />
	);
}
