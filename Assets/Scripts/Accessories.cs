using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Accessories : MonoBehaviour {

	[SerializeField]
	private MeshRenderer m_PlayerSprite;
	[SerializeField]
	private GameObject m_PlayerParticle;

	// Use this for initialization
	void Start () {
		
	}

	public void setSprite(Material spt){
		m_PlayerSprite.material = spt;
	}

	public void setParticle(GameObject obj){
		if (m_PlayerParticle)
			Destroy (m_PlayerParticle);

		m_PlayerParticle = Instantiate (obj,new Vector3(0,0,.5f),Quaternion.identity,transform) as GameObject;
	}
}
