
import { PixelBorder } from "nes-ui-react";
import Nyan from "../assets/nyan.webp";
import "../App.css";
import { useEffect, useState } from "react";
import HeroImage from "../assets/avatar-50x50.png";

export default function About() {
  const [meowText, setMeowText] = useState("=^·.·^=")

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

  return (
    <div className="flex gap-3 items-center justify-center flex-col">
      <div className="flex items-center gap-1 flex-wrap justify-center">
        <img src={HeroImage} alt="CatLin" className="w-24 h-24 hero-avatar" />
        <h1 className="text-5xl mt-0">CatLin</h1>
      </div>
      <h2 className="text-2xl pb-3">{meowText}</h2>
      <PixelBorder doubleSize doubleRoundCorners>
        <img src={Nyan} alt="Nyan Cat" className="w-full h-full" />
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
          <div className="nes-balloon from-left self-start">
            <p>非常好 CatLin，使我的 DDL 旋转！爱来自上海</p>
          </div>
          <div className="nes-balloon from-right self-end">
            <p>姐妹们快入手，敏感肌也能用！！！！</p>
          </div>

          <a className="nes-balloon from-left self-start">
            <input
              className="text-md bg-inherit"
              placeholder="我也要说……"
            />
          </a>
        </div>
      </PixelBorder>
    </div>
  )
}