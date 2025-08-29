"use client"

import styles from "./page.module.css";
import { useEffect } from 'react';
import { useRef } from 'react';
import * as t from "three";

export default function Home() {
	const mountRef = useRef(null);
	useEffect(()=>{
		const scene = new t.Scene();
		const camera = new t.PerspectiveCamera(75,mountRef.current.clientWidth/mountRef.current.clientHeight,0.1,1000);
		const renderer = new t.WebGLRenderer();
		renderer.setSize(mountRef.current.clientWidth,mountRef.current.clientHeight)
		mountRef.current.appendChild(renderer.domElement)

		const wallWidth = 100
		const wallHeight = 40
		const wallThickness = 1

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

		const lightbulb = new t.Mesh(new t.SphereGeometry(3,100,100),new t.MeshStandardMaterial({color:0xffffff,alpha:0.5}))
		lightbulb.position.set(10,10,10)

		const light = new t.PointLight( 0xffffff ,1000);
		const sunlight = new t.PointLight( 0xffffff ,1000);
		light.position.set(10,100,10)
		sunlight.position.set(10,10,10)

		wall1.position.set(wallWidth/2,0,0)
		wall2.position.set(0,-wallHeight/2,0)
		wall3.position.set(0,0,-wallWidth/2)
		wall4.position.set(-wallWidth/2,0,0)

		camera.position.z = 70
		camera.position.x = -10


		scene.add( wall1 )
		scene.add( wall2 )
		scene.add( wall3 )
		scene.add( wall4 )
		scene.add( light );
		scene.add( sunlight );
		scene.add( lightbulb );

		let x=0;
		const pressed = new Set();
		const onKeyDown = (e) => pressed.add(e.key.toLowerCase());
		const onKeyUp = (e) => pressed.delete(e.key.toLowerCase());
		window.addEventListener("keydown", onKeyDown);
		window.addEventListener("keyup", onKeyUp);

		function animate(){
			requestAnimationFrame(animate);

			renderer.render(scene,camera);
			if (pressed.has("w")) camera.position.z -= 0.1;
			if (pressed.has("s")) camera.position.z += 0.1;
			if (pressed.has("a")) camera.position.x -= 0.1;
			if (pressed.has("d")) camera.position.x += 0.1;
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
