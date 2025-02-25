
import { PixelBorder } from "nes-ui-react";
import Nyan from "../assets/nyan.webp";
import "../App.css";

export default function About() {
  return (
    <div className="flex gap-3 items-center justify-center flex-col">
      <h1 className="text-5xl sm:text-8xl">CatLin</h1>
      <h2 className="text-2xl py-3">=＾● ⋏ ●＾=</h2>
      <PixelBorder doubleSize doubleRoundCorners>
        <img src={Nyan} alt="Nyan Cat" className="w-full h-full" />
      </PixelBorder>
      <span className="text-2xl scale-50">
        Made by C4TL1N with <i className="align-middle inline-block nes-icon is-medium heart" />.
      </span>
    </div>
  )
}