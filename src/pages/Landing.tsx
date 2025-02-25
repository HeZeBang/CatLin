import { HwItem } from "../components/HomeworkUtils";

export default function Landing() {
  return (
    <div className="flex gap-3 items-center justify-center flex-col w-full max-w-md">
      <HwItem 
        course="Computer Architecture I"
        title="Homework 1"
        submitted={false}
        due={1740499140}
        url="https://www.gradescope.com/courses/985840"
      />
    </div>
  )
}