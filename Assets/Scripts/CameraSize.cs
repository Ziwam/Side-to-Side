using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraSize : MonoBehaviour {
	
	public Camera cam;

	// Use this for initialization
	void Awake () {
		float ratio = (Screen.width*.1f) / (Screen.height*.1f);
		cam.orthographicSize = (ratio * -3.2f) + 6.2f;
	}
}
