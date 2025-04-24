
import { Button, PixelBorder } from "nes-ui-react";
import Nyan from "../assets/nyan.webp";
import "../App.css";
import { useContext, useEffect, useState } from "react";
import HeroImage from "../assets/avatar-50x50.png";
import { get, post } from "../lib/fetcher";
import { UserContext } from "../App";
import { toast } from "sonner";

interface Comment {
  creator_id: string;
  creator_name: string;
  content: string;
  rating?: number;
}

export default function About() {
  const [meowText, setMeowText] = useState("=^·.·^=")
  const [comment, setComment] = useState("")
  const [comments, setComments] = useState([] as Comment[])
  const { userId, userName } = useContext(UserContext)

  // setTimeout
  useEffect(() => {
    const meowTexts = [
      "=^·.·^=",
      "=^ -.- ^=",
    ]
    const interval = setInterval(() => {
      setMeowText(meowTexts[Math.floor(Math.random() * meowTexts.length)])
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    get<Comment[]>("/api/comments").then((res) => {
      setComments(res)
    })
  }, [])


  const addBadge = (task_id: string) =>
    fetch("/api/task/progress", {
      method: "POST",
      body: JSON.stringify({ task_id }),
    })
      .then((res) => {
        if (res.status === 200) {
          return res.json()
        } else {
          return Promise.reject(new Error("Failed to add badge"));
        }
      })

  return (
    <div className="flex gap-3 items-center justify-center flex-col">
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <img src={HeroImage.src} alt="CatLin" className="w-24 h-24 hero-avatar active:scale-90"
          onClick={() => {
            addBadge("M30W~")
              .finally(() => {
                toast.info("喵~")
              })
          }}
        />
        <h1 className="text-5xl mt-0">CatLin</h1>
      </div>
      <h2 className="text-2xl pb-3">{meowText}</h2>
      <PixelBorder doubleSize doubleRoundCorners>
        <img src={Nyan.src} alt="Nyan Cat" className="w-full h-full" />
      </PixelBorder>
      <span className="text-2xl scale-50 text-center">
        <span>Made by C4TL1N</span>{' '}
        <span className="text-nowrap">with <i className="align-middle inline-block nes-icon is-medium heart" />.</span>
      </span>
      <PixelBorder doubleRoundCorners className="w-full p-1 mx-3 mb-3">
        <div className="flex flex-col gap-3 items-center justify-center"
          style={{
            borderImageWidth: "2",
            borderImageRepeat: "initial",
          }}
        >
          <span className="text-xl">留言版</span>
          {comments.map((comment, index) => (
            <div className="nes-balloon nes-ui-toast from-left self-start flex-col" key={index}>
              {/* <span className="text-2xl">{comment.rating ? "⭐" : "☆"}</span> */}
              <span className="text-sm opacity-70">{comment.creator_name}</span>
              <p>{comment.content}</p>
            </div>
          ))}

          <a className="nes-balloon nes-ui-toast from-left self-start">
            <input
              className="text-md bg-inherit p-2 my-1 mr-1 focus:border-4 nes-ui-input"
              placeholder="我也要说……"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <Button onClick={() => {
              const newComment = {
                content: comment,
                creator_id: userId,
                creator_name: userName || "匿名",
                rating: -1,
              } as Comment
              post("/api/comments", newComment).then(() => {
                setComments([...comments, newComment])
                setComment("")
              })
            }}>
              发送
            </Button>
          </a>
        </div>
      </PixelBorder>
    </div>
  )
}