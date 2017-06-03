using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class UIAnimator : MonoBehaviour {
	public static UIAnimator instance;

	public Animator myAnim;

	private int current;
	private int info;
	private string clippe = "clip";
	private bool reset = false;


	// Use this for initialization
	void Awake () {
		instance = this;
		current = -1;
		if (LevelManager.instance) {
			if (LevelManager.instance.restart) {
				myAnim.SetInteger (clippe,-3);
			}else{
				myAnim.SetInteger (clippe,-2);
			}
		}
	}

	void resetCurrent(){
		myAnim.SetInteger (clippe, -1);
	}

	void playGame(){
		UIManager.instance.PlayGame ();
	}

	void beginGame(){
		if (LevelManager.instance.restart) {
			UIManager.instance.PlayGame ();
		}
	}

	void ResumeGame(){
		UIManager.instance.ResumeGame ();
	}

	void PauseGame(){
		UIManager.instance.PauseGame ();
	}

	void reMenu(){
		UIManager.instance.MainMenu (reset);
	}

	public void returnMenu(bool set){
		reset = set;
		myAnim.SetInteger (clippe,7);
	}

	public void UIClick(int num){
		current = num;
		myAnim.SetInteger (clippe,current);

	}

	public void exitUI(){
		myAnim.SetInteger (clippe,current*11);
	}


}
