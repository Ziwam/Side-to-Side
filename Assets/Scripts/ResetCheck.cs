using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ResetCheck : MonoBehaviour {

	// Use this for initialization
	void Awake(){
		if (LevelManager.instance) {
			if (LevelManager.instance.restart)
				LevelManager.instance.restart = false;
		}
	}
}
