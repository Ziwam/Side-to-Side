using UnityEngine;
using System.Collections;

public class Skin : Purchasable {

	public GameObject particle;

	public Material getSkin(){
		return image;
	}

	public GameObject getParticle(){
		return particle;
	}
}
