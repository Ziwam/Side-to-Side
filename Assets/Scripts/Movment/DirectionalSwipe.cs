using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DirectionalSwipe : Movement {

	public float Movforce;
	public Transform crumbparent;
	public GameObject crumb;
	public int max;
	public float framegap;
	public float mindist;
	public float forceMax;

	private Transform target;
	private Vector2 startPos;
	private Vector2 prevPos;
	private SpriteRenderer sprtRen;
	private float col_timer;
	private bool zooming;
	private bool pressed = false;
	private float swipe_timer;
	private int frame;
	private Camera cam;
	private Vector2 currentPoint;
	private bool launched;
	private bool moved;
	private float time;

	void Start(){
		cam = Camera.main;
	}
	
	// Update is called once per frame
	void Update () {
		movement ();
		mobileMovment ();
		mouseMovment ();
	}

	void makeDot (Vector3 pos)
	{
		GameObject obj = Instantiate (crumb, pos, Quaternion.identity) as GameObject;
		obj.transform.SetParent (crumbparent);
	}

	void mobileMovment ()
	{
		if (Input.touchCount > 0) {
			Touch touch = Input.touches [0];

//			Debug.Log ("MAG: "+touch.deltaPosition.magnitude);
//			if(touch.deltaPosition.magnitude>mindist||moved){
//				moved = true;
//				if ((frame % framegap == 0 && frame< framegap*max)) {
//					lastPoint = cam.ScreenToWorldPoint (touch.position);
//					lastPoint = new Vector3 (lastPoint.x, lastPoint.y, 0);
//					GameObject obj = Instantiate (crumb, lastPoint, Quaternion.identity) as GameObject;
//					//				Debug.Log (lastPoint);
//					obj.transform.SetParent(crumbparent);
//				}
//				else if(!launched && frame>= framegap*max){
//					Launch (lastPoint);
//				}
//			}


			switch (touch.phase) {
			case TouchPhase.Began:
				startPos = cam.ScreenToWorldPoint (touch.position);
				currentPoint = startPos;
				prevPos = currentPoint;
				launched = false;
				moved = false;
				frame = 0;
				time = 0;
				//				Debug.Log ("startPos:"+startPos);
				makeDot (startPos);
				break;
			case TouchPhase.Moved:
				if (touch.deltaPosition.magnitude > mindist || moved) {
					moved = true;
					if (frame < max ) {
						currentPoint = cam.ScreenToWorldPoint (touch.position);
						Vector3 dir = (currentPoint - startPos);
						//					Debug.Log ("last:" + lastPoint + " + start:" + startPos + " = dir:" + (lastPoint - startPos));
						//					dir /= Time.deltaTime;
						Vector2 clampVelo = Vector3.Normalize (dir);
						float forceon = Movforce * Vector2.Distance (prevPos, currentPoint);
						forceon = Mathf.Clamp(forceon,0,forceMax);
						Debug.Log (forceon);
						float a = frame/(max*1f);
						float b = 2f*Mathf.PI;
						float c = Mathf.PI / 2f;
						float delta = (Mathf.Sin(a*b-c)+1f)/2f;
						//					Debug.Log (clampVelo);
						body.AddForce (clampVelo*(forceon*delta));
						prevPos = currentPoint;
						//					Debug.Log ("max "+max);
						//					Debug.Log ("frame "+frame);
						//					Debug.Log ("mov "+Movforce);
						//					Debug.Log ("combo "+(Movforce*((max-frame)/(max*1f))));
						makeDot (currentPoint);
						//					Debug.Log ("Velocity "+body.velocity+" direction "+dir+" time "+Time.deltaTime);
						frame++;
					}
				}
				break;
			case TouchPhase.Ended:
				deletecrumbs ();
				break;
			}

		}
	}

	void mouseMovment ()
	{
		if (Input.mousePresent) {

			//			Debug.Log ("MAG: "+touch.deltaPosition.magnitude);
			//			if(touch.deltaPosition.magnitude>mindist||moved){
			//				moved = true;
			//				if ((frame % framegap == 0 && frame< framegap*max)) {
			//					lastPoint = cam.ScreenToWorldPoint (touch.position);
			//					lastPoint = new Vector3 (lastPoint.x, lastPoint.y, 0);
			//					GameObject obj = Instantiate (crumb, lastPoint, Quaternion.identity) as GameObject;
			//					//				Debug.Log (lastPoint);
			//					obj.transform.SetParent(crumbparent);
			//				}
			//				else if(!launched && frame>= framegap*max){
			//					Launch (lastPoint);
			//				}
			//			}


			if (Input.GetMouseButtonDown(0)) {
				startPos = cam.ScreenToWorldPoint (Input.mousePosition);
				currentPoint = startPos;
				prevPos = currentPoint;
				launched = false;
				moved = false;
				frame = 0;
				time = 0;
				//				Debug.Log ("startPos:"+startPos);
				makeDot (startPos);
			} else if (Input.GetMouseButtonUp(0)) {
				deletecrumbs ();
			}else {
				if (frame < max) {
					currentPoint = cam.ScreenToWorldPoint (Input.mousePosition);
					Vector3 dir = (currentPoint - startPos);
//					Debug.Log ("last:" + lastPoint + " + start:" + startPos + " = dir:" + (lastPoint - startPos));
//					dir /= Time.deltaTime;
					Vector2 clampVelo = Vector3.Normalize (dir);
					float forceon = Movforce * Vector2.Distance (prevPos, currentPoint);
					forceon = Mathf.Clamp(forceon,0,forceMax);
//					Debug.Log (forceon);
					float a = frame/(max*1f);
					float b = 2f*Mathf.PI;
					float c = Mathf.PI / 2f;
					float delta = (Mathf.Sin(a*b-c)+1f)/2f;
//					Debug.Log (clampVelo);
					body.AddForce (clampVelo*(forceon*delta));
					prevPos = currentPoint;
//					Debug.Log ("max "+max);
//					Debug.Log ("frame "+frame);
//					Debug.Log ("mov "+Movforce);
//					Debug.Log ("combo "+(Movforce*((max-frame)/(max*1f))));
					makeDot (currentPoint);
//					Debug.Log ("Velocity "+body.velocity+" direction "+dir+" time "+Time.deltaTime);
					frame++;
				}
			}

		}
	}

	void Launch(Vector2 touch){
//		Debug.Log ("tch:" + touch + "   st:" + startPos);
		Vector3 swipeDir = touch - startPos;
		float swipeDist = swipeDir.magnitude;
//		Debug.Log ("Direction:" + swipeDir + "   Distance:" + swipeDist);
		swipeDist = Mathf.Clamp (swipeDist, .457f, 4.16f);
		Movforce = 870 * Mathf.Log (swipeDist + 1.3f) - 80;
//		Debug.Log ("Move force: " + Movforce);
		deletecrumbs ();
		body.AddForce ((swipeDir / swipeDist) * Movforce);
		if (JukeBox.instance.getSFX())
			m_Zoom.Play ();
		launched = true;
	}

	void movement ()
	{
		if (!pressed) {
			if (Input.GetKey ("up")) {
				pressed = true;
				body.AddForce (new Vector2 (0, Movforce));
			}else if (Input.GetKey ("down")) {
				pressed = true;
				body.AddForce (new Vector2 (0, -Movforce));
			}if (Input.GetKey ("right")) {
				pressed = true;
				body.AddForce (new Vector2 (Movforce, 0));
			} else if (Input.GetKey ("left")) {
				pressed = true;
				body.AddForce (new Vector2 (-Movforce, 0));
			}
			if (JukeBox.instance.getSFX())
				m_Zoom.Play ();

		} else if(!Input.anyKey){
			pressed = false;
		}
	}

	void OnTriggerEnter2D(Collider2D col){
		m_Pointer.TriggerDetected (col);
	}

	public void deletecrumbs(){
		foreach (Transform child in crumbparent) {
			GameObject.Destroy(child.gameObject);
		}
	}

	public void setMAx(string num){
		max = int.Parse(num);
	}

	public void setGap(string num){
		framegap = float.Parse(num);
	}

	public void setMinDist(string num){
		mindist = float.Parse(num);
	}

	public void setMinFor(string num){
		Movforce = float.Parse(num);
	}

	public void setforceMax(string num){
		forceMax = float.Parse(num);
	}
}
