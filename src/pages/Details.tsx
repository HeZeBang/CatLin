import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { HomeworkItem, simpleHash } from "../components/HomeworkUtils";
import { AccountType, LoadHomework } from "../components/Utils";
import { Badge, Container, NamedColor, Toast } from "nes-ui-react";

interface ReplyItem {
  message: string,
  name: string,
  badge: string,
  rating?: number
}

const bgColor = ["primary", "success", "warning", "error"] as NamedColor[]

export function HomeworkDetails() {
  const { id } = useParams();
  const [_, setHomeworks] = useState<HomeworkItem[]>([])
  const [currentHomework, setCurrentHomework] = useState<HomeworkItem>()
  const dateOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    //  second: '2-digit', 
    hour12: false
  } as Intl.DateTimeFormatOptions;

  const dummyReplies = [
    {
      message: "好难不想写了TT",
      name: "赶作业的土豆泥",
      badge: "评论家",
      rating: 1,
    },
    {
      message: "你这么在意这个评分干嘛？这会把作业给异化掉的！",
      name: "红烧鸡翅",
      badge: "准点达人"
    }
  ] as ReplyItem[]


  useEffect(() => {
    var hwTemp = [] as HomeworkItem[]
    Object.values(AccountType).forEach((type) => {
      hwTemp = [...hwTemp, ...LoadHomework(type)]
    })
    hwTemp.sort((a, b) => b.due - a.due)
    setHomeworks(hwTemp)
    if (!isNaN(Number(id)))
      setCurrentHomework(hwTemp[Number(id)])
  }, [])
  return (
    <>
      {isNaN(Number(id)) ? (
        <span>Invalid ID</span>
      ) : (
        <div className="w-full max-w-md mx-5">
          <div className="flex gap-3 md:flex-row flex-col">
            <div className="md:flex-1">
              <p className="text-5xl font-bold">{currentHomework?.title}</p>
              <p className="text-xl">{currentHomework?.course}</p>
            </div>
            <div className="flex gap-3 flex-rows md:flex-col justify-end align-middle">
              {/* <p className="text-md md:text-4xl text-right">5.0</p> */}
              <div className="flex gap-1">
                <i className="nes-icon like is-medium" style={{ marginRight: "40px" }} />
                <p className="text-xl md:text-2xl text-right items-center flex">多半好评</p>
              </div>
              {/* <Badge backgroundColor="success" text="多半好评"
                className="text-sm"
                style={{
                  margin: 0,
                  alignSelf: "flex-end"
                }} /> */}
              <div className="flex flex-row justify-end gap-3 items-center">
                <span className="flex text-base">5.0</span>
                <div>
                  <i className="nes-icon star scale-125" style={{ marginRight: "8px", marginBottom: 0 }} />
                  <i className="nes-icon star scale-125" style={{ marginRight: "8px", marginBottom: 0 }} />
                  <i className="nes-icon star scale-125" style={{ marginRight: "8px", marginBottom: 0 }} />
                  <i className="nes-icon star scale-125" style={{ marginRight: "8px", marginBottom: 0 }} />
                  <i className="nes-icon star scale-125" style={{ marginRight: "8px", marginBottom: 0 }} />
                </div>
              </div>
            </div>
          </div>
          <Container title="" className="w-full my-3">
            <p>截止日期：{currentHomework?.due ? new Date(currentHomework.due * 1000).toLocaleDateString('zh-cn', dateOptions) : ""}</p>
            <p>5 人评分 / 5 人评论</p>
          </Container>

          <div className="flex-col gap-3">
            <span className="text-xl">最新评论</span>
            {
              dummyReplies.map((item, index) =>
                <Toast bubblePostion={index % 2 ? "right" : "left"} className="w-full">
                  <div className="w-full text-left">
                    <div className="w-full flex gap-3">
                      <p className="text-xl">{item.name}</p>
                      <Badge backgroundColor={bgColor[simpleHash(item.badge) % bgColor.length]} text={item.badge} />
                    </div>
                    <p>{item.message}</p>
                  </div>
                </Toast>
              )
            }
          </div>
        </div>
      )}
    </>
  )
}