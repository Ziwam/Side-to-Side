using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Roaming : Movement {

	public float speed = 10f; 
	private float DirectionalValue = 1f;
	private float TurnValue = 0f;
	public float shiftspeed =1f;
	public CircleCollider2D col;
	public float raylength;
	public float offset;

	public List<Transform> Obstacles;
	private float radius;

	// Use this for initialization
	void Start () {
		Obstacles = new List<Transform> ();
		radius = col.radius*2*transform.localScale.x;
		DirectionalValue = Random.value > .5f ? -1 : 1;
		TurnValue = Random.value > .5f ? -1 : 1;
	}

	void OnDisable(){
		Obstacles.Clear ();
	}
	
	// Update is called once per frame
	void Update () {
		RaycastHit2D hit;
		//ABOVE
		hit = (Physics2D.Raycast (transform.position + new Vector3(0,offset,0), transform.up, raylength)); 
		if (hit.collider.tag == "Obstacle")
			DirectionalValue = -1;
		//BELOW
		hit = (Physics2D.Raycast (transform.position + new Vector3(0,-offset,0), -transform.up, raylength));
		if (hit.collider.tag == "Obstacle")
			DirectionalValue = 1;
		//RIGHT
		hit = (Physics2D.Raycast (transform.position + new Vector3(offset,0,0), transform.right, raylength));
		if (hit.collider.tag == "Obstacle") 
			TurnValue = -1;
		//LEFT
		hit = (Physics2D.Raycast (transform.position + new Vector3(-offset,0,0), -transform.right, raylength));
		if (hit.collider.tag == "Obstacle") 
			TurnValue = 1;

		if (Obstacles.Count > 0) {
			for(int i = 0; i<Obstacles.Count; i++){
				Transform obst = Obstacles [i];
				if (obst) {
					Vector3 dir = (obst.position - transform.position);
					DirectionalValue += (dir.y<=0? (radius + dir.y) : (radius - dir.y)*-1) * shiftspeed ;
					TurnValue += (dir.x<=0? (radius + dir.x) : (radius - dir.x)*-1) * shiftspeed ;
				}
			}
		}

		TurnValue = Mathf.Clamp (TurnValue,-1,1);
		DirectionalValue = Mathf.Clamp (DirectionalValue,-1,1);

		if (!isZooming ()) {
			transform.position += transform.right * (speed * TurnValue) * Time.deltaTime;
			transform.position += transform.up * (speed * DirectionalValue) * Time.deltaTime;
		}
	}

	void OnTriggerEnter2D(Collider2D obj){
		if (obj.gameObject.tag == "Enemy") {
			if(!Obstacles.Contains(obj.transform))
				Obstacles.Add (obj.transform);	
		}
	}

	void OnTriggerExit2D(Collider2D obj){
		if (Obstacles.Contains (obj.transform))
			Obstacles.Remove (obj.transform);
	}

//	void OnDrawGizmos(){
//		Gizmos.DrawRay (transform.position + new Vector3(0,offset,0), transform.up * raylength);
//		Gizmos.DrawRay (transform.position + new Vector3(0,-offset,0), -transform.up * raylength);
//		Gizmos.DrawRay (transform.position + new Vector3(offset,0,0), transform.right * raylength);
//		Gizmos.DrawRay (transform.position + new Vector3(-offset,0,0), -transform.right * raylength);
//	}
}
