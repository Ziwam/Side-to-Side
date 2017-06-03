using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Tutorial : MonoBehaviour {

	public Animator anim;

	private LockOnPlayer lok;
	
	// Update is called once per frame
	void changeClip (int num) {
		anim.SetTrigger ("Gate");
		Time.timeScale = 0f;
	}

	public void startClip(Movement m_Player){
		gameObject.SetActive (true);
		LockOn locker = m_Player.getLockOn ();
		if (locker.GetType () == typeof(LockOnPlayer)) {
			lok = locker as LockOnPlayer;
			lok.AddPoint += changeClip;
		}
	}

	public void ExitTutorial(){
		PlayerPrefs.SetInt (UIManager.key_TUTORIAL, 1);
		lok.AddPoint -= changeClip;
		gameObject.SetActive (false);
		Time.timeScale = 1f;
	}
}
