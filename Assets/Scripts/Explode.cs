using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Explode : MonoBehaviour {

	public ParticleSystem particls;
	public AudioSource Boom;
	public int ToEmit;

	// Use this for initialization
	void Start () {
		StartCoroutine (explosion ());
	}

	IEnumerator explosion ()
	{
		particls.Emit (ToEmit);
		if (JukeBox.instance.getSFX ())
			Boom.Play ();
		yield return new WaitForSecondsRealtime (1.5f);
//		Destroy (gameObject);
	}
}
