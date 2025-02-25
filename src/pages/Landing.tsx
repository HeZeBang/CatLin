import { useEffect, useState } from "react";
import { HomeworkItem, HwItem } from "../components/HomeworkUtils";
import { AccountType, LoadHomework } from "../components/Utils";

export default function Landing() {
  const [homeworks, setHomeworks] = useState<HomeworkItem[]>([])

  useEffect(() => {
    var hwTemp = [] as HomeworkItem[]
    Object.values(AccountType).forEach((type) => {
      hwTemp = [...hwTemp, ...LoadHomework(type)]
    })
    hwTemp.sort((a, b) => a.due - b.due)
    setHomeworks(hwTemp)
  }, [])

  return (
    <div className="flex gap-3 items-center justify-center flex-col w-full max-w-md">
      {/* {homeworks
        .filter(item => item.due <= Date.now() / 1000 - 7 * 24 * 60 * 60)
        .map((hw, index) => (
          <HwItem
            key={index}
            course={hw.course}
            title={hw.title}
            submitted={hw.submitted}
            due={hw.due}
            url={hw.url}
          />
        ))} */}

      {homeworks
        .filter(item => item.due > Date.now() / 1000 - 7 * 24 * 60 * 60)
        .map((hw, index) => (
          <HwItem
            key={index}
            course={hw.course}
            title={hw.title}
            submitted={hw.submitted}
            due={hw.due}
            url={hw.url}
          />
        ))}
    </div>
  )
}