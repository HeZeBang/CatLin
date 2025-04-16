import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { HomeworkItem } from "../components/HomeworkUtils";
import { AccountType, LoadHomework, RemoveAssignment, SaveAssignment } from "../components/Utils";
import { Button, Container, Toast } from "nes-ui-react";
import { get, post } from "../lib/reqUtils";
import { UserContext } from "../App";
import { Assignment, AssignmentComment, AssignmentCommentArray } from "../models/assignment";
import { availableBadges } from "../models/badges";
import { LoginButton } from "../components/LoginButton";
import { Homework } from "../models/homework";
import { GithubIcon } from "../components/Icons";

export function HomeworkDetails() {
  const { userName, user, userId } = useContext(UserContext);
  const { id } = useParams();
  const [_, setHomeworks] = useState<HomeworkItem[]>([])
  const [currentHomework, setCurrentHomework] = useState<HomeworkItem>()
  const [linkedHomework, setLinkedHomework] = useState<Homework>()
  const [comment, setComment] = useState("")
  const [rate, setRate] = useState(5)
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

  useEffect(() => {
    // fetch homework info
    console.log("currentHomework: ", currentHomework)
    if (currentHomework?.rawAssignment?.parent) {
      get<Homework>(`/api/homework/${currentHomework.rawAssignment.parent}`)
        .then((res) => {
          console.log("Homework: ", res)
          setLinkedHomework(res)
        })
    } else if (currentHomework) {
      post<Homework[]>("/api/homework/match", {
        platform: currentHomework?.platform || "Custom",
        course: currentHomework?.course,
        title: currentHomework?.title,
        due: currentHomework?.due
      }).then((res) => {
        console.log(res)
        setLinkedHomework(res[0]) // TODO: replace with selection
      })
    }
  }, [currentHomework, comments])

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

  const rejectClaim = () => {
    const newHomework = {
      ...currentHomework,
      id: "",
      rawAssignment: undefined,
    } as HomeworkItem
    post<Assignment>("/api/assignment/reject", {
      title: currentHomework?.title,
      course: currentHomework?.course,
      platform: currentHomework?.platform,
    })
      .then((res) => {
        console.log(res)
      })
      .finally(() => {
        setCurrentHomework(newHomework)
        SaveAssignment(currentHomework?.platform as AccountType || AccountType.Custom, newHomework)
      })
  }

  useEffect(() => {
    // fetch comments
    if (currentHomework?.rawAssignment?.parent)
      get<AssignmentCommentArray>(`/api/assignment/comment/${currentHomework?.rawAssignment?.parent}`)
        .then((res) => {
          console.log("Comments: ", res)
          setComments(res)
        })
  }, [linkedHomework])

  const submitComment = useCallback(() => {
    post<AssignmentComment>("/api/assignment/comment", {
      content: comment,
      rating: rate,
      parent: currentHomework?.rawAssignment?.parent,
    }).then((res) => {
      setComment("")
      setComments([...comments, res])
    })
  }, [comment, currentHomework, comments, rate])

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
                    onClick={rejectClaim}
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
            {
              linkedHomework &&
              <div className="flex gap-1 flex-rows md:flex-col justify-end align-middle">
                {/* <p className="text-md md:text-4xl text-right">5.0</p> */}
                <div className="flex gap-1">
                  <i className={`nes-icon like is-medium ${linkedHomework.ratingSum / linkedHomework.ratingNumber >= 4 ? "" : "is-empty"}`} style={{ marginRight: "35px" }} />
                  <p className="text-xl md:text-2xl text-right items-center flex">
                    {linkedHomework.ratingNumber > 0 ?
                      (linkedHomework.ratingSum / linkedHomework.ratingNumber >= 4
                        ? "多半好评"
                        : linkedHomework.ratingSum / linkedHomework.ratingNumber >= 2
                          ? "褒贬不一"
                          : "多半差评"
                      )
                      : ("人数不足")
                    }
                  </p>
                </div>
                <div className="flex flex-row justify-end gap-3 items-center">
                  <span className="flex text-base">{(linkedHomework.ratingSum / linkedHomework.ratingNumber).toFixed(1)}</span>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`nes-icon star scale-125 ${star <= linkedHomework.ratingSum / linkedHomework.ratingNumber ? "" : "is-transparent"}`}
                        style={{ marginRight: "8px", marginBottom: 0 }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            }
          </div>
          <Container title="" className="w-full my-3 flex">
            <div className="flex-grow">
              {
                currentHomework &&
                <span className="text-lg flex gap-3 mb-2">
                  <span className="flex items-center gap-1">
                    <span>{currentHomework.submitted ? "☑" : "☐"}</span>
                    {currentHomework.submitted ? "已提交" : "未提交"}
                  </span>
                  {/* <span>{linkedHomework ? <span>{"☑Catlin 已收录"}</span> : <span className="box">{"☐Catlin 未收录"}</span>}</span> */}
                  <span className="flex items-center gap-1">
                    <GithubIcon className={`${currentHomework.id ? "" : "opacity-20"}`} />
                    {currentHomework.id ? "已认领" : "未认领"}
                  </span>
                </span>
              }
              <p>截止日期：{currentHomework?.due ? new Date(currentHomework.due * 1000).toLocaleDateString('zh-cn', dateOptions) : ""}</p>
              <p>平台：{currentHomework?.platform}</p>
              {linkedHomework && <p>共有 {linkedHomework.users.length} 人一起参与</p>}
              {linkedHomework && comments && <p>已有 {comments.length} 条评论和评分</p>}
            </div>
            <div className={`max-w-24 ${currentHomework?.id ? "" : "opacity-0"}`}>
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
              comments.filter((item) => item.content !== "").map((item, index) =>
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
                      {item.rating &&
                        <div className="flex flex-grow justify-end gap-3 items-center">
                          <span className="flex text-base">{item.rating.toFixed(1)}</span>
                          <div>
                            {
                              [1, 2, 3, 4, 5].map((star) => (
                                <i
                                  key={star}
                                  className={`nes-icon star scale-125 ${star <= item.rating ? "" : "is-transparent"}`}
                                  style={{ marginRight: "8px", marginBottom: 0 }}
                                />
                              ))
                            }
                          </div>
                        </div>
                      }
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
                    userId ? (
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

                <div className="flex flex-row gap-3 items-center">
                  <span className="flex text-base">{rate.toFixed(1)}</span>
                  <div>
                    {
                      [1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`nes-icon star scale-125 ${star <= rate ? "" : "is-transparent"}`}
                          style={{ marginRight: "8px", marginBottom: 0 }}
                          onMouseEnter={() => setRate(star)}
                        />
                      ))
                    }
                  </div>
                </div>
                <input
                  className="text-md bg-inherit p-2 my-1 mr-1 focus:border-4"
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