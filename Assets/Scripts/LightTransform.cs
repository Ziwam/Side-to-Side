using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LightTransform : MonoBehaviour {

	public Transform parentScale;

	// Use this for initialization

	public bool LightActive{
		get
		{
			return gameObject.activeSelf;
		}

		set
		{
			gameObject.SetActive(!value);
		}
	}

	public void ShiftShadowTransform(float xScale){
		transform.localScale = new Vector3 (xScale, 26, 1);
	}

	public void changeLayer(string lay){
		gameObject.layer = LayerMask.NameToLayer(lay);
	}
}
