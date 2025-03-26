using UnityEngine;

public class Cat : MonoBehaviour
{
    public CatStateMachine stateMachine;

    public CatIdleState idleState { get; private set; }
    public CatKelState kelState { get; private set; }
    public CatTiredState tiredState { get; private set; }

    public Animator anim { get; private set; }
    public BoxCollider2D cld { get; private set; }

    public Background background;

    private float lastClickTime = 0f;
    private float doubleClickDelay = 0.3f; // 双击的最大时间间隔
    private bool isEditing = false; // 是否进入编辑模式
    private Vector3 dragStartPos; // 拖拽开始的位置
    private Vector3 initialPosition; // 拖拽开始时的位置

    private void Awake()
    {
        stateMachine = new CatStateMachine();
        idleState = new CatIdleState(this, stateMachine, "idle");
        kelState = new CatKelState(this, stateMachine, "kel");
        tiredState = new CatTiredState(this, stateMachine, "tired");
    }

    private void Start()
    {
        anim = transform.Find("Animator").GetComponent<Animator>();
        cld = GetComponent<BoxCollider2D>();
        stateMachine.Initialize(idleState);
        background = GameObject.Find("Background").GetComponent<Background>();
    }

    private void Update()
    {
        stateMachine.currentState.Update();

        // 如果进入编辑模式，处理拖拽逻辑
        if (isEditing)
        {
            DragObject();
        }
        else
        {
            // 检测双击
            DetectDoubleClick();
        }

        // 将背景的位置变化应用到猫的当前位置
        Vector3 positionChange = background.GetPositionChange();
        transform.position += new Vector3(positionChange.x, positionChange.y, 0);
    }

    private void DetectDoubleClick()
    {
        if (Input.GetMouseButtonDown(0))
        {
            // 检测鼠标点击位置是否在猫的碰撞体内
            Vector2 mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            if (cld.OverlapPoint(mousePosition))
            {
                // 检查双击
                if (Time.time - lastClickTime < doubleClickDelay)
                {
                    // 进入编辑模式
                    isEditing = true;
                    initialPosition = transform.position; // 记录初始位置
                }
                lastClickTime = Time.time; // 更新上次点击时间
            }
        }
    }

    private void DragObject()
    {
        if (Input.GetMouseButton(0))
        {
            // 获取当前鼠标位置
            Vector3 mousePosition = Camera.main.ScreenToWorldPoint(Input.mousePosition);
            mousePosition.z = 0; // 确保 z 轴为 0

            // 计算拖动偏移量
            Vector3 offset = mousePosition - initialPosition;
            transform.position += offset; // 更新物体位置
            initialPosition = mousePosition; // 更新初始位置为当前鼠标位置
        }
        else if (Input.GetMouseButtonUp(0))
        {
            // 退出编辑模式
            isEditing = false;
        }
    }
}
