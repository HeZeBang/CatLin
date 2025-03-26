using UnityEngine;

public class MouseClickDetect : MonoBehaviour
{
    void Start()
    {
        Debug.Log("MouseClickDetect");
    }

    void Update()
    {
        if (Input.GetMouseButtonDown(0))
        {
            Debug.Log(Input.mousePosition);

            // 获取鼠标在屏幕上的位置并转换为世界坐标中的射线
            Ray ray = Camera.main.ScreenPointToRay(Input.mousePosition);

            // 将 3D 射线的起点投影到 2D 平面（通常是 Z=0 的平面）
            Vector2 rayOrigin = new Vector2(ray.origin.x, ray.origin.y); // 使用射线的 X 和 Y 坐标作为 2D 射线的起点
            Vector2 rayDirection = new Vector2(ray.direction.x, ray.direction.y).normalized; // 使用射线的方向

            Debug.Log(ray);

            RaycastHit2D hit = Physics2D.Raycast(rayOrigin, rayDirection);

            if (hit.collider != null) // 检查是否有碰撞
            {
                Debug.Log("Its a go");

                switch (hit.collider.gameObject.tag)
                {
                    case "Cat":
                        Debug.Log("FUCK");
                        break;
                    default:
                        break;
                }
            }
        }
    }
}
