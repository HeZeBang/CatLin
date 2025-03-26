using UnityEngine;

public class CatIdleState : CatState
{
    public CatIdleState(Cat _cat, CatStateMachine _stateMachine, string _animBoolName) : base(_cat, _stateMachine, _animBoolName)
    {
    }

    public override void Enter()
    {
        base.Enter();
        cld.offset = new Vector2(-0.08095586f, -0.07425693f);
        cld.size = new Vector2(1.880327f, 1.089688f);
        // cat.anim.transform.localScale = new Vector3(0.3f, 0.3f, 0f);
        // timeUpperBound = 20f;
        timeUpperBound = 2f;
    }

    public override void Update()
    {
        base.Update();
        timer += Time.deltaTime;
        if (timer >= timeUpperBound)
        {
            int ctn = Random.Range(0, 2);
            if (ctn == 0)
            {
                int opt = Random.Range(0, 2);
                if (opt == 0)
                {
                    stateMachine.ChangeState(cat.kelState);
                }
                else
                {
                    stateMachine.ChangeState(cat.tiredState);
                }
            }
            else
            {
                timeUpperBound += Random.Range(5, 10);
            }
        }
    }

    public override void Exit()
    {
        base.Exit();
    }
}