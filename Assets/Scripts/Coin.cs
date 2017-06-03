using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Coin : MonoBehaviour {

	public int CoinValue;
	public GameObject m_explode;
	public Color col_On;

	private MeshRenderer spit_ren;

	void Awake(){
		spit_ren = GetComponent<MeshRenderer> ();
		spit_ren.material.color = col_On;
	}

	public int Collect(){
		if(GameManager.instance.CurrentState != GameManager.g_States.Menu)
			Instantiate (m_explode, transform.position, Quaternion.identity);
		transform.position = new Vector3 (0, 500, 0);
		return CoinValue;
	}
}
