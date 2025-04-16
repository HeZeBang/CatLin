import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { HomeworkItem, simpleHash } from "../components/HomeworkUtils";
import { AccountType, LoadHomework, RemoveAssignment, SaveAssignment } from "../components/Utils";
import { Badge, Button, Container, NamedColor, Toast } from "nes-ui-react";
import { get, post } from "../lib/reqUtils";
import { UserContext } from "../App";
import { platform } from "os";
import { Assignment, AssignmentComment, AssignmentCommentArray } from "../lib/models/assignment";
import { availableBadges } from "../lib/models/badges";
import { LoginButton } from "../components/LoginButton";

interface ReplyItem {
  message: string,
  name: string,
  badge: string,
  rating?: number
}

const bgColor = ["primary", "success", "warning", "error"] as NamedColor[]

export function HomeworkDetails() {
  const { userName, user, isLoggedIn } = useContext(UserContext);
  const { id } = useParams();
  const [_, setHomeworks] = useState<HomeworkItem[]>([])
  const [currentHomework, setCurrentHomework] = useState<HomeworkItem>()
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([] as AssignmentCommentArray)
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

  const assignHomework = () => {
    if (currentHomework)
      post<Assignment>("/api/assignment/claim", {
        platform: currentHomework.platform || "Custom",
        course: currentHomework.course,
        title: currentHomework.title,
        due: currentHomework.due,
        submitted: currentHomework.submitted,
        url: currentHomework.url,
        catType: 0, // TODO: replace it with real cat rype
      }).then((res) => {
        console.log(res)
        const newHomework = {
          ...currentHomework,
          id: res._id,
          catType: res.catType,
          platform: res.platform,
          course: res.course,
          due: res.due,
          submitted: res.submitted,
          title: res.title,
          url: res.url,
          rawAssignment: res,
        } as HomeworkItem
        setCurrentHomework(newHomework)
        SaveAssignment(res.platform as AccountType || AccountType.Custom, newHomework)
      })
  }

  const undoClaim = () => {
    const newHomework = {
      ...currentHomework,
      id: "",
      rawAssignment: undefined,
    } as HomeworkItem
    setCurrentHomework(newHomework)
    SaveAssignment(currentHomework?.platform as AccountType || AccountType.Custom, newHomework)
  }

  useEffect(() => {
    // fetch comments
    if (currentHomework?.rawAssignment?.parent)
      get<AssignmentCommentArray>(`/api/assignment/comment/${currentHomework?.rawAssignment?.parent}`)
        .then((res) => {
          console.log("Comments: ", res)
          setComments(res)
        })
  }, [currentHomework])

  const submitComment = useCallback(() => {
    post<AssignmentComment>("/api/assignment/comment", {
      content: comment,
      parent: currentHomework?.rawAssignment?.parent,
    }).then((res) => {
      setComment("")
      setComments([...comments, res])
    })
  }, [comment, currentHomework, comments])

  return (
    <>
      {isNaN(Number(id)) ? (
        <span>Invalid ID</span>
      ) : (
        <div className="w-full max-w-md mx-5">
          <div className="flex justify-between items-center">
            <div>
              <Button className="w-full" borderInverted
                onClick={() => {
                  window.history.back()
                }}
              >
                返回
              </Button>
            </div>
            <div className="flex gap-1">
              {
                currentHomework?.id ? (
                  <Button className="w-full" color="primary" borderInverted
                    onClick={undoClaim}
                  >
                    取消认领
                  </Button>
                ) : (
                  <Button className="w-full" color="primary" borderInverted onClick={assignHomework}>
                    认领作业
                  </Button>
                )
              }
              <Button className="w-full" color="error" borderInverted
                onClick={() => {
                  RemoveAssignment(currentHomework?.platform as AccountType || AccountType.Custom, currentHomework as HomeworkItem)
                  window.history.back()
                }}
              >
                删除作业
              </Button>
            </div>
          </div>
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
          <Container title="" className="w-full my-3 flex">
            <div className="flex-grow">
              <p>截止日期：{currentHomework?.due ? new Date(currentHomework.due * 1000).toLocaleDateString('zh-cn', dateOptions) : ""}</p>
              <p>平台：{currentHomework?.platform}</p>
              <p>5 人评分 / 5 人评论</p>
            </div>
            <div className="max-w-24">
              {
                currentHomework?.id &&
                <img src={`/avatars/white.png`} /> // TODO: replace with real cat
              }
            </div>
          </Container>

          <div className="flex-col gap-3">
            <span className="text-xl">最新评论</span>
            {comments.length == 0 ? (
              <span className="block w-full text-lg text-center py-5 opacity-50">还没有评论</span>
            ) :
              comments.map((item, index) =>
                <Toast bubblePostion={index % 2 ? "right" : "left"} className="w-full">
                  <div className="w-full text-left">
                    <div className="w-full flex gap-3">
                      <p className="text-xl">{item.creator_name}</p>
                      <div className="nes-badge">
                        <span
                          className={`${availableBadges.at(item.creator_badge)?.color} text-xs`}
                        >
                          {availableBadges.at(item.creator_badge)?.name || ""}
                        </span>
                      </div>
                    </div>
                    <p>{item.content}</p>
                    <p className="content-center w-full text-end opacity-50">
                      {`${item.created_at ? new Date(item.created_at * 1000).toLocaleDateString('zh-cn', dateOptions) : ""}`}
                      {` #${index}`}
                    </p>
                  </div>
                </Toast>
              )
            }

            <Toast bubblePostion="left" className="w-fit">
              <div className="w-full text-left">
                <div className="w-full flex gap-3">
                  {
                    isLoggedIn ? (
                      <>
                        <p className="w-fit text-xl">{userName}</p>
                        <div className="nes-badge">
                          <span
                            className={`${availableBadges.at(user?.currentBadge || 0)?.color} text-xs`}
                          >
                            {availableBadges.at(user?.currentBadge || 0)?.name || ""}
                          </span>
                        </div>
                      </>
                    ) : (
                      <LoginButton />
                    )
                  }
                </div>

                <input
                  className="text-md bg-inherit"
                  placeholder="我也要说……"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button onClick={submitComment}>
                  发送
                </Button>
              </div>
            </Toast>
          </div>
        </div>
      )}
    </>
  )
}