using UnityEngine;
using System.Collections;

public class FadeAudio : MonoBehaviour {

	public float Truevolume;
	public float volume;
	public AudioSource sound; 
	public float t;

//	// Use this for initialization
	void Start () {
		sound = GetComponent<AudioSource> ();
		volume = Truevolume;
	}

	void OnEnable(){
		if(!sound)
		sound = GetComponent<AudioSource> ();
		t = 0;
//		Debug.Log (volume + " :Volume "+ gameObject.name+" :Object " +"Enable");
		if (GameManager.instance.CurrentState == GameManager.g_States.Pause) {
			sound.volume = 0;
		}
	}
	
	// Update is called once per frame
	void Update () {
		if (GameManager.instance.CurrentState == GameManager.g_States.Pause || GameManager.instance.CurrentState == GameManager.g_States.GameOver) {
				t += .005f;
				sound.volume = Mathf.Lerp (sound.volume, 0, t*2);
			} else {
				t = 0;
				sound.volume = volume;

			}
	}
}
