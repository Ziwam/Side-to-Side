
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LockOnEnemy : LockOn {

	[Header("Enemy Settings")]
	public float QuickscopeTimer = .2f;
	public string FriendlyTag;
	public bool AimToKill = true;
	public bool FreindlyFire = true;
	public AudioSource LockedSound;

	private Roaming m_roam;
	private float roamSpeed;
	private bool lockplayed;

	protected override void Awake ()
	{
		base.Awake ();
		m_roam = GetComponentInParent<Roaming> ();
		roamSpeed = m_roam.speed;
	}

	void OnDisable(){
		if(GameManager.instance.CurrentState != GameManager.g_States.Menu)
		Instantiate (m_explode, transform.position, Quaternion.identity);
		parentTrans.position = new Vector3 (0, 500, 0);
		Targets.Clear ();
	}

//	void OnEnable(){
//		Debug.Log ("hello");
//	}

	protected override void prepareLaunch ()
	{
		col_timer += Time.deltaTime;
		float timeshift = col_timer / LockOnShift;

		m_roam.speed = Mathf.Lerp (roamSpeed, 0, Mathf.Pow(timeshift,10));

		if (LockOnShift - col_timer > QuickscopeTimer) {
			lineLaser.enabled = false;
			lockplayed = false;
		} else {
			lineLaser.enabled = true;
			sprtRen.material.color = locked_Color;

			if (JukeBox.instance.getSFX ())
				playSound ();
				
		}
		Launch ();
	}

	void playSound ()
	{
		if (!lockplayed){
			LockedSound.Play ();
			lockplayed = true;
		}
	}

	protected override void restLaunch ()
	{
		sprtRen.material.color = rest_Color;
		col_timer = 0;
		lineLaser.enabled = false;
		m_roam.speed = roamSpeed;
	}

	public override void TriggerDetected (Collider2D obj)
	{
		throw new System.NotImplementedException ();
	}

	public override void ColliderDetected (Collision2D col)
	{
		GameObject obj = col.gameObject;
		if (zooming && obj.tag == TargetTag) {
			if (!obj.GetComponent<Movement> ().isZooming () && AimToKill)
				obj.SetActive (false);
		} else if (zooming && obj.tag == FriendlyTag) {
			if (!obj.GetComponent<Movement> ().isZooming () && FreindlyFire) {
				obj.SetActive (false);
			}else if(obj.GetComponent<Movement> ().isZooming () && FreindlyFire){
				obj.SetActive (false);
			}
		}
	}
}
