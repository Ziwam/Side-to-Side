using UnityEngine;
using System.Collections;

public class SlowAudio : MonoBehaviour {

	private AudioSource sound;

	void Start(){
		sound = GetComponent<AudioSource> ();
	}
	
	// Update is called once per frame
	void Update () {
		sound.pitch = Mathf.Pow ((Time.timeScale + 1), 2) / 4;
//		if (UIManager.instance) {
//			if (!UIManager.Paused || !UIManager.instance.getGameover()) {
//
//			}
//		}
	}
}
