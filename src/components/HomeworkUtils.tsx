import { Colors, PixelBorder } from "nes-ui-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Assignment } from "../lib/models/assignment";
import { GithubIcon } from "./Icons";

interface HomeworkItemProps {
  course: string,
  due: number,
  submitted: boolean,
  title: string,
  url: string,
  index: number,
  linked: boolean,
}

function randomColor(seed: number = 0) {
  return `hsl(${seed % 360}, 90%, 60%)`
}

function hslToRgb(h: number, s: number, l: number) {
  h /= 360;
  s /= 100;
  l /= 100;

  let r, g, b;
  if (s === 0) {
    r = g = b = l; // 灰色
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function getRelativeLuminance(r: number, g: number, b: number) {
  const normalize = (x: number) => {
    x /= 255;
    return x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * normalize(r) + 0.7152 * normalize(g) + 0.0722 * normalize(b);
}

function getContrastRatio(l1: number, l2: number) {
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

function randomTextColor(seed: number = 0) {
  // black or white based on WCAG
  const h = seed % 360;
  const s = 90;
  const l = 30;
  const [r, g, b] = hslToRgb(h, s, l);
  const bgLum = getRelativeLuminance(r, g, b);
  const blackLum = getRelativeLuminance(0, 0, 0);
  const whiteLum = getRelativeLuminance(255, 255, 255);
  const blackRatio = getContrastRatio(bgLum, blackLum);
  const whiteRatio = getContrastRatio(bgLum, whiteLum);
  return blackRatio > whiteRatio ? Colors.black : Colors.white;
}

export function simpleHash(str: string) {
  return str.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
}

function getTimeDifference(timestamp1: number, timestamp2: number) {
  const difference = Math.abs(timestamp1 - timestamp2);

  const days = Math.floor(difference / (1000 * 60 * 60 * 24)); // 天
  const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // 小时
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)); // 分钟
  const seconds = Math.floor((difference % (1000 * 60)) / 1000); // 秒

  return { days, hours, minutes, seconds, sign: timestamp1 >= timestamp2 };
}

export function HwItem(props: HomeworkItemProps) {
  const dateItem = new Date(props.due * 1000)
  const dateOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    //  second: '2-digit', 
    hour12: false
  } as Intl.DateTimeFormatOptions;
  const [difference, setDifference] = useState(getTimeDifference(props.due * 1000, Date.now()))
  const randColor = randomColor(simpleHash(`${props.course}`))
  const randTextColor = randomTextColor(simpleHash(`${props.course}`))
  const isPasted = !difference.sign
  const navigate = useNavigate()

  useEffect(() => {
    const interval = setInterval(() => {
      setDifference(getTimeDifference(props.due * 1000, Date.now()));
    }, 30 * 1000); // 30s

    return () => clearInterval(interval);
  })

  return (
    <PixelBorder doubleRoundCorners className="w-full">
      {/* <span className="text-xl block text-right w-full text-red-500" style={{
        top: "-0.2rem",
        right: "-0.5em",
        position: "relative",
        lineHeight: "0",
        zIndex: 1,
      }}>●</span> */}
      <button className={`homework nes-ui-icon-btn nes-ui-is-size-medium w-full ${props.submitted ? "" : ""}`}
        style={
          props.submitted ? {} :
            {
              backgroundColor: randColor,
              color: randTextColor
            }}
        onClick={() => {
          navigate(`/details/${props.index}`)
        }}
      >
        <div className="p-2 flex gap-1 items-center w-full">
          <div className="text-2xl flex flex-col gap-0 max-w-[1em]">
            <p className={`text-2xl text-left max-w-[1em] text-wrap`}>
              {props.submitted ? <span>{"☑"}</span> : <span className="box">{"☐"}</span>}
            </p>
            <GithubIcon className={`${props.linked ? "" : "opacity-20"}`} />
          </div>
          <div className="flex-grow flex gap-1 flex-wrap">
            <div className="flex flex-col items-start flex-1">
              <span className={`text-2xl text-left`}>{props.title}</span>
              <span className="text-sm text-left opacity-70">{props.course}</span>
            </div>
            <div className="flex items-end flex-col">
              <div className={`flex gap-1`}>
                {props.submitted ?
                  (<span className="text-xl">SUBMITTED</span>) : (
                    <div className={isPasted ? "text-xl" : "text-4xl"}>
                      {isPasted ? <span className="text-2xl">PAST</span> : null}
                      <span>{difference.days}<sup className="text-sm">d</sup></span>
                      <span>{difference.hours}<sup className="text-sm">h</sup></span>
                      <span>{difference.minutes}<sup className="text-sm">m</sup></span>
                    </div>
                  )}
              </div>
              <span className="flex gap-1">
                <span>Due:</span>
                <span>{dateItem.toLocaleString('zh-CN', dateOptions)}</span>
              </span>
            </div>
          </div>
        </div>
      </button>
    </PixelBorder>
  )
}

export interface HomeworkItem {
  id: string,
  course: string,
  due: number,
  submitted: boolean,
  title: string,
  url: string,
  latedute?: number,
  raw?: any,
  status: string,
  platform: string,
  catType: number,
  rawAssignment?: Assignment,
}