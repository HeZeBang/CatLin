import { PixelBorder } from "nes-ui-react";
import Nyan from "../assets/nyan.webp";
import "../App.css";

export default function Settings() {
  return (
    <div className="flex gap-3 items-center justify-center flex-col">
      <h1 className="text-5xl sm:text-8xl">CatLin</h1>
      <h2 className="text-2xl py-3">=＾● ⋏ ●＾=</h2>
      <PixelBorder doubleSize doubleRoundCorners>
        <img src={Nyan} alt="Nyan Cat" className="w-full h-full"/>
      </PixelBorder>
      <p className="text-2xl items-center flex gap-3">
        Made by C4TL1N with <i className="nes-icon is-medium heart"/>
      </p>
    </div>
  )
}