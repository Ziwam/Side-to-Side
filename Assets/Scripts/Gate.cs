using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Gate : MonoBehaviour {

	public delegate void DelegateNon();
	public DelegateNon Triggered;
	public delegate void DelegateInt(int num);
	public DelegateInt Activated;

	public LightTransform m_light;
	public ParticleSystem m_particle;
	public int toEmit;
	public Color col_On;
	public Color col_Off;
	public AudioSource m_Beep;

	private bool active;
	private MeshRenderer spit_ren;
	private int index;

	void Awake(){
		spit_ren = GetComponent<MeshRenderer> ();
		spit_ren.material.color = col_Off;
	}

	public void CloseGate(){
		if (IsActive) {
			m_particle.Emit (toEmit);
			IsActive = false;
			Triggered ();
			if (JukeBox.instance.getSFX())
				m_Beep.Play ();
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
				spit_ren.material.color = col_On;
				Activated (index);
				m_light.LightActive = true;
			} else {
				spit_ren.material.color = col_Off;
				m_light.LightActive = false;
			}
		}
	}

	public int Gate_Index{
		set
		{
			index = value;
		}
	}

	public void ChangeScale(Vector3 scl){
		transform.localScale = scl;
//		m_light.ShiftShadowTransform (scl.x);
	}

	public void setShadowLayer(string lay){
		m_light.changeLayer (lay);
	}

}
