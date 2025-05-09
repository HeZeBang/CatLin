import { useCallback, useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AssignmentItem } from "../components/HomeworkUtils";
import { AccountType, LoadHomework, RemoveAssignment, SaveAssignment } from "../components/Utils";
import { Button, Container, Toast, Modal, Header, Footer, Spacer } from "nes-ui-react";
import { get, post } from "../lib/fetcher";
import { UserContext } from "../App";
import { AssignmentT } from "../models/assignment";
import { availableBadges } from "../models/badges";
import { LoginButton } from "../components/LoginButton";
import { HomeworkT } from "../models/homework";
import { GithubIcon } from "../components/Icons";
import { toast } from "sonner";
import { AuthComponent } from "@/components/Auth";
import { HomeworkCommentPostT, HomeworkCommentT } from "@/models/homework_comment";
import confetti from "canvas-confetti";
import { dummyCats } from "@/data/cats";

interface ICat {
  avatar: string;
  name: string;
  happiness: number;
  hunger: number;
  owned?: boolean;
  description?: string;
}

export default function HomeworkDetails() {
  const { userName, user, userId, addBadge } = useContext(UserContext);
  const { id } = useParams();
  const [_, setHomeworks] = useState<AssignmentItem[]>([])
  const [currentAssignment, setcurrentAssignment] = useState<AssignmentItem>()
  const [linkedHomework, setLinkedHomework] = useState<HomeworkT>()
  const [comment, setComment] = useState("")
  const [rate, setRate] = useState(5)
  const [comments, setComments] = useState([] as HomeworkCommentT[])
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedCat, setSelectedCat] = useState<ICat | null>(null)
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
    var hwTemp = [] as AssignmentItem[]
    Object.values(AccountType).forEach((type) => {
      hwTemp = [...hwTemp, ...LoadHomework(type)]
    })
    hwTemp.sort((a, b) => b.due - a.due)
    console.log("hwTemp: ", hwTemp)
    setHomeworks(hwTemp)
    if (!isNaN(Number(id)))
      setcurrentAssignment(hwTemp[Number(id)])
  }, [])

  useEffect(() => {
    // fetch homework info
    console.log("currentAssignment: ", currentAssignment)
    if (currentAssignment?.parent) {
      get<HomeworkT>(`/api/homework/${currentAssignment.parent}`)
        .then((res) => {
          console.log("Homework: ", res)
          setLinkedHomework(res)
        })
    } else if (currentAssignment) {
      post<HomeworkT[]>("/api/homework/match", {
        platform: currentAssignment?.platform || "Custom",
        course: currentAssignment?.course,
        title: currentAssignment?.title,
        due: currentAssignment?.due as number // TODO: replace it with real due date
      }).then((res) => {
        setLinkedHomework(res[0]) // TODO: replace with selection
      }).catch((err) => {
        // toast.error(`Error: ${err}`)
      })
    }
  }, [currentAssignment])

  const showCannon = () => {
    const end = Date.now() + 1 * 1000; // 3 seconds
    const colors = ["#a786ff", "#fd8bbc", "#eca184", "#f8deb1"];
 
    const frame = () => {
      if (Date.now() > end) return;
 
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        startVelocity: 60,
        origin: { x: 0, y: 0.5 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        startVelocity: 60,
        origin: { x: 1, y: 0.5 },
        colors: colors,
      });
 
      requestAnimationFrame(frame);
    };
 
    frame();
  };

  const assignHomework = () => {
    if (currentAssignment) {
      setModalOpen(true)
    }
  }

  const confirmAssignHomework = () => {
    if (currentAssignment && selectedCat) {
      post<AssignmentT>("/api/assignment/claim", {
        platform: currentAssignment.platform || "Custom",
        course: currentAssignment.course,
        title: currentAssignment.title,
        due: currentAssignment.due,
        submitted: currentAssignment.submitted,
        url: currentAssignment.url,
        cat_type: dummyCats.findIndex(cat => cat.avatar === selectedCat.avatar)
      })
        .then((res) => {
          console.log("Due: ", res.due, "Current: ", currentAssignment.due)
          let newAssignment = {
            ...currentAssignment,
            id: res._id,
            cat_type: dummyCats.findIndex(cat => cat.avatar === selectedCat.avatar),
            platform: res.platform,
            course: res.course,
            submitted: res.submitted,
            title: res.title,
            url: res.url,
            parent: res.parent
          } as AssignmentItem
          setcurrentAssignment(newAssignment)
          SaveAssignment(res.platform as AccountType || AccountType.Custom, newAssignment)
          return res.parent
        })
        .then((homeworkId) => get<HomeworkT>(`/api/homework/${homeworkId}`))
        .then((newHomework) => {
          console.log("New Homework: ", newHomework)
          setLinkedHomework(newHomework)
        })
        .then(() => {
          // Create a new cat for the user
          return post("/api/cat", {
            type: dummyCats.findIndex(cat => cat.avatar === selectedCat.avatar),
            x: (Math.random() * 10 - 5).toFixed(1).toString(),
            y: (Math.random() * 4 - 2).toFixed(1).toString(),
            taskState: 0,
            owned: true
          });
        })
        .then(() => {
          addBadge("homework1")
            .finally(() => {
              // toast.info("你获得了一个称号")
            })
          showCannon()
          toast.success("获得了一只新的猫猫！")
          setModalOpen(false)
        })
    }
  }

  const rejectClaim = () => {
    post<AssignmentT>("/api/assignment/reject", {
      title: currentAssignment?.title,
      course: currentAssignment?.course,
      platform: currentAssignment?.platform,
    })
      .then((res) => {
        console.log(res)
      })
      .finally(() => {
        setcurrentAssignment({
          ...currentAssignment,
          id: "",
          parent: "",
        } as AssignmentItem)
        SaveAssignment(currentAssignment?.platform as AccountType || AccountType.Custom, {
          ...currentAssignment,
          id: "",
          parent: "",
        } as AssignmentItem)
      })
  }

  useEffect(() => {
    // fetch comments
    if (linkedHomework)
      get<HomeworkCommentT[]>(`/api/homework/${linkedHomework._id}/comments`)
        .then((res) => {
          console.log("Comments: ", res)
          setComments(res)
        })
  }, [linkedHomework])

  const submitComment = useCallback(() => {
    if (currentAssignment?.parent) {
      post<HomeworkCommentT>(`/api/homework/${currentAssignment?.parent}/comments`, {
        creator_name: userName,
        creator_badge: user?.current_badge,
        is_annonymous: false,
        content: comment,
        rating: rate,
        parent: currentAssignment.parent,
      } as HomeworkCommentPostT).then((res) => {
        setComment("")
        setComments([...comments, res])
      })
    } else {
      toast.error("请先认领作业")
    }
  }, [userName, comment, currentAssignment, comments, rate])

  return (
    <>
      {isNaN(Number(id)) ? (
        <span>Invalid ID</span>
      ) : (
        <div className="w-full max-w-md mx-5">
          <div className="flex justify-between items-center pb-3">
            <div>
              <Button className="w-full" borderInverted
                onClick={() => {
                  window.history.back()
                }}
              >
                返回
              </Button>
            </div>
            <div className="flex gap-1 flex-1 max-w-1/2">
              {
                currentAssignment?.id ? (
                  <>
                    <Button className="w-full" color="error" borderInverted
                      onClick={rejectClaim}
                    >
                      取消认领
                    </Button>
                    {
                      currentAssignment?.finished_task? 
                      <Button className="w-full" color="success" borderInverted onClick={() => {
                        addBadge("homework1")

                        // TODO: some logic here

                        // Cancel the indicator
                        setcurrentAssignment({
                          ...currentAssignment,
                          finished_task: 0,
                        } as AssignmentItem)

                        // Sync
                        SaveAssignment(currentAssignment?.platform as AccountType || AccountType.Custom, {
                          ...currentAssignment,
                          finished_task: 0,
                        } as AssignmentItem)

                        toast.success("奖励已到账～")
                      }}>
                        领取奖励
                      </Button> : <></>
                    }
                  </>
                ) : (
                  <Button className="w-full" color="primary" borderInverted onClick={assignHomework}>
                    认领并开始
                  </Button>
                )
              }
              {/* <Button className="w-full" color="error" borderInverted
                onClick={() => {
                  RemoveAssignment(currentAssignment?.platform as AccountType || AccountType.Custom, currentAssignment as AssignmentItem)
                  window.history.back()
                }}
              >
                删除作业
              </Button> */}
            </div>
          </div>
          <div className="flex gap-3 md:flex-row flex-col">
            <div className="md:flex-1">
              <p className="text-5xl font-bold">{currentAssignment?.title}</p>
              <p className="text-xl">{currentAssignment?.course}</p>
            </div>
            {
              linkedHomework ? (
                <div className="flex gap-2 flex-rows md:flex-col justify-between md:justify-center align-middle">
                  <div className="flex gap-1 justify-center">
                    <i className={`nes-icon like is-medium ${linkedHomework.rating_sum / linkedHomework.rating_num >= 4 ? "" : "is-empty"}`} style={{ marginRight: "35px" }} />
                    <p className="text-xl md:text-2xl text-right items-center flex mb-0">
                      {linkedHomework.rating_num > 0 ?
                        (linkedHomework.rating_sum / linkedHomework.rating_num >= 4
                          ? "多半好评"
                          : linkedHomework.rating_sum / linkedHomework.rating_num >= 2
                            ? "褒贬不一"
                            : "多半差评"
                        )
                        : ("人数不足")
                      }
                    </p>
                  </div>
                  <div className="flex flex-row justify-end gap-3 items-center">
                    <span className="flex text-base">{(linkedHomework.rating_sum / linkedHomework.rating_num).toFixed(1)}</span>
                    <div>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`nes-icon star scale-150 ${star <= linkedHomework.rating_sum / linkedHomework.rating_num ? "" : "is-transparent"}`}
                          style={{ marginRight: "10px", marginBottom: "3px" }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center items-center">
                  <span className="text-gray-400">还没有人认领过……</span>
                </div>
              )
            }
          </div>
          <Container title="" className="w-full my-3 flex flex-col-reverse md:flex-row">
            <div className="flex-grow">
              {
                currentAssignment &&
                <span className="text-lg flex gap-3 mb-2">
                  <span className="flex items-center gap-1">
                    <span>{currentAssignment.submitted ? "☑" : "☐"}</span>
                    {currentAssignment.submitted ? "已提交" : "未提交"}
                  </span>
                  {/* <span>{linkedHomework ? <span>{"☑Catlin 已收录"}</span> : <span className="box">{"☐Catlin 未收录"}</span>}</span> */}
                  <span className="flex items-center gap-1">
                    <GithubIcon className={`${currentAssignment.id ? "" : "opacity-20"}`} />
                    {currentAssignment.id ? "已认领" : "未认领"}
                  </span>
                </span>
              }
              <p>截止日期：{currentAssignment?.due ? new Date(currentAssignment.due).toLocaleDateString('zh-cn', dateOptions) : ""}</p>
              <p>平台：{currentAssignment?.platform}</p>
              {linkedHomework && <p>共有 {linkedHomework.users.length} 人一起参与</p>}
              {linkedHomework && comments && <p>已有 {comments.length} 条评论和评分</p>}
            </div>
            <div className={`w-auto flex justify-center ${currentAssignment?.id ? "" : "opacity-0"}`}>
              {
                currentAssignment?.id &&
                <img src={`/avatars/${dummyCats[currentAssignment.cat_type]?.avatar || "white"}.png`} className="max-w-24 max-h-24" />
              }
            </div>
          </Container>

          <div className="flex-col gap-3">
            <span className="text-xl">最新评论</span>
            {comments.length == 0 ? (
              <span className="block w-full text-lg text-center py-5 opacity-50">还没有评论</span>
            ) :
              comments.filter((item) => item.content !== "").map((item, index) =>
                <Toast bubblePostion={index % 2 ? "right" : "left"} className="w-full" key={index}>
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
                                  className={`nes-icon star scale-150 ${star <= item.rating ? "" : "is-transparent"}`}
                                  style={{ marginRight: "10px", marginBottom: "3px" }}
                                />
                              ))
                            }
                          </div>
                        </div>
                      }
                    </div>
                    <p>{item.content}</p>
                    <p className="content-center w-full text-end opacity-50">
                      {`${item.create_at ? new Date(item.create_at).toLocaleDateString('zh-cn', dateOptions) : ""}`}
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
                            className={`${availableBadges.at(user?.current_badge || 0)?.color} text-xs`}
                          >
                            {availableBadges.at(user?.current_badge || 0)?.name || ""}
                          </span>
                        </div>
                      </>
                    ) : (
                      <AuthComponent />
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
                          className={`nes-icon star scale-150 ${star <= rate ? "" : "is-transparent"}`}
                          style={{ marginRight: "10px", marginBottom: "3px" }}
                          onMouseEnter={() => setRate(star)}
                        />
                      ))
                    }
                  </div>
                </div>
                <input
                  className="text-md bg-inherit p-2 my-1 mr-1 focus:border-4 nes-ui-input"
                  placeholder="我也要说……"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button onClick={submitComment}>
                  {comment ? '发送' : '评分'}
                </Button>
              </div>
            </Toast>
          </div>

          <Modal open={modalOpen} title="选择猫猫" className="max-w-sm">
            <Header>
              <span className="text-lg">选择一只猫猫来陪伴你完成作业</span>
            </Header>
            <div className="flex flex-col gap-1 p-3 max-h-[60vh] overflow-y-auto">
              {dummyCats.map((cat, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center p-2 hover:backdrop-brightness-75 active:scale-90 ${selectedCat === cat ? "border-4 border-primary" : ""}`}
                  onClick={() => {
                    // if (cat.owned) {
                      setSelectedCat(cat)
                    // }
                  }}
                >
                  <img src={`/avatars/${cat.avatar}.png`} className="w-16 h-16" />
                  <div className="nes-badge w-2/3">
                    <span className="is-primary">
                      {cat.name}
                    </span>
                  </div>
                  {cat.description && <span className="text-sm">{cat.description}</span>}
                </div>
              ))}
            </div>
            <Footer>
              <Spacer />
              <Button color="white" className="mx-1" onClick={() => setModalOpen(false)}>取消</Button>
              <Button color="primary" className="mx-1" disabled={!selectedCat} onClick={confirmAssignHomework}>确认</Button>
            </Footer>
          </Modal>
        </div>
      )}
    </>
  )
}