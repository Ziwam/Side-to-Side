using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Scheme : MonoBehaviour {

	public Color BGGateLight;
	public Color BG_Gate_Light{
		get{return BGGateLight; }
		set{BGGateLight = value; }
	}
		
	public Color GateOn;
	public Color Gate_On{
		get{return GateOn; }
		set{GateOn = value; }
	}

	public Color BGLight;
	public Color BG_Light{
		get{return BGLight; }
		set{BGLight = value; }
	}

	public Color GateOff;
	public Color Gate_Off{
		get{return GateOff; }
		set{GateOff = value; }
	}

	public Color Coin;
	public Color Coin_Color{
		get{return Coin; }
		set{Coin = value; }
	}


}
