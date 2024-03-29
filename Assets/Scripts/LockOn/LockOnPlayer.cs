﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LockOnPlayer : LockOn {

	public delegate void DelegateInt(int num);
	public DelegateInt AddCoin;
	public DelegateInt AddPoint;
	public DelegateInt GameOver;
	public string CollectTag;
	[Range(0f,1f)]
	public float Chain;

	public int score = 0;

	void OnDisable(){
		if(GameManager.instance.CurrentState == GameManager.g_States.Play)
		GameOver (score);
		if(GameManager.instance.CurrentState != GameManager.g_States.Menu)
		Instantiate (m_explode, transform.position, Quaternion.identity);
	}

	protected override void prepareLaunch ()
	{
		col_timer += Time.deltaTime;
		sprtRen.material.color = Color.Lerp (rest_Color, locked_Color, col_timer / LockOnShift);
		if (Input.GetKey ("space"))
			Launch ();
	}

	protected override void restLaunch ()
	{
		
		col_timer = 0;
		lineLaser.enabled = false;

	}
		 

	public override void TriggerDetected (Collider2D col)
	{
		GameObject obj = col.gameObject;
		if(obj.tag == CollectTag){
			AddCoin (obj.GetComponent<Coin> ().Collect());
			obj.SetActive (false);
		}else if (obj.CompareTag(TargetTag)) {
			Gate gate = obj.GetComponent<Gate> ();
			if (gate != null && gate.IsActive) {
				gate.CloseGate ();
				score++;
				AddPoint (score);
			}
		}
	}

	public override void ColliderDetected (Collision2D col)
	{
		
//		GameObject obj = col.gameObject;
//		if (obj.CompareTag(TargetTag)) {
//			Gate gate = obj.GetComponent<Gate> ();
//			if (gate != null && gate.IsActive) {
//				gate.CloseGate ();
//				score++;
//				AddPoint (score);
//			}
//		}
	
	}
}
