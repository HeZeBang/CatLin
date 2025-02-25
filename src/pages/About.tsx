
import { PixelBorder } from "nes-ui-react";
import Nyan from "../assets/nyan.webp";
import "../App.css";
import { useEffect, useState } from "react";

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
      <h1 className="text-5xl sm:text-8xl">CatLin</h1>
      <h2 className="text-2xl py-3">{meowText}</h2>
      <PixelBorder doubleSize doubleRoundCorners>
        <img src={Nyan} alt="Nyan Cat" className="w-full h-full" />
      </PixelBorder>
      <span className="text-2xl scale-50 text-center">
        <span>Made by C4TL1N</span>{' '}
        <span className="text-nowrap">with <i className="align-middle inline-block nes-icon is-medium heart" />.</span>
      </span>
    </div>
  )
}