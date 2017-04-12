using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DirectionalSwipe : Movement {

	public float Movforce;

	private Transform target;
	private Vector2 startPos;
	private SpriteRenderer sprtRen;
	private float col_timer;
	private bool zooming;
	private bool pressed = false;
	private float swipe_timer;
	
	// Update is called once per frame
	void Update () {
		movement ();
		mobileMovment ();
	}

	void mobileMovment ()
	{
		if (Input.touchCount > 0) {
			Touch touch = Input.touches [0];
			switch (touch.phase) {
			case TouchPhase.Began:
				startPos = touch.position;
				break;
			case TouchPhase.Ended:
				Vector3 swipeDir = touch.position - startPos;
				float swipeDist = swipeDir.magnitude;
				swipeDist = Mathf.Clamp (swipeDist, 90, 869);
				Movforce = 360 * Mathf.Log (swipeDist - 37) - 1020;
				Debug.Log ("Move force: "+ Movforce);
				body.AddForce ((swipeDir / swipeDist) * Movforce);
				break;
			}
		}
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

		} else if(!Input.anyKey){
			pressed = false;
		}
	}

	void OnTriggerEnter2D(Collider2D col){
		m_Pointer.TriggerDetected (col);
	}
}
