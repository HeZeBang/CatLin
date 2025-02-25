import { PixelBorder } from "nes-ui-react";
import { useState, useEffect } from "react";

interface HomeworkItemProps {
  course: string,
  due: number,
  submitted: boolean,
  title: string,
  url: string,
}

function randomColor(seed: number = 0) {
  return ["primary", "success", "warning", "error", "normal"][Math.floor(seed) % 5]
}

function simpleHash(str: string) {
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

  useEffect(() => {
    const interval = setInterval(() => {
      setDifference(getTimeDifference(props.due * 1000, Date.now()));
    }, 30 * 1000); // 30s

    return () => clearInterval(interval);
  })

  return (
    <PixelBorder doubleRoundCorners className="w-full">
      <button className={`nes-ui-icon-btn nes-ui-btn-${randomColor(simpleHash(`${props.course} - ${props.title}`))} nes-ui-is-size-medium w-full`}>
        <div className="p-2 flex gap-3 items-center w-full flex-wrap">
          <div className="flex flex-col items-start flex-1">
            <span className="text-2xl text-left">{props.title}</span>
            <span className="text-sm text-left opacity-70">{props.course}</span>
          </div>
          <div className="flex items-end flex-col">
            <div className="flex gap-1">
              <span className="text-4xl">{difference.days}<sup className="text-sm">d</sup></span>
              <span className="text-4xl">{difference.hours}<sup className="text-sm">h</sup></span>
              <span className="text-4xl">{difference.minutes}<sup className="text-sm">m</sup></span>
            </div>
            <span className="flex gap-1">
              <span>Due:</span>
              <span>{dateItem.toLocaleString('zh-CN', dateOptions)}</span>
            </span>
          </div>
        </div>
      </button>
    </PixelBorder>
  )
}

export interface HomeworkItem {
  course: string,
  due: number,
  submitted: boolean,
  title: string,
  url: string,
  latedute?: number,
  raw?: any,
  status: string,
}