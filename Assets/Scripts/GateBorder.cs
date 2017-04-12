using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class GateBorder : MonoBehaviour {

	public delegate void DelegateNon();
	public DelegateNon GateTriggered;
	public delegate void DelegateInt(int num);
	public DelegateInt BorderActivated;

	public int Angle;
	public bool Vertical;
	public bool Opposite;
	public float thickness;

	private List<Gate> gates;
	private Camera camMain;
	private Gate Gate_Object;
	private int current_Active_Gate;
	private bool open_gate;
	private int numBoxes;
	private int numerOfGates;
	private int index;
	private float screenAspect;

	void Awake (){
		camMain = Camera.main;
		gates = new List<Gate> ();
		screenAspect = camMain.aspect;
	}

	void sortGates(){
		float height = camMain.orthographicSize;
		float width = height * screenAspect;

		float arg1 = 0;
		float arg2 = 0;
		float arg3 = 0;

		for (int i = 0; i < numBoxes; i++) {
			Gate gate = gates [i];

			if (Vertical) {
				arg1 = (width / numBoxes) * (i * 2) + (width / numBoxes) - width;
				arg2 = height;
				if(Opposite)
					arg2 *= -1;
				arg3 = width * (2f / numBoxes);
			} else {
				arg1 = width;
				arg2 = (height / numBoxes) * (i * 2) + (height / numBoxes) - height;
				if(Opposite)
					arg1 *= -1;
				arg3 = height * (2f / numBoxes);
			}

			Vector3 pos = new Vector3 (arg1, arg2, 0);
			gate.transform.position = pos;
			gate.transform.localScale = new Vector3 (arg3, thickness, 1);
		}	

	}

	void GateClosed(){
		GateTriggered ();
	}

	void GateActivated(int num){
		current_Active_Gate = num;
		BorderActivated (index);
	}

	public void ActivateFirstGate(){
		if (open_gate)
			DeactivateGate ();
		int num = 0;
		gates [num].IsActive = true;
		open_gate = true;
		current_Active_Gate = num;
	}

	public void ActivateRandomGate(ref List<Gate> candidates){
		if (open_gate)
			DeactivateGate ();
		for (int i = 0; i < gates.Count; i++) {
			candidates.Add (gates[i]);
		}
	}

	public void ActivateFromBottom(int num, ref List<Gate> candidates){
		if (open_gate)
			DeactivateGate ();
		num = Mathf.Clamp (num,0,gates.Count);
		for (int i = gates.Count-num; i < gates.Count; i++) {
			candidates.Add (gates[i]);
		}
	}

	public void ActivateFromTop(int num, ref List<Gate> candidates){
		if (open_gate)
			DeactivateGate ();
		num = Mathf.Clamp (num,0,gates.Count);
		for (int i = 0; i < num; i++) {
			candidates.Add (gates[i]);
		}
	}

	public void DeactivateGate(){
		if (open_gate) {
			gates [current_Active_Gate].IsActive = false;
			open_gate = false;
		}
	}

	public void setGate(Gate obj){
		Gate_Object = obj;
	}

	public int LeftCount(){
		int num = 0;
		for (int i = 0; i < current_Active_Gate; i++) {
			num++;
		}
		return num;
	}

	public int RightCount(){
		int num = 0;
		for (int i = current_Active_Gate; i < gates.Count-1; i++) {
			num++;
		}
		return num;
	}

	public void createGate(int num){
		numerOfGates = num;
		if (!Vertical) {
			if (screenAspect < 1)
			if (num > 1) {
				num = Mathf.FloorToInt(num*(1 / screenAspect));
			} else {
				num = Mathf.CeilToInt(num*(1 / screenAspect));
			}
		} else {
			if(screenAspect>1)
			if (num > 1) {
				num = Mathf.FloorToInt(num*(screenAspect));
			} else {
				num = Mathf.CeilToInt(num*(screenAspect));
			}
		}

		int j = num - gates.Count;
		for (int i = 0; i < j; i++) {
			Gate obj = Instantiate (Gate_Object, Gate_Object.transform.position, Quaternion.Euler (0, 0, Angle)) as Gate;
			obj.transform.SetParent (transform);
			obj.Triggered += GateClosed;
			obj.Activated += GateActivated;
			obj.Gate_Index = numBoxes;
			gates.Add (obj);
			numBoxes++;
		}
		sortGates ();
	}

	public int number_Gates{
		get
		{
			return numerOfGates;
		}
	}

	public int Border_Index{
		set
		{
			index = value;
		}
	}
}
