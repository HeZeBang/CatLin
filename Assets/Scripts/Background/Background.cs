using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Background : MonoBehaviour
{
    private Vector3 dragStartPos;
    private bool isDragging = false;
    private float dragStartTime;
    private const float longPressDuration = 0.1f;
    private Vector3 previousPosition;
    private bool clickThis;

    void Start()
    {
        clickThis = false;
        previousPosition = transform.position; // 初始化上一帧的位置
    }

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            // 进行光线检测
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);
            RaycastHit2D hit = Physics2D.Raycast(ray.origin, ray.direction);

            if (hit.collider != null && hit.transform == transform) // 检查是否命中当前物体
            {
                // 检查是否有其他物体在鼠标按下的位置阻挡
                RaycastHit2D[] hits = Physics2D.RaycastAll(ray.origin, ray.direction);

                bool hasOtherColliders = false;

                foreach (var h in hits)
                {
                    if (h.collider != null && h.transform != transform)
                    {
                        hasOtherColliders = true;
                        break;
                    }
                }

                if (!hasOtherColliders) // 确保没有其他物体阻挡
                {
                    // 记录鼠标按下时的位置
                    dragStartPos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
                    dragStartPos.z = 0; // 确保z轴为0
                    dragStartTime = Time.time; // 记录开始时间
                    // Debug.Log("GO THIS WAY");
                    clickThis = true;
                }
                else
                {
                    clickThis = false;
                }
            }
            else
            {
                clickThis = false;
            }
        }

        if (Input.GetMouseButton(0) && Time.time - dragStartTime > longPressDuration && clickThis)
        {
            // 如果已经开始拖动，继续拖动逻辑
            if (isDragging)
            {
                Vector3 currentMousePos = Camera.main.ScreenToWorldPoint(Input.mousePosition);
                currentMousePos.z = 0; // 确保z轴为0
                Vector3 direction = currentMousePos - dragStartPos; // 计算拖动方向

                // 仅更新 x 轴位置，保持 y 轴不变
                Vector3 newPosition = new Vector3(transform.position.x + direction.x, transform.position.y, transform.position.z);

                // 限制左右边界
                float screenWidth = Camera.main.orthographicSize * Screen.width / Screen.height;
                newPosition.x = Mathf.Clamp(newPosition.x, -screenWidth / 2, screenWidth / 2);

                // 更新位置
                transform.position = newPosition;

                // 更新拖动起始位置
                dragStartPos = currentMousePos;
            }
            else
            {
                // 一旦长按检测通过，设置为拖动状态
                isDragging = true;
            }
        }

        if (Input.GetMouseButtonUp(0))
        {
            clickThis = false;
            isDragging = false; // 结束拖动
        }
    }

    public Vector3 GetPositionChange()
    {
        // 计算当前帧与上一帧的位置差
        Vector3 positionChange = transform.position - previousPosition;

        // 更新上一帧位置为当前帧位置
        previousPosition = transform.position;

        // 返回位置变化量
        return positionChange;
    }
}
