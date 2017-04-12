
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LockOnEnemy : LockOn {

	[Header("Enemy Settings")]
	public float QuickscopeTimer = .2f;
	public string FriendlyTag;
	public bool AimToKill = true;
	public bool FreindlyFire = true;

	private Roaming m_roam;
	private float roamSpeed;

	protected override void Awake ()
	{
		base.Awake ();
		m_roam = GetComponentInParent<Roaming> ();
		roamSpeed = m_roam.speed;
	}

	protected override void prepareLaunch ()
	{
		col_timer += Time.deltaTime;
		float timeshift = col_timer / LockOnShift;
		sprtRen.color = Color.Lerp (rest_Color, locked_Color, Mathf.Pow(timeshift,5));

		m_roam.speed = Mathf.Lerp (roamSpeed, 0, Mathf.Pow(timeshift,10));

		if (LockOnShift - col_timer > QuickscopeTimer) {
			laser.enabled = false;
		} else {
			laser.enabled = true;
		}
		Launch ();
	}

	protected override void restLaunch ()
	{
		sprtRen.color = rest_Color;
		col_timer = 0;
		laser.enabled = false;
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
				Destroy (obj);
			}else if(obj.GetComponent<Movement> ().isZooming () && FreindlyFire){
				Destroy (obj);
				Destroy (gameObject);
			}
		}
	}
}
