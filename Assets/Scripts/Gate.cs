using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Gate : MonoBehaviour {

	public delegate void DelegateNon();
	public DelegateNon Triggered;
	public delegate void DelegateInt(int num);
	public DelegateInt Activated;

	public Color col_On;

	private bool active;
	private Color col_Off;
	private SpriteRenderer spit_ren;
	private int index;

	void Awake(){
		spit_ren = GetComponent<SpriteRenderer> ();
		col_Off = spit_ren.color;
	}

	public void CloseGate(){
		if (IsActive) {
			IsActive = false;
			Triggered ();
		}
	}

	public bool IsActive{
		get
		{
			return active;
		}

		set
		{
			active = value;
			if (active) {
				spit_ren.color = col_On;
				Activated (index);
			} else {
				spit_ren.color = col_Off;
			}
		}
	}

	public int Gate_Index{
		set
		{
			index = value;
		}
	}

}
