using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class LevelManager : MonoBehaviour {

	public static LevelManager instance;

	// Use this for initialization
	void Awake () {
		if (!instance) {
			instance = this;
		} else {
			Destroy (gameObject);
		}
		GameObject.DontDestroyOnLoad (gameObject);
	}

	void Start(){
		UIManager.instance.resetRecentScore ();
	}

	public void ResetGame(){
		SceneManager.LoadScene (0);
	}
}
