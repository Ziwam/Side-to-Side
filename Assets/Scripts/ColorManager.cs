using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ColorManager : MonoBehaviour {
	public static ColorManager instance;

	public Light BG_Top_Light;
	public Light BG_Bottom_Light;
	public Light BG_Left_Light;
	public Light BG_Right_Light;
	public Light BG_Light;
	public Gate Gate_Color;
	public Coin Coin_Color;
	public List<Scheme> schemes;

	public int num=0;

	// Use this for initialization
	void Awake () {
		if (!instance) {
			instance = this;
		} else {
			Destroy (gameObject);
		}
		GameObject.DontDestroyOnLoad (gameObject);

		foreach (Scheme child in transform.GetComponentsInChildren<Scheme>()) {
			if(child.enabled)
			schemes.Add (child);
		}

		num = Random.Range (0, schemes.Count);
	}


	public void ColorShift ()
	{
		if (++num >= schemes.Count)
			num = 0;
		//Gate Lights
		BG_Top_Light.color = schemes [num].BGGateLight;
		BG_Bottom_Light.color = schemes [num].BGGateLight;
		BG_Left_Light.color = schemes [num].BGGateLight;
		BG_Right_Light.color = schemes [num].BGGateLight;
		//BG Light
		BG_Light.color = schemes [num].BGLight;
		//Gate On
		Gate_Color.col_Off = schemes [num].GateOff;
		//Gate Off
		Gate_Color.col_On = schemes [num].GateOn;
		//Coin Color
		Coin_Color.col_On = schemes [num].Coin_Color;
	}
}
